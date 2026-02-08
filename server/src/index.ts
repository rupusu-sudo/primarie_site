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
import nodemailer from 'nodemailer';

// --- CONFIGURARE SERVER ---
const app = express();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'cheie_secreta_primarie_2026';
const PORT = process.env.PORT || 3001;

// --- CONFIGURARE DIRECTOARE ---
const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// --- LOGGING HELPER ---
const logAction = (module: string, message: string, details?: any) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] [${module.toUpperCase()}] ${message}`);
    if (details) console.log(`   > Detalii:`, JSON.stringify(details, null, 2));
};

// --- EMAIL CONFIGURATION ---
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS 
    }
});

// --- MULTER CONFIGURATION (UPLOAD) ---
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

app.use(cors({ 
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'], 
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json());
app.use('/uploads', express.static(uploadDir));

app.use((req, res, next) => {
    logAction('HTTP', `${req.method} ${req.url}`, { ip: req.ip });
    next();
});

// --- AUTH MIDDLEWARE ---
const identifyUser = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        try {
            req.user = jwt.verify(token, JWT_SECRET);
        } catch {
            req.user = null;
        }
    }
    next();
};

const isAdminMiddleware = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Autentificare necesară.' });
    
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role?.toUpperCase() !== 'ADMIN') {
            return res.status(403).json({ error: 'Acces restricționat.' });
        }
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ error: 'Sesiune expirată.' });
    }
};

// ==================================================================
// RUTA GET: ANUNȚURI (DATE REALE DIN DB) - DOAR ACEASTA!
// ==================================================================
app.get('/api/announcements', async (req, res) => {
    try {
        const announcements = await prisma.announcement.findMany({
            where: { isPublished: true },
            include: { author: true },
            orderBy: { createdAt: 'desc' }
        });
        res.json(announcements);
    } catch (error) {
        console.error("Eroare GET Announcements:", error);
        res.status(500).json({ error: "Eroare la preluarea anunțurilor" });
    }
});

// ==================================================================
// RUTA POST: ANUNȚURI (INSERARE ÎN DB)
// ==================================================================
app.post('/api/announcements', upload.single('file'), async (req: any, res: Response): Promise<any> => {
    const { title, content, category } = req.body;
    
    try {
        // Validare
        if (!title || !content) {
            return res.status(400).json({ error: 'Titlu și conținut sunt obligatorii.' });
        }

        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
        // Fallback la admin (ID 5) dacă nu e autentificat
        const authorId = req.user?.userId || 5;

        const newAnnouncement = await prisma.announcement.create({
            data: {
                title: String(title),
                content: String(content),
                category: String(category || "General"),
                fileUrl: fileUrl,
                isPublished: true,
                authorId: Number(authorId)
            },
            include: { author: true }
        });

        logAction('ANNOUNCEMENTS', `Anunț nou creat: ${newAnnouncement.id}`, { title });
        res.status(201).json(newAnnouncement);
    } catch (error) {
        console.error('Eroare POST Announcements:', error);
        res.status(500).json({ error: "Eroare la salvare." });
    }
});

// ==================================================================
// ROUTE: CONTACT PRIMAR (AUDIENȚE)
// ==================================================================
app.post('/api/contact-primar', async (req: Request, res: Response): Promise<any> => {
    const { name, phone, email, message } = req.body;

    if (!name || !phone || !email) {
        return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
    }

    const OFFICIAL_BLUE = "#003875";
    const telLink = phone.replace(/\D/g, '');
    
    const stemaPath = path.join(uploadDir, 'stema.png');
    
    let attachments = [];
    let hasLogo = false;

    if (fs.existsSync(stemaPath)) {
        attachments.push({
            filename: 'stema.png',
            path: stemaPath,
            cid: 'stema_logo'
        });
        hasLogo = true;
    } else {
        logAction('WARN', `Stema nu a fost găsită la: ${stemaPath}. Se trimite fără logo.`);
    }

    const logoHtml = hasLogo 
        ? `<img src="cid:stema_logo" width="90" alt="Stema" style="display: block; margin: 0 auto 15px auto;">`
        : ``;

    const adminLogoHtml = hasLogo
        ? `<img src="cid:stema_logo" width="120" style="margin-bottom: 25px; display: block;">`
        : ``;

    try {
        const mailToUser = {
            from: `"Primăria Almăj" <${process.env.SMTP_USER}>`,
            to: email,
            subject: `Nr. Înregistrare: Solicitare Audiență - ${name}`,
            attachments: attachments,
            html: `
            <div style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="padding: 30px 10px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #d1d5db; border-top: 0;">
                                <tr>
                                    <td height="6" style="background: linear-gradient(to right, #002B7F 33%, #FCD116 33%, #FCD116 66%, #CE1126 66%);"></td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 40px; text-align: center; border-bottom: 2px solid #eeeeee;">
                                        ${logoHtml}
                                        <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333; letter-spacing: 1px;">ROMÂNIA</p>
                                        <p style="margin: 5px 0; font-size: 12px; font-weight: 600; color: #555555; text-transform: uppercase;">Județul Dolj • Comuna Almăj</p>
                                        <p style="margin: 0; font-size: 18px; font-weight: 800; color: ${OFFICIAL_BLUE}; margin-top: 10px;">PRIMĂRIA COMUNEI ALMĂJ</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px; color: #333333; line-height: 1.6;">
                                        <p style="font-size: 16px; margin-bottom: 20px;"><strong>Stimate/Stimată ${name},</strong></p>
                                        <p>Vă confirmăm că solicitarea dumneavoastră a fost înregistrată în sistemul electronic al instituției.</p>
                                        <div style="background-color: #f8fafc; border-left: 4px solid ${OFFICIAL_BLUE}; padding: 15px; margin: 20px 0;">
                                            <p style="margin: 0; font-size: 14px;"><strong>Număr de ordine:</strong> #${Math.floor(10000 + Math.random() * 90000)}</p>
                                            <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Data înregistrării:</strong> ${new Date().toLocaleDateString('ro-RO')}</p>
                                        </div>
                                        <p>Secretariatul va analiza agenda și vă va contacta la numărul <strong>${phone}</strong>.</p>
                                        <p style="margin-top: 30px;">Cu respect,<br><strong>Registratura Almăj</strong></p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            `
        };

        const mailToPrimar = {
            from: `"Portal Cetățeni" <${process.env.SMTP_USER}>`,
            to: process.env.PRIMAR_EMAIL,
            subject: `[AUDIENȚĂ] Solicitare nouă: ${name}`,
            attachments: attachments,
            html: `
            <div style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: Arial, sans-serif;">
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td align="center" style="padding: 30px 10px;">
                            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border: 1px solid #d1d5db; border-top: 0;">
                                <tr>
                                    <td height="6" style="background: linear-gradient(to right, #002B7F 33%, #FCD116 33%, #FCD116 66%, #CE1126 66%);"></td>
                                </tr>
                                <tr>
                                    <td style="padding: 30px 40px; text-align: center; border-bottom: 2px solid #eeeeee;">
                                        ${adminLogoHtml}
                                        <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333; letter-spacing: 1px;">PRIMĂRIA COMUNEI ALMĂJ</p>
                                        <p style="margin: 5px 0; font-size: 12px; font-weight: 600; color: #555555; text-transform: uppercase;">Portal Digital • Management Audiențe</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px; color: #333333; line-height: 1.6;">
                                        <h2 style="color: ${OFFICIAL_BLUE}; font-size: 20px; border-bottom: 2px solid ${OFFICIAL_BLUE}; padding-bottom: 10px; margin-top: 0;">Fișă de Audiență Nouă</h2>
                                        
                                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                            <table width="100%" cellpadding="5" cellspacing="0">
                                                <tr>
                                                    <td width="30%" style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Solicitant</td>
                                                    <td style="font-size: 16px; font-weight: 600; color: #111827;">${name}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Contact</td>
                                                    <td style="font-size: 16px; font-weight: 600; color: ${OFFICIAL_BLUE};">${phone}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Email</td>
                                                    <td style="font-size: 14px; color: #374151;">${email}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="padding-top: 15px;">
                                                        <p style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin: 0 0 5px 0;">Motivul Solicitării</p>
                                                        <div style="background-color: #ffffff; border: 1px solid #d1d5db; padding: 15px; border-radius: 4px; font-style: italic; color: #4b5563;">
                                                            "${message || 'Nu au fost oferite detalii suplimentare.'}"
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>

                                        <div style="text-align: center; margin-top: 30px;">
                                            <a href="tel:${telLink}" style="display: inline-block; background-color: ${OFFICIAL_BLUE}; color: #ffffff; padding: 16px 32px; text-decoration: none; font-weight: bold; font-size: 16px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0, 56, 117, 0.2);">
                                                &#128222; APELEAZĂ CETĂȚEANUL
                                            </a>
                                            <p style="font-size: 12px; color: #9ca3af; margin-top: 15px;">Apăsați butonul pentru a iniția apelul direct de pe telefon.</p>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f1f5f9; padding: 15px; text-align: center; font-family: Arial, sans-serif; font-size: 11px; color: #6b7280; border-top: 1px solid #e5e7eb;">
                                        Generat automat de Sistemul Informatic al Primăriei Almăj<br>
                                        ${new Date().toLocaleString('ro-RO')}
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </div>
            `
        };

        await transporter.sendMail(mailToUser);
        await transporter.sendMail(mailToPrimar);

        logAction('CONTACT', `Mailuri trimise cu succes către ${email} și Primar.`);
        res.status(200).json({ success: true });

    } catch (error) {
        logAction('CONTACT', 'EROARE la trimitere mail', error);
        res.status(500).json({ error: 'Eroare server la trimiterea mail-ului.' });
    }
});

// ==================================================================
// AUTH: LOGIN
// ==================================================================
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

        if (!user) return res.status(401).json({ error: 'Credențiale invalide.' });

        const isBcrypt = user.password.startsWith('$2');
        let isMatch = isBcrypt ? await bcrypt.compare(password, user.password) : password === user.password;

        if (isMatch) {
            const token = jwt.sign({ userId: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
            res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
        } else {
            res.status(401).json({ error: 'Credențiale invalide.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Eroare server.' });
    }
});

// Health Check
app.get('/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// Start Server
app.listen(PORT, () => {
    logAction('SYSTEM', `Server pornit pe portul ${PORT}`);
    const stemaCheck = path.join(uploadDir, 'stema.png');
    if (fs.existsSync(stemaCheck)) {
        logAction('SYSTEM', 'OK: Stema.png găsită în uploads.');
    } else {
        logAction('WARN', 'ATENȚIE: Stema.png NU a fost găsită în uploads!');
    }
});