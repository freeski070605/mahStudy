import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  id: string;
  email: string;
  isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const signToken = (payload: AuthPayload) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'development-secret-change-me', { expiresIn: '14d' });

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'development-secret-change-me') as AuthPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    res.status(403).json({ error: 'Admin access required' });
    return;
  }
  next();
};
