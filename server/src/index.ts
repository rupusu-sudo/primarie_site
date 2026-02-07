import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'cheie_secreta_primarie_2026';

// --- MIDDLEWARE AUTORIZARE ---
const authorize = (roles: string[] = []) => {
    return (req: any, res: any, next: any) => {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) return res.status(401).json({ error: 'Vă rugăm să vă logați.' });
        try {
            const decoded: any = jwt.verify(token, JWT_SECRET);
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role.toLowerCase())) {
                return res.status(403).json({ error: 'Nu aveți permisiunile necesare.' });
            }
            next();
        } catch (err) { res.status(403).json({ error: 'Sesiune nevalidă.' }); }
    };
};

const PORT = process.env.PORT || 3001;
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static(uploadDir));
app.use(express.json());

// --- RUTE ---
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign(
                { userId: user.id, role: user.role, name: user.name }, 
                JWT_SECRET, { expiresIn: '24h' }
            );
            return res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
        }
        res.status(401).json({ error: 'Credentiale invalide.' });
    } catch (err) { res.status(500).json({ error: 'Eroare server.' }); }
});

app.get('/api/documents', async (req, res) => {
    const { category } = req.query;
    try {
        const documents = await prisma.document.findMany({
            where: { ...(category ? { category: String(category) } : {}) },
            orderBy: { createdAt: 'desc' }
        });
        res.json(documents.map(doc => ({ 
            ...doc, 
            image_urls: doc.fileUrl ? doc.fileUrl.split(',') : [] 
        })));
    } catch (err) { res.status(500).json({ error: 'Eroare date.' }); }
});

app.post('/api/documents', authorize(['admin', 'editor']), upload.array('files', 10), async (req: any, res) => {
    const { title, category, content, parentId } = req.body;
    try {
        const filePaths = req.files ? (req.files as any[]).map(f => `/uploads/${f.filename}`) : [];
        const document = await prisma.document.create({
            data: {
                title: !parentId ? `[OFICIAL] ${title}` : title,
                category,
                content: content || "",
                authorName: req.user.name || "Administrația Primăriei",
                year: parentId ? parseInt(parentId) : 0, 
                fileUrl: filePaths.join(',')
            }
        });
        res.status(201).json(document);
    } catch (err) { res.status(500).json({ error: 'Eroare salvare.' }); }
});

app.get('/api/terenuri', async (req, res) => {
    try {
        const terenuri = await prisma.document.findMany({ where: { category: 'map_data' } });
        res.json(terenuri.map(t => ({ ...t, geojson: t.content ? JSON.parse(t.content) : null })));
    } catch (err) { res.status(500).json({ error: 'Eroare hartă.' }); }
});

app.post('/api/terenuri', authorize(['admin', 'editor']), async (req: any, res) => {
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

app.delete('/api/documents/:id', authorize(['admin']), async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const doc = await prisma.document.findUnique({ where: { id } });
        if (doc?.fileUrl) {
            doc.fileUrl.split(',').forEach(p => {
                const fullPath = path.join(__dirname, '..', p);
                if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
            });
        }
        await prisma.document.deleteMany({ 
            where: { OR: [{ id }, { AND: [{ category: 'reply' }, { year: id }] }] } 
        });
        res.json({ message: 'Eliminat.' });
    } catch (err) { res.status(500).json({ error: 'Eroare ștergere.' }); }
});

app.listen(PORT, () => {
    console.log(`[PORTAL PRIMĂRIE] Server activ pe portul: ${PORT}`);
});