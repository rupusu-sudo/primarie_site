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

// --- CONFIGURARE FILTRARE ---
const BANNED_WORDS = ['vulgarsample1', 'vulgarsample2', 'injuratura', 'pula', 'muie', 'cacat']; 
const RESERVED_NAMES = ['admin', 'primar', 'primaria', 'moderator', 'politia', 'secretar', 'consiliul'];

// Suport pentru caractere românești în baza de date
prisma.$executeRawUnsafe('SET NAMES utf8mb4').catch(err => console.error("Eroare setare utf8mb4:", err));

const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'cheie_secreta_primarie_2026';

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: { error: "Prea multe încercări. Reîncercați peste 15 minute." }
});

// Configurare folder Uploads
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    console.log("Folderul 'uploads' a fost creat.");
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`)
});

const upload = multer({ 
    storage, 
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use('/uploads', express.static(uploadDir));
app.use(express.json());

const protect = (req: any, res: any, next: any) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Vă rugăm să vă logați.' });
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch (err) { res.status(403).json({ error: 'Sesiune nevalidă.' }); }
};

// --- RUTE ADMINISTRARE ---

app.post('/api/login', loginLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ userId: user.id, role: user.role, name: user.name }, JWT_SECRET);
            return res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
        }
        res.status(401).json({ error: 'Credentiale invalide.' });
    } catch (err) { res.status(500).json({ error: 'Eroare server.' }); }
});

// --- RUTE GESTIONARE CONȚINUT ---

app.get('/api/documents', async (req, res) => {
    const { category } = req.query;
    try {
        const documents = await prisma.document.findMany({
            where: {
                ...(category ? { category: String(category) } : {}),
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(documents.map(doc => ({ 
            ...doc, 
            image_urls: doc.fileUrl ? doc.fileUrl.split(',') : [] 
        })));
    } catch (err) { 
        console.error("Eroare GET documents:", err);
        res.status(500).json({ error: 'Eroare la preluarea datelor.' }); 
    }
});

app.post('/api/documents', upload.array('files', 10), async (req: any, res) => {
    const { title, category, content, authorName, parentId } = req.body;
    const token = req.headers.authorization?.split(' ')[1];
    
    let isAdmin = false;
    let finalAuthorName = authorName || "Cetățean Anonim";

    // Verificăm dacă cel care postează este admin
    if (token) {
        try { 
            const decoded: any = jwt.verify(token, JWT_SECRET); 
            if (decoded && decoded.role === 'ADMIN') {
                isAdmin = true;
                finalAuthorName = decoded.name || "Administrația Primăriei";
            }
        } catch (e) { isAdmin = false; }
    }

    // 1. Filtrare limbaj și protecție nume rezervate
    const checkString = `${title} ${content} ${authorName || ''}`.toLowerCase();
    if (BANNED_WORDS.some(word => checkString.includes(word))) {
        return res.status(400).json({ error: 'Mesajul conține limbaj inadecvat.' });
    }

    if (!isAdmin && authorName && RESERVED_NAMES.some(name => authorName.toLowerCase().includes(name))) {
        return res.status(400).json({ error: 'Acest nume este rezervat administrației.' });
    }

    try {
        // 2. Procesare căi fișiere
        const filePaths = req.files ? (req.files as any[]).map(f => `/uploads/${f.filename}`) : [];
        
        const document = await prisma.document.create({
            data: {
                title: isAdmin && !parentId ? `[OFICIAL] ${title}` : title,
                category: category,
                content: content || "",
                authorName: finalAuthorName,
                year: parentId ? parseInt(parentId) : 0, 
                fileUrl: filePaths.join(',')
            }
        });

        console.log("Document creat cu succes:", document.id);
        res.status(201).json(document);

    } catch (err: any) { 
        console.error("ERRORE CRITICĂ SALVARE:", err);
        // Trimitem eroarea exactă pentru a vedea ce coloană lipsește în DB
        res.status(500).json({ 
            error: 'Eroare la salvare în baza de date.',
            details: err.message 
        }); 
    }
});

// --- INTERACȚIUNI: LIKE ---

app.post('/api/documents/:id/like', async (req, res) => {
    const id = parseInt(req.params.id);
    try {
        const doc = await prisma.document.findUnique({ where: { id } });
        if (!doc) return res.status(404).json({ error: 'Mesajul nu a fost găsit.' });

        // Incrementăm câmpul 'year' care servește drept contor de like-uri pentru postările principale
        const updated = await prisma.document.update({
            where: { id },
            data: { year: (doc.year || 0) + 1 }
        });
        res.json({ likes: updated.year });
    } catch (err) { 
        res.status(500).json({ error: 'Eroare la procesarea like-ului.' }); 
    }
});

app.delete('/api/documents/:id', protect, async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const doc = await prisma.document.findUnique({ where: { id } });
        
        if (doc?.fileUrl) {
            doc.fileUrl.split(',').forEach(p => {
                const fullPath = path.join(__dirname, '..', p);
                if (fs.existsSync(fullPath)) {
                    try { fs.unlinkSync(fullPath); } catch(e) {}
                }
            });
        }
        
        // Ștergem mesajul și răspunsurile (unde year = parentId)
        await prisma.document.deleteMany({ 
            where: { 
                OR: [
                    { id: id },
                    { AND: [{ category: 'reply' }, { year: id }] }
                ]
            } 
        });
        
        res.json({ message: 'Mesajul a fost eliminat definitiv.' });
    } catch (err) { 
        res.status(500).json({ error: 'Eroare la ștergere.' }); 
    }
});

app.listen(PORT, () => {
    console.log(`--------------------------------------------------`);
    console.log(`[PORTAL PRIMĂRIE] Server activ pe portul: ${PORT}`);
    console.log(`[UPLOAD] Folder imagini: ${uploadDir}`);
    console.log(`--------------------------------------------------`);
});