import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query, isValidUUID } from '../lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'indraprastha-secret-key';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  console.log('authMiddleware: Request received for path:', req.path);

  if (!auth) {
    console.warn('authMiddleware: No token provided');
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];

  if (!token) {
    console.warn('authMiddleware: Invalid token format');
    return res.status(401).json({ error: 'Invalid token format' });
  }

  // Handle mock/test token
  if (token.startsWith('mock-token-') || token.startsWith('test-token-')) {
    console.log('authMiddleware: Handling mock/test token:', token);
    
    // Try to extract UUID from token if it exists (e.g. mock-token-UUID)
    let userId = '00000000-0000-0000-0000-000000000999'; // Default test ID
    const parts = token.split('-');
    if (parts.length >= 6) { // UUID has 5 parts, so mock-token-UUID has 7 parts
      const potentialUuid = parts.slice(2).join('-');
      if (isValidUUID(potentialUuid)) {
        userId = potentialUuid;
      }
    }

    try {
      // Verify user exists in DB to prevent FK errors
      const users = await query('SELECT id, role FROM users WHERE id = $1::uuid', [userId]);
      const user = users[0];
      
      if (!user) {
        // If it's the test user, we can try to auto-create it
        if (userId === '00000000-0000-0000-0000-000000000999') {
          console.log('authMiddleware: Test user missing, auto-creating...');
          const newUsers = await query(
            'INSERT INTO users (id, email, full_name, role) VALUES ($1::uuid, $2, $3, $4) ON CONFLICT (id) DO UPDATE SET role = EXCLUDED.role RETURNING id, role',
            [userId, 'test@example.com', 'Test User', 'seller']
          );
          req.user = newUsers[0];
        } else {
          console.warn('authMiddleware: User in mock token not found in DB:', userId);
          return res.status(401).json({ error: 'User not found. Please login again.' });
        }
      } else {
        req.user = user;
      }
      return next();
    } catch (dbErr) {
      console.error('authMiddleware: DB error during token verification:', dbErr);
      return res.status(500).json({ 
        error: 'Internal server error during authentication',
        details: dbErr instanceof Error ? dbErr.message : 'Unknown database error'
      });
    }
  }

  // Handle real JWT token
  let decoded: any;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
    console.log('authMiddleware: Token verified for user:', decoded.id);
  } catch (err) {
    console.error('authMiddleware: JWT Verification Error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  try {
    // Verify user exists in DB
    const users = await query('SELECT id, role FROM users WHERE id = $1::uuid', [decoded.id]);
    const user = users[0];
    
    if (!user) {
      console.warn('authMiddleware: User in JWT not found in DB:', decoded.id);
      return res.status(401).json({ error: 'User not found. Please login again.' });
    }
    
    req.user = user;
    next();
  } catch (dbErr) {
    console.error('authMiddleware: DB error during JWT user lookup:', dbErr);
    return res.status(500).json({ 
      error: 'Internal server error during authentication',
      details: dbErr instanceof Error ? dbErr.message : 'Unknown database error'
    });
  }
};
