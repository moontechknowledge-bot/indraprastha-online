import { Request, Response } from 'express';
import { query } from '../lib/db.js';
import { OAuth2Client } from 'google-auth-library';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../lib/email.js';

const client = new OAuth2Client();
const JWT_SECRET = process.env.JWT_SECRET || 'indraprastha-secret-key';

const FOUNDER_EMAILS = ['moontechknowledge@gmail.com', 'anuragotwal@gmail.com'];

// Temporary in-memory store for OTPs
const otpStore = new Map<string, { otp: string, expires: number }>();

export const register = async (req: Request, res: Response) => {
  const { name, phone, email, password, fullName, requestedRole } = req.body;
  const userName = name || fullName;

  if (!userName || !phone) {
    return res.status(400).json({ error: 'Name and phone are required' });
  }

  try {
    const isFounder = email && FOUNDER_EMAILS.includes(email.toLowerCase());
    const role = isFounder ? 'founder' : (requestedRole || 'buyer');

    // Check if user exists by phone or email
    let existingUser;
    if (email) {
      [existingUser] = await query('SELECT id, name, phone, email, role FROM users WHERE phone = $1::text OR email = $2::text', [phone, email]);
    } else {
      [existingUser] = await query('SELECT id, name, phone, email, role FROM users WHERE phone = $1::text', [phone]);
    }

    if (existingUser) {
      // If user exists and is a founder, update role if not already
      if (isFounder && existingUser.role !== 'founder') {
        const [updatedUser] = await query(
          'UPDATE users SET role = $1 WHERE id = $2::uuid RETURNING id, name, phone, email, role',
          ['founder', existingUser.id]
        );
        const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ user: updatedUser, token });
      }
      
      // If user exists but requested a different role (e.g. buyer becoming seller)
      if (requestedRole && existingUser.role !== requestedRole && existingUser.role !== 'founder') {
        const [updatedUser] = await query(
          'UPDATE users SET role = $1 WHERE id = $2::uuid RETURNING id, name, phone, email, role',
          [requestedRole, existingUser.id]
        );
        const token = jwt.sign({ id: updatedUser.id, email: updatedUser.email, role: updatedUser.role }, JWT_SECRET, { expiresIn: '7d' });
        return res.json({ user: updatedUser, token });
      }

      const token = jwt.sign({ id: existingUser.id, email: existingUser.email, role: existingUser.role }, JWT_SECRET, { expiresIn: '7d' });
      return res.json({ user: existingUser, token });
    }

    // Create user
    const [user] = await query(
      'INSERT INTO users (name, phone, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, phone, email, role',
      [userName, phone, email || null, password || null, role]
    );

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ user, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const login = async (req: Request, res: Response) => {
  const { phone, email, isFounderBypass, requestedRole } = req.body;

  if (!phone && !email) {
    return res.status(400).json({ error: 'Phone or email is required' });
  }

  try {
    // Find user
    let user;
    if (email) {
      [user] = await query('SELECT id, name, phone, email, role FROM users WHERE email = $1::text OR phone = $2::text', [email, phone || '']);
    } else {
      [user] = await query('SELECT id, name, phone, email, role FROM users WHERE phone = $1::text', [phone]);
    }

    if (!user) {
      // If it's a founder email, create the user automatically even on login
      if (email && FOUNDER_EMAILS.includes(email.toLowerCase())) {
        const dummyPhone = '000000000' + FOUNDER_EMAILS.indexOf(email.toLowerCase());
        const [newUser] = await query(
          'INSERT INTO users (name, phone, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, phone, email, role',
          ['Founder', dummyPhone, email, 'founder_bypass_placeholder', 'founder']
        );
        user = newUser;
      } else {
        return res.status(404).json({ error: 'User not found' });
      }
    }

    const isFounder = user.email && FOUNDER_EMAILS.includes(user.email.toLowerCase());
    
    // Update role if it's a founder but role is not set correctly
    if (isFounder && user.role !== 'founder') {
      const [updatedUser] = await query(
        'UPDATE users SET role = $1 WHERE id = $2::uuid RETURNING id, name, phone, email, role',
        ['founder', user.id]
      );
      user = updatedUser;
    } else if (requestedRole && user.role !== requestedRole && user.role !== 'founder') {
      // If user is logging in via a specific flow (e.g. seller onboarding)
      const [updatedUser] = await query(
        'UPDATE users SET role = $1 WHERE id = $2::uuid RETURNING id, name, phone, email, role',
        [requestedRole, user.id]
      );
      user = updatedUser;
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getMe = async (req: any, res: Response) => {
  try {
    const [user] = await query('SELECT id, name, full_name, email, role, picture FROM users WHERE id = $1::uuid', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
};

export const googleLogin = async (req: Request, res: Response) => {
  const { credential, preferredRole } = req.body;
  
  if (!credential) {
    return res.status(400).json({ error: 'Google credential is required' });
  }

  try {
    // In dev mode or if client id is not set, we might rely on simple verification if needed
    // But let's try to verify properly
    const ticket = await client.verifyIdToken({
      idToken: credential,
      // audience: process.env.GOOGLE_CLIENT_ID // Optional: check audience if set
    });
    
    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ error: 'Invalid Google token' });
    }

    const { email, name, picture, sub: google_id } = payload;
    const isFounder = email && FOUNDER_EMAILS.includes(email.toLowerCase());
    
    // Check if user exists
    let [user] = await query('SELECT * FROM users WHERE email = $1::text OR google_id = $2::text', [email, google_id]);
    
    if (user) {
      // Update existing user info if needed
      const updates = [];
      const params: any[] = [user.id];
      if (!user.google_id) { updates.push('google_id = $' + (params.push(google_id))); }
      if (!user.picture) { updates.push('picture = $' + (params.push(picture))); }
      if (isFounder && user.role !== 'founder') { updates.push('role = $' + (params.push('founder'))); }
      else if (!user.role && preferredRole) { updates.push('role = $' + (params.push(preferredRole))); }

      if (updates.length > 0) {
        [user] = await query(`UPDATE users SET ${updates.join(', ')} WHERE id = $1 RETURNING *`, params);
      }
    } else {
      // Create new user
      const role = isFounder ? 'founder' : (preferredRole || null);
      [user] = await query(
        'INSERT INTO users (email, google_id, full_name, name, picture, role) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [email, google_id, name, name, picture, role]
      );
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({ error: 'Google authentication failed' });
  }
};

export const sendEmailOtp = async (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required' });
  }

  try {
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    
    otpStore.set(email.toLowerCase(), { otp, expires });
    
    console.log(`[OTP DEBUG] OTP for ${email}: ${otp}`);

    // Send real email via Brevo
    const emailSent = await sendOtpEmail(email.toLowerCase(), otp);

    res.json({ 
      success: true, 
      message: emailSent ? 'OTP sent successfully to your email' : 'OTP generated (Dev Mode: check server logs)',
      devMode: !emailSent
    });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

export const verifyEmailOtp = async (req: Request, res: Response) => {
  const { email, otp, preferredRole } = req.body;
  
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const stored = otpStore.get(email.toLowerCase());
  
  if (!stored) {
    return res.status(400).json({ error: 'No OTP found for this email. Please send a new one.' });
  }

  if (Date.now() > stored.expires) {
    otpStore.delete(email.toLowerCase());
    return res.status(400).json({ error: 'OTP has expired. Please send a new one.' });
  }

  if (stored.otp !== otp && otp !== '123456') { // Allow '123456' as master bypass for testing
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  try {
    // OTP verified, clear it
    otpStore.delete(email.toLowerCase());

    const isFounder = email && FOUNDER_EMAILS.includes(email.toLowerCase());
    
    // Check if user exists
    let [user] = await query('SELECT * FROM users WHERE email = $1::text', [email.toLowerCase()]);
    
    if (user) {
      if (isFounder && user.role !== 'founder') {
        [user] = await query('UPDATE users SET role = $1 WHERE id = $2::uuid RETURNING *', ['founder', user.id]);
      } else if (!user.role && preferredRole) {
        [user] = await query('UPDATE users SET role = $1 WHERE id = $2::uuid RETURNING *', [preferredRole, user.id]);
      }
    } else {
      // Create new user
      const role = isFounder ? 'founder' : (preferredRole || null);
      [user] = await query(
        'INSERT INTO users (email, full_name, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
        [email.toLowerCase(), email.split('@')[0], email.split('@')[0], role]
      );
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Authentication failed' });
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const { token, role } = req.body;
  
  if (!token || !role) {
    return res.status(400).json({ error: 'Token and role are required' });
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const [user] = await query(
      'UPDATE users SET role = $1 WHERE id = $2::uuid RETURNING *',
      [role, userId]
    );

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Update role error:', error);
    res.status(401).json({ error: 'Invalid token or session expired' });
  }
};
