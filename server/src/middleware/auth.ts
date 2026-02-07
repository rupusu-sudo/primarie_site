import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cheie_secreta_primarie_2026';
export const authorize = (allowedRoles: string[] = []) => {
    return (req: any, res: Response, next: NextFunction) => {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Vă rugăm să vă logați.' });
        }

        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            req.user = decoded; 
            if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role.toLowerCase())) {
                return res.status(403).json({ 
                    error: `Acces interzis. Această acțiune necesită rolul de: ${allowedRoles.join(' sau ')}.` 
                });
            }

            next();
        } catch (err) {
            return res.status(403).json({ error: 'Sesiune nevalidă sau expirată.' });
        }
    };
};