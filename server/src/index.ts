import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'cheie_secreta_primarie_2026';

// Rate limit: 5 min între postări per deviceId (useri neconectați)
const lastPostByDevice = new Map<string, number>();
const RATE_LIMIT_MS = 5 * 60 * 1000;

// --- CONFIGURARE STORAGE ---
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 } 
});

// --- MIDDLEWARE ---
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

/**
 * Middleware Hibrid: Identifică userul dacă există token, dar lasă cererea să treacă oricum.
 */
const identifyUser = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (token) {
        try {
            req.user = jwt.verify(token, JWT_SECRET);
        } catch (e) {
            req.user = null;
        }
    }
    next();
};

/**
 * Middleware Strict: Permite accesul doar Administratorilor.
 */
const isAdminMiddleware = (req: any, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Autentificare necesară.' });
    
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role?.toUpperCase() !== 'ADMIN') {
            return res.status(403).json({ error: 'Acces restricționat.' });
        }
        req.user = decoded;
        next();
    } catch (e) {
        res.status(401).json({ error: 'Sesiune expirată.' });
    }
};

// --- RUTE AUTENTIFICARE ---

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    console.log(`\n--- INCERCARE LOGARE ---`);
    console.log(`Email primit: [${email}]`);
    console.log(`Parola primita (length): ${password?.length}`);

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

        if (!user) {
            console.log(`[FAIL] Utilizatorul ${normalizedEmail} nu exista in DB.`);
            return res.status(401).json({ error: 'CREDENTIALE NEVALIDE.' });
        }

        console.log(`[OK] Utilizator gasit in baza de date.`);
        
        const isBcryptHash = (s: string) => s && (s.startsWith('$2a$') || s.startsWith('$2b$') || s.startsWith('$2y$'));
        let isMatch = false;

        if (isBcryptHash(user.password)) {
            isMatch = await bcrypt.compare(password, user.password);
        } else {
            // Parolă în plain text (migrare XAMPP / DB vechi) – comparăm și actualizăm cu hash
            isMatch = password === user.password;
            if (isMatch) {
                const hash = await bcrypt.hash(password, 10);
                await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
                console.log(`[UPGRADE] Parola a fost hashată corect în DB.`);
            }
        }

        if (!isMatch) {
            console.log(`[FAIL] Parola nu se potriveste.`);
            return res.status(401).json({ error: 'CREDENTIALE NEVALIDE.' });
        }

        const token = jwt.sign(
            { userId: user.id, role: user.role, name: user.name }, 
            JWT_SECRET, { expiresIn: '24h' }
        );

        console.log(`[SUCCESS] Logare reusita pentru: ${normalizedEmail}`);
        return res.json({ token, user: { email: user.email, role: user.role, name: user.name } });

    } catch (err) { 
        console.error(`[ERR]`, err);
        res.status(500).json({ error: 'Eroare server.' }); 
    }
});

// --- RUTE VOCEA ALMĂJULUI (DIALOG CIVIC) ---

// 1. Preluare Mesaje (vocea-almajului + răspunsuri, cu likedIds pentru user neconectat)
app.get('/api/documents', async (req, res) => {
    const { category, deviceId } = req.query;
    try {
        const where = category === 'vocea-almajului'
            ? { category: { in: ['vocea-almajului', 'reply'] as string[] } }
            : (category ? { category: String(category) } : {});

        const documents = await prisma.document.findMany({
            where,
            orderBy: [{ likes: 'desc' }, { createdAt: 'desc' }]
        });

        if (category === 'vocea-almajului') {
            let likedIds: number[] = [];
            if (deviceId && typeof deviceId === 'string') {
                const likes = await (prisma as any).documentLike.findMany({
                    where: { deviceId },
                    select: { documentId: true }
                });
                likedIds = (likes || []).map((l: { documentId: number }) => l.documentId);
            }
            return res.json({ documents, likedIds });
        }
        res.json(documents);
    } catch (err) {
        res.status(500).json({ error: 'Eroare la preluarea datelor.' });
    }
});

// 2a. Răspunsuri (JSON only, fără multer)
app.post('/api/documents/reply', identifyUser, async (req: any, res) => {
    const { content, parentId, authorName, ownerId } = req.body;
    const isAdmin = req.user?.role?.toUpperCase() === 'ADMIN';
    const deviceId = req.headers['x-device-id'] as string || ownerId;
    if (!isAdmin && deviceId) {
        const last = lastPostByDevice.get(deviceId);
        if (last && Date.now() - last < RATE_LIMIT_MS) {
            const waitMin = Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 60000);
            return res.status(429).json({ error: `Așteptați ${waitMin} min. înainte de un nou răspuns.` });
        }
    }
    try {
        const doc = await prisma.document.create({
            data: {
                title: 'Răspuns',
                category: 'reply',
                content: content || '',
                authorName: isAdmin ? 'Reprezentant Primărie' : (authorName || 'Cetățean Anonim'),
                parentId: parentId ? parseInt(parentId) : null,
                ownerId: ownerId || null,
                fileUrl: null,
                year: 2026
            }
        });
        if (!isAdmin && deviceId) lastPostByDevice.set(deviceId, Date.now());
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: 'Eroare la salvare răspuns.' });
    }
});

// 2b. Publicare cu fișiere (FormData + multer)
app.post('/api/documents', identifyUser, upload.array('files', 5), async (req: any, res) => {
    const { title, category, content, parentId, authorName, ownerId } = req.body;
    const isAdmin = req.user?.role?.toUpperCase() === 'ADMIN';
    const deviceId = req.headers['x-device-id'] as string || req.body?.ownerId;

    if (!isAdmin && deviceId) {
        const last = lastPostByDevice.get(deviceId);
        if (last && Date.now() - last < RATE_LIMIT_MS) {
            const waitMin = Math.ceil((RATE_LIMIT_MS - (Date.now() - last)) / 60000);
            return res.status(429).json({ error: `Așteptați ${waitMin} min. înainte de o nouă sesizare.` });
        }
    }

    try {
        const filePaths = req.files ? (req.files as any[]).map((f: any) => `/uploads/${f.filename}`) : [];
        const document = await prisma.document.create({
            data: {
                title: isAdmin && !parentId ? `[OFICIAL] ${title}` : (title || 'Sesizare'),
                category: category || 'vocea-almajului',
                content: content || '',
                authorName: isAdmin ? 'Reprezentant Primărie' : (authorName || 'Cetățean Anonim'),
                parentId: parentId ? parseInt(parentId) : null,
                ownerId: ownerId || null,
                fileUrl: filePaths.length ? filePaths.join(',') : null,
                year: 2026
            }
        });
        if (!isAdmin && deviceId) lastPostByDevice.set(deviceId, Date.now());
        res.status(201).json(document);
    } catch (err) {
        res.status(500).json({ error: 'Eroare la salvare.' });
    }
});

// 3. Sistem Like (tracking per deviceId – previne like dublu)
app.post('/api/documents/:id/like', identifyUser, async (req: any, res) => {
    const id = parseInt(req.params.id);
    const deviceId = req.headers['x-device-id'] as string;
    const isAdmin = req.user?.role?.toUpperCase() === 'ADMIN';

    if (!deviceId) {
        return res.status(400).json({ error: 'x-device-id header obligatoriu.' });
    }
    try {
        const dl = (prisma as any).documentLike;
        const existing = await dl.findUnique({
            where: { documentId_deviceId: { documentId: id, deviceId } }
        });
        if (existing) {
            const doc = await prisma.document.findUnique({ where: { id } });
            return res.json(doc);
        }
        await prisma.$transaction([
            dl.create({ data: { documentId: id, deviceId } }),
            prisma.document.update({
                where: { id },
                data: {
                    likes: { increment: 1 },
                    ...(isAdmin ? { officialSupport: true } : {})
                }
            })
        ]);
        const updated = await prisma.document.findUnique({ where: { id } });
        res.json(updated);
    } catch (err) {
        res.status(500).json({ error: 'Eroare vot.' });
    }
});

// 4. Ștergere Securizată (Admin sau posesor dispozitiv)
app.delete('/api/documents/:id', identifyUser, async (req: any, res) => {
    const id = parseInt(req.params.id);
    const deviceId = req.headers['x-device-id'] as string;
    const isAdmin = req.user?.role?.toUpperCase() === 'ADMIN';

    try {
        const doc = await prisma.document.findUnique({ where: { id } });
        if (!doc) return res.status(404).json({ error: 'Mesajul nu există.' });

        if (isAdmin || (doc.ownerId && doc.ownerId === deviceId)) {
            await prisma.document.delete({ where: { id } });
            return res.json({ message: 'Șters cu succes.' });
        }
        res.status(403).json({ error: 'Acces refuzat.' });
    } catch (err) {
        res.status(500).json({ error: 'Eroare la eliminare.' });
    }
});

// --- RUTE HARTĂ ---

app.get('/api/terenuri', async (req, res) => {
    try {
        const terenuri = await prisma.document.findMany({ where: { category: 'map_data' } });
        res.json(terenuri.map(t => ({ ...t, geojson: t.content ? JSON.parse(t.content) : null })));
    } catch (err) { res.status(500).json({ error: 'Eroare hartă.' }); }
});

app.post('/api/terenuri', isAdminMiddleware, async (req: any, res) => {
    const { numar_cadastral, tip_teren, geojson } = req.body;
    try {
        const teren = await prisma.document.create({
            data: {
                title: numar_cadastral,
                category: 'map_data',
                content: JSON.stringify(geojson),
                authorName: tip_teren,
                year: 0
            }
        });
        res.status(201).json(teren);
    } catch (err) { res.status(500).json({ error: 'Eroare salvare parcelă.' }); }
});

// --- START ---
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`\x1b[32m[SYSTEM] SERVER PRIMARIE ON ${PORT}\x1b[0m`);
});