import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'cheie_secreta_primarie_2026';
export const authorize = (allowedRoles: string[] = []) => {
    return (req: any, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) {
            return res.status(401).json({ error: 'Vă rugăm să vă logați.' });
        }

        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET || 'cheie_secreta_primarie_2026');
            req.user = decoded;

            // FIX: Normalizăm ambele părți la litere mici pentru comparație
            if (allowedRoles.length > 0) {
                const userRole = decoded.role ? decoded.role.toLowerCase() : '';
                const rolesLowerCase = allowedRoles.map(r => r.toLowerCase());

                if (!rolesLowerCase.includes(userRole)) {
                    return res.status(403).json({
                        error: `Acces interzis. Nu aveți rolul necesar.`
                    });
                }
            }

            next();
        } catch (err) {
            return res.status(403).json({ error: 'Sesiune nevalidă sau expirată.' });
        }
    };
};