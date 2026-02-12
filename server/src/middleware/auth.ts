import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';


declare global {
  namespace Express {
    interface Request {
      user?: {
        id?: string;
        userId?: number | string;
        email?: string;
        role: string;
      };
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be set and at least 32 characters long.');
}


export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ message: 'Token de autentificare lipsă' });
      return;
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(403).json({ message: 'Token invalid sau expirat' });
        return;
      }

      req.user = decoded as {
        id: string;
        email: string;
        role: string;
      };
      next();
    });
  } catch (error) {
    res.status(500).json({ message: 'Eroare la autentificare' });
  }
};


export const authorizeRole = (roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const normalizedRole = String(req.user?.role || '').toUpperCase();
    const normalizedAllowedRoles = roles.map((role) => String(role).toUpperCase());

    if (!normalizedRole || !normalizedAllowedRoles.includes(normalizedRole)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    next();
  };
};

export const requireAdmin = authorizeRole(['ADMIN']);

export const requireEditor = authorizeRole(['ADMIN', 'EDITOR']);
