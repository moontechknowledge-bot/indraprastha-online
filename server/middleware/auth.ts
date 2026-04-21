import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { query, isValidUUID } from '../lib/db.js'; // .js extension zaroori hai

const JWT_SECRET = process.env.JWT_SECRET || 'indraprastha-secret-key';

export const authMiddleware = async (req: any, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;

  if (!auth) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = auth.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Invalid token format' });
  }

  // Handle mock/test token
  if (token.startsWith('mock-token-') || token.startsWith('test-token-')) {
    let userId = '00000000-0000-0000-0000-000000000999';
    const parts = token.split('-');
    if (parts.length >= 6) {
      const potentialUuid = parts.slice(2).join('-');
      if (isValidUUID(potentialUuid)) {
        userId = potentialUuid;
      }
    }

    try {
      const users = await query('SELECT id, role FROM users WHERE id = $1::uuid', [userId]);
      if (!users[0]) return res.status(401).json({ error: 'User not found' });
      req.user = users[0];
      return next();
    } catch (err) {
      return res.status(500).json({ error: 'Auth DB Error' });
    }
  }

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const users = await query('SELECT id, role FROM users WHERE id = $1::uuid', [decoded.id]);
    if (!users[0]) return res.status(401).json({ error: 'User not found' });
    req.user = users[0];
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};