import { Response, NextFunction } from 'express';

export const adminMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (!req.user || req.user.role !== 'founder') {
    console.warn(`adminMiddleware: Access denied for user ${req.user?.id} with role ${req.user?.role}`);
    return res.status(403).json({ error: 'Access denied. Founder privileges required.' });
  }
  next();
};
