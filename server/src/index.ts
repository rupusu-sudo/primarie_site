import dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { JWT_SECRET, IS_EPHEMERAL_JWT_SECRET } from './config/jwtSecret';
import { allowNoOrigin, allowedOrigins, corsMiddleware, corsPreflight } from './config/cors';

const ENV_FILE_CANDIDATES = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(__dirname, '../.env')
];

for (const envFile of ENV_FILE_CANDIDATES) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    break;
  }
}

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL = process.env.MYSQL_PUBLIC_URL || process.env.MYSQL_URL || '';
}

if (!process.env.DATABASE_URL) {
  const host = (process.env.MYSQLHOST || '').trim();
  const port = (process.env.MYSQLPORT || '').trim();
  const user = (process.env.MYSQLUSER || '').trim();
  const password = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '';
  const database = (process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || '').trim();

  if (host && port && user && password && database) {
    process.env.DATABASE_URL =
      `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}` +
      `@${host}:${port}/${database}`;
  }
}

// ============================================================================
// LOGGER PROFESIONAL
// ============================================================================

const LOG_LEVELS = {
  INFO: '\x1b[36m',    // cyan
  SUCCESS: '\x1b[32m', // green
  WARN: '\x1b[33m',    // yellow
  ERROR: '\x1b[31m',   // red
  DEBUG: '\x1b[35m',   // magenta
  RESET: '\x1b[0m'
};

interface LogOptions {
  module?: string;
  details?: any;
  duration?: number;
  requestId?: string;
}

const logger = {
  info: (message: string, opts?: LogOptions) => {
    const timestamp = new Date().toISOString();
    const module = opts?.module ? `[${opts.module}]` : '';
    const duration = opts?.duration ? ` (${opts.duration}ms)` : '';
    const reqId = opts?.requestId ? ` #${opts.requestId}` : '';
    
    console.log(
      `${LOG_LEVELS.INFO}[INFO]${LOG_LEVELS.RESET} ${timestamp} ${module}${reqId} ${message}${duration}`
    );
    if (opts?.details) {
      console.log(`        └─ ${JSON.stringify(opts.details)}`);
    }
  },

  success: (message: string, opts?: LogOptions) => {
    const timestamp = new Date().toISOString();
    const module = opts?.module ? `[${opts.module}]` : '';
    const duration = opts?.duration ? ` (${opts.duration}ms)` : '';
    const reqId = opts?.requestId ? ` #${opts.requestId}` : '';
    
    console.log(
      `${LOG_LEVELS.SUCCESS}[✓ OK]${LOG_LEVELS.RESET} ${timestamp} ${module}${reqId} ${message}${duration}`
    );
    if (opts?.details) {
      console.log(`        └─ ${JSON.stringify(opts.details)}`);
    }
  },

  warn: (message: string, opts?: LogOptions) => {
    const timestamp = new Date().toISOString();
    const module = opts?.module ? `[${opts.module}]` : '';
    const reqId = opts?.requestId ? ` #${opts.requestId}` : '';
    
    console.warn(
      `${LOG_LEVELS.WARN}[WARN]${LOG_LEVELS.RESET} ${timestamp} ${module}${reqId} ${message}`
    );
    if (opts?.details) {
      console.warn(`        └─ ${JSON.stringify(opts.details)}`);
    }
  },

  error: (message: string, error?: any, opts?: LogOptions) => {
    const timestamp = new Date().toISOString();
    const module = opts?.module ? `[${opts.module}]` : '';
    const reqId = opts?.requestId ? ` #${opts.requestId}` : '';
    const errorMsg = error?.message || String(error);
    
    console.error(
      `${LOG_LEVELS.ERROR}[ERROR]${LOG_LEVELS.RESET} ${timestamp} ${module}${reqId} ${message}`
    );
    console.error(`        └─ ${errorMsg}`);
    if (opts?.details) {
      console.error(`        └─ Context: ${JSON.stringify(opts.details)}`);
    }
  },

  debug: (message: string, opts?: LogOptions) => {
    const timestamp = new Date().toISOString();
    const module = opts?.module ? `[${opts.module}]` : '';
    const reqId = opts?.requestId ? ` #${opts.requestId}` : '';
    
    console.log(
      `${LOG_LEVELS.DEBUG}[DEBUG]${LOG_LEVELS.RESET} ${timestamp} ${module}${reqId} ${message}`
    );
    if (opts?.details) {
      console.log(`        └─ ${JSON.stringify(opts.details, null, 2)}`);
    }
  },

  divider: () => console.log('─'.repeat(80))
};

// ============================================================================
// CONFIGURARE SERVER
// ============================================================================

if (!process.env.DATABASE_URL) {
  const envPresence = {
    DATABASE_URL: !!process.env.DATABASE_URL,
    MYSQL_PUBLIC_URL: !!process.env.MYSQL_PUBLIC_URL,
    MYSQL_URL: !!process.env.MYSQL_URL,
    MYSQLHOST: !!process.env.MYSQLHOST,
    MYSQLPORT: !!process.env.MYSQLPORT,
    MYSQLUSER: !!process.env.MYSQLUSER,
    MYSQLPASSWORD: !!process.env.MYSQLPASSWORD,
    MYSQL_ROOT_PASSWORD: !!process.env.MYSQL_ROOT_PASSWORD,
    MYSQLDATABASE: !!process.env.MYSQLDATABASE,
    MYSQL_DATABASE: !!process.env.MYSQL_DATABASE
  };

  console.error('[BOOT] Lipseste DATABASE_URL. Seteaza DATABASE_URL, MYSQL_PUBLIC_URL, MYSQL_URL sau setul MYSQLHOST/MYSQLPORT/MYSQLUSER/MYSQLPASSWORD/MYSQLDATABASE.');
  console.error(`[BOOT] Prezenta variabile DB: ${JSON.stringify(envPresence)}`);
  process.exit(1);
}

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3001;

// Railway runs behind a proxy; this keeps rate-limit and request IP handling correct.
app.set('trust proxy', 1);

logger.info(`Inițializare server...`, { module: 'BOOT' });
if (IS_EPHEMERAL_JWT_SECRET) {
    logger.warn(
        'JWT secret temporar activ. Configurează JWT_SECRET (min 32) în mediul de deploy.',
        { module: 'BOOT' }
    );
}

// ============================================================================
// CONFIGURARE DIRECTOARE
// ============================================================================

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
    logger.success(`Folder uploads creat`, { module: 'BOOT', details: { path: uploadDir } });
} else {
    logger.info(`Folder uploads găsit`, { module: 'BOOT' });
}

// ============================================================================
// EMAIL CONFIGURATION
// ============================================================================

logger.info(`Configurare email...`, { module: 'BOOT' });

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS 
    }
});

// Test email connection
transporter.verify((error, success) => {
    if (error) {
        logger.warn(`Email service nu este disponibil`, { module: 'EMAIL', details: { error: error.message } });
    } else {
        logger.success(`Email service conectat`, { module: 'EMAIL' });
    }
});

// ============================================================================
// SECURITY HELPERS
// ============================================================================

const allowedUploadMap = new Map<string, string[]>([
    ['.pdf', ['application/pdf']],
    ['.png', ['image/png']],
    ['.jpg', ['image/jpeg']],
    ['.jpeg', ['image/jpeg']],
    ['.webp', ['image/webp']]
]);

const hasSignature = (buffer: Buffer, signature: number[]) =>
    signature.every((value, index) => buffer[index] === value);

const validateUploadedFileSignature = (filePath: string, mimeType: string): boolean => {
    const fileBuffer = fs.readFileSync(filePath);
    const bytes = fileBuffer.subarray(0, 16);

    if (mimeType === 'application/pdf') {
        return hasSignature(bytes, [0x25, 0x50, 0x44, 0x46]);
    }
    if (mimeType === 'image/png') {
        return hasSignature(bytes, [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
    }
    if (mimeType === 'image/jpeg') {
        return hasSignature(bytes, [0xFF, 0xD8, 0xFF]);
    }
    if (mimeType === 'image/webp') {
        const riff = bytes.subarray(0, 4).toString('ascii') === 'RIFF';
        const webp = bytes.subarray(8, 12).toString('ascii') === 'WEBP';
        return riff && webp;
    }
    return false;
};

const safeDeleteFile = (filePath?: string) => {
    if (!filePath) return;
    try {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    } catch (error) {
        logger.warn(`Nu s-a putut șterge fișierul invalid`, {
            module: 'UPLOAD',
            details: { filePath, error: (error as Error).message }
        });
    }
};

// ============================================================================
// MULTER CONFIGURATION
// ============================================================================

const storage = multer.diskStorage({
    destination: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, destination: string) => void
    ) => {
        cb(null, uploadDir);
    },
    filename: (
        req: Request,
        file: Express.Multer.File,
        cb: (error: Error | null, filename: string) => void
    ) => {
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        cb(null, uniqueSuffix + path.extname(file.originalname).toLowerCase());
    }
});

const fileFilter: multer.Options['fileFilter'] = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();
    const allowedMimes = allowedUploadMap.get(extension);

    if (!allowedMimes || !allowedMimes.includes(file.mimetype)) {
        return cb(new Error('Tip fișier neacceptat. Sunt permise: PDF, PNG, JPG, JPEG, WEBP.'));
    }
    cb(null, true);
};

const upload = multer({ 
    storage, 
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 } 
});

logger.success(`Multer upload configurat`, { module: 'BOOT', details: { maxSize: '10MB' } });

// ============================================================================
// MIDDLEWARE - SECURITY & PARSING
// ============================================================================

app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.options(/.*/, corsPreflight);
app.use(corsMiddleware);

logger.info(`CORS configurat`, {
    module: 'BOOT',
    details: {
        origins: allowedOrigins,
        credentials: true,
        noOriginMode: allowNoOrigin ? 'allowed' : 'requires X-Test-Api-Key'
    }
});

app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadDir));

const globalApiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { error: 'Prea multe cereri. Încearcă din nou în câteva minute.' }
});

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 8,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { error: 'Prea multe încercări de autentificare. Încearcă din nou mai târziu.' }
});

const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { error: 'Ai trimis prea multe solicitări. Încearcă din nou mai târziu.' }
});

const announcementsWriteLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    skip: (req) => req.method === 'OPTIONS',
    message: { error: 'Prea multe operații de publicare. Încearcă din nou mai târziu.' }
});

app.use('/api', globalApiLimiter);
app.use('/api/login', authLimiter);
app.use('/api/contact-primar', contactLimiter);


// ============================================================================
// MIDDLEWARE - REQUEST TRACKING & LOGGING
// ============================================================================

app.use((req: any, res: Response, next: NextFunction) => {
    req.id = crypto.randomBytes(4).toString('hex');
    req.startTime = Date.now();
    
    // Logging la Response
    const originalSend = res.send;
    res.send = function(data) {
        const duration = Date.now() - req.startTime;
        const statusColor = res.statusCode >= 400 ? LOG_LEVELS.ERROR : 
                           res.statusCode >= 300 ? LOG_LEVELS.WARN : 
                           LOG_LEVELS.SUCCESS;
        
        console.log(
            `${statusColor}[${res.statusCode}]${LOG_LEVELS.RESET} ${req.method} ${req.path} #${req.id} (${duration}ms)`
        );
        
        return originalSend.call(this, data);
    };
    
    next();
});

// ============================================================================
// MIDDLEWARE - AUTH
// ============================================================================

const authenticateToken = (req: any, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        logger.warn(`Access neautorizat - token lipsă`, { module: 'AUTH', requestId: req.id });
        return res.status(401).json({ error: 'Autentificare necesară.' });
    }

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        logger.warn(`Token invalid sau expirat`, { module: 'AUTH', requestId: req.id });
        return res.status(401).json({ error: 'Sesiune expirată.' });
    }
};

const authorizeRoles = (...roles: string[]) => {
    return (req: any, res: Response, next: NextFunction) => {
        const role = String(req.user?.role || '').toUpperCase();
        if (!role || !roles.includes(role)) {
            logger.warn(`Access neautorizat - rol insuficient`, {
                module: 'AUTH',
                requestId: req.id,
                details: { role, allowedRoles: roles }
            });
            return res.status(403).json({ error: 'Acces restricționat.' });
        }
        next();
    };
};

// ============================================================================
// RUTA: GET /api/announcements - ANUNȚURI
// ============================================================================

app.get('/api/announcements', async (req: any, res: Response) => {
    const startTime = Date.now();
    
    try {
        logger.info(`Preluare anunțuri...`, { module: 'ANNOUNCEMENTS', requestId: req.id });
        
        const announcements = await prisma.announcement.findMany({
            where: { isPublished: true },
            include: { author: true },
            orderBy: { createdAt: 'desc' }
        });
        
        const duration = Date.now() - startTime;
        logger.success(`Anunțuri preluate cu succes`, { 
            module: 'ANNOUNCEMENTS', 
            requestId: req.id,
            duration,
            details: { count: announcements.length }
        });
        
        res.json(announcements);
    } catch (error) {
        logger.error(`Eroare preluare anunțuri`, error, { module: 'ANNOUNCEMENTS', requestId: req.id });
        res.status(500).json({ error: "Eroare la preluarea anunțurilor" });
    }
});

// ============================================================================
// RUTA: POST /api/announcements - CREARE ANUNȚ
// ============================================================================

app.post('/api/announcements', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), announcementsWriteLimiter, upload.single('file'), async (req: any, res: Response): Promise<any> => {
    const { title, content, category } = req.body;
    const startTime = Date.now();
    
    logger.info(`Creare anunț...`, { module: 'ANNOUNCEMENTS', requestId: req.id });
    
    try {
        // Validare input
        if (!title || !content) {
            logger.warn(`Validare eșuată - date incomplete`, { 
                module: 'ANNOUNCEMENTS', 
                requestId: req.id,
                details: { hasTitle: !!title, hasContent: !!content }
            });
            safeDeleteFile(req.file?.path);
            return res.status(400).json({ error: 'Titlu și conținut sunt obligatorii.' });
        }

        if (!req.user?.userId) {
            safeDeleteFile(req.file?.path);
            return res.status(401).json({ error: 'Sesiune invalidă. Reautentificare necesară.' });
        }

        if (req.file && !validateUploadedFileSignature(req.file.path, req.file.mimetype)) {
            logger.warn(`Upload blocat - semnătură fișier invalidă`, {
                module: 'ANNOUNCEMENTS',
                requestId: req.id,
                details: { filename: req.file.originalname, mimetype: req.file.mimetype }
            });
            safeDeleteFile(req.file.path);
            return res.status(400).json({ error: 'Fișier invalid sau corupt.' });
        }

        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
        const authorId = Number(req.user.userId);
        
        logger.debug(`Date anunț validat`, { 
            module: 'ANNOUNCEMENTS', 
            requestId: req.id,
            details: { title: title.substring(0, 50), category, hasFile: !!fileUrl, authorId }
        });

        const newAnnouncement = await prisma.announcement.create({
            data: {
                title: String(title),
                content: String(content),
                category: String(category || "General"),
                fileUrl: fileUrl,
                isPublished: true,
                authorId
            },
            include: { author: true }
        });

        const duration = Date.now() - startTime;
        logger.success(`Anunț creat cu succes`, { 
            module: 'ANNOUNCEMENTS', 
            requestId: req.id,
            duration,
            details: { id: newAnnouncement.id, title: newAnnouncement.title, category: newAnnouncement.category }
        });
        
        res.status(201).json(newAnnouncement);
    } catch (error) {
        safeDeleteFile(req.file?.path);
        logger.error(`Eroare creare anunț`, error, { 
            module: 'ANNOUNCEMENTS', 
            requestId: req.id,
            details: { title: title?.substring(0, 30) }
        });
        res.status(500).json({ error: "Eroare la salvare." });
    }
});

// ============================================================================
// RUTA: POST /api/contact-primar - AUDIENȚE
// ============================================================================

app.post('/api/contact-primar', async (req: Request, res: Response): Promise<any> => {
    const { name, phone, email, message } = req.body as any;
    const startTime = Date.now();
    const reqId = (req as any).id;
    
    logger.info(`Preluare solicitare audiență...`, { module: 'CONTACT', requestId: reqId });

    if (!name || !phone || !email) {
        logger.warn(`Validare eșuată - date lipsă`, { 
            module: 'CONTACT', 
            requestId: reqId,
            details: { hasName: !!name, hasPhone: !!phone, hasEmail: !!email }
        });
        return res.status(400).json({ error: 'Toate câmpurile sunt obligatorii.' });
    }

    const OFFICIAL_BLUE = "#003875";
    const telLink = phone.replace(/\D/g, '');
    const stemaPath = path.join(uploadDir, 'stema.png');
    
    const attachments = [];
    const hasLogo = fs.existsSync(stemaPath);

    if (hasLogo) {
        attachments.push({
            filename: 'stema.png',
            path: stemaPath,
            cid: 'stema_logo'
        });
        logger.debug(`Stema atașată la email`, { module: 'CONTACT', requestId: reqId });
    } else {
        logger.warn(`Stema.png nu a fost găsită`, { module: 'CONTACT', requestId: reqId, details: { path: stemaPath } });
    }

    const logoHtml = hasLogo 
        ? `<img src="cid:stema_logo" width="90" alt="Stema" style="display: block; margin: 0 auto 15px auto;">`
        : ``;

    const adminLogoHtml = hasLogo
        ? `<img src="cid:stema_logo" width="120" style="margin-bottom: 25px; display: block;">`
        : ``;

    try {
        logger.debug(`Preparare email-uri...`, { module: 'CONTACT', requestId: reqId, details: { recipient: email } });

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
            to: process.env.PRIMAR_EMAIL || 'admin@primarie.ro',
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

        logger.debug(`Trimitere email către cetățean...`, { module: 'CONTACT', requestId: reqId });
        await transporter.sendMail(mailToUser);
        logger.success(`Email trimis cetățeanului`, { module: 'CONTACT', requestId: reqId, details: { to: email } });

        logger.debug(`Trimitere email către primar...`, { module: 'CONTACT', requestId: reqId });
        await transporter.sendMail(mailToPrimar);
        logger.success(`Email trimis primarului`, { module: 'CONTACT', requestId: reqId });

        const duration = Date.now() - startTime;
        logger.success(`Solicitare audiență procesată`, { 
            module: 'CONTACT', 
            requestId: reqId,
            duration,
            details: { name, email, phone: phone.substring(0, 3) + '***' }
        });
        res.status(200).json({ success: true });

    } catch (error) {
        logger.error(`Eroare trimitere email`, error, { 
            module: 'CONTACT', 
            requestId: reqId,
            details: { name, email }
        });
        res.status(500).json({ error: 'Eroare server la trimiterea mail-ului.' });
    }
});

// ============================================================================
// RUTA: POST /api/login - AUTENTIFICARE
// ============================================================================

app.post('/api/login', async (req: any, res: Response) => {
    const { email, password } = req.body;
    const startTime = Date.now();
    const reqId = req.id;
    
    logger.info(`Încercare autentificare...`, { module: 'AUTH', requestId: reqId, details: { email: email?.substring(0, 3) + '***' } });

    try {
        const normalizedEmail = email.toLowerCase().trim();
        const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

        if (!user) {
            logger.warn(`Login eșuat - utilizator nu găsit`, { module: 'AUTH', requestId: reqId, details: { email: normalizedEmail } });
            return res.status(401).json({ error: 'Credențiale invalide.' });
        }

        logger.debug(`Utilizator găsit`, { module: 'AUTH', requestId: reqId, details: { userId: user.id, role: user.role } });

        const isBcrypt = user.password.startsWith('$2');
        const isMatch = isBcrypt ? await bcrypt.compare(password, user.password) : password === user.password;

        if (isMatch) {
            const token = jwt.sign({ userId: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: '24h' });
            const duration = Date.now() - startTime;
            
            logger.success(`Login reușit`, { 
                module: 'AUTH', 
                requestId: reqId,
                duration,
                details: { userId: user.id, name: user.name, role: user.role }
            });
            res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
        } else {
            logger.warn(`Login eșuat - parolă invalidă`, { module: 'AUTH', requestId: reqId, details: { email: normalizedEmail } });
            res.status(401).json({ error: 'Credențiale invalide.' });
        }
    } catch (err) {
        logger.error(`Eroare autentificare`, err, { module: 'AUTH', requestId: reqId });
        res.status(500).json({ error: 'Eroare server.' });
    }
});

// ============================================================================
// RUTA: GET /health - HEALTH CHECK
// ============================================================================

app.get('/health', (req: any, res: Response) => {
    logger.debug(`Health check request`, { module: 'HEALTH', requestId: req.id });
    res.json({ status: 'OK', timestamp: new Date(), uptime: process.uptime() });
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

app.use((err: any, req: any, res: Response, next: NextFunction) => {
    if (err?.message === 'CORS_ORIGIN_MISSING') {
        return res
            .status(403)
            .json({ error: 'CORS: missing Origin. Use X-Test-Api-Key for Postman/curl.' });
    }
    if (err?.message === 'CORS_ORIGIN_NOT_ALLOWED') {
        return res.status(403).json({ error: 'CORS: origin not allowed.' });
    }
    logger.error(`Unhandled error`, err, { module: 'ERROR', requestId: req.id });
    res.status(500).json({ error: 'Internal server error' });
});

// ============================================================================
// START SERVER
// ============================================================================

const server = app.listen(PORT, () => {
    logger.divider();
    logger.success(`✨ SERVER STARTED ✨`, { module: 'BOOT' });
    logger.divider();
    logger.info(`Listening on port`, { module: 'BOOT', details: { port: PORT } });
    logger.info(`Environment`, { module: 'BOOT', details: { env: process.env.NODE_ENV || 'development' } });
    
    // Check for stema.png
    const stemaCheck = path.join(uploadDir, 'stema.png');
    if (fs.existsSync(stemaCheck)) {
        logger.success(`Stema.png is available`, { module: 'BOOT', details: { path: stemaCheck } });
    } else {
        logger.warn(`Stema.png not found`, { module: 'BOOT', details: { expectedPath: stemaCheck } });
    }
    
    // Check database connection
    prisma.$queryRaw`SELECT 1`.then(() => {
        logger.success(`Database connected`, { module: 'DATABASE' });
    }).catch((err) => {
        logger.error(`Database connection failed`, err, { module: 'DATABASE' });
    });
    
    logger.divider();
    console.log('\n📍 API Endpoints:');
    console.log('   GET  /api/announcements');
    console.log('   POST /api/announcements');
    console.log('   POST /api/contact-primar');
    console.log('   POST /api/login');
    console.log('   GET  /health\n');
    logger.divider();
});

// ============================================================================
// GRACEFUL SHUTDOWN
// ============================================================================

process.on('SIGTERM', async () => {
    logger.warn(`SIGTERM received, shutting down gracefully...`, { module: 'BOOT' });
    server.close(async () => {
        await prisma.$disconnect();
        logger.info(`Server closed`, { module: 'BOOT' });
        process.exit(0);
    });
});

process.on('SIGINT', async () => {
    logger.warn(`SIGINT received, shutting down gracefully...`, { module: 'BOOT' });
    server.close(async () => {
        await prisma.$disconnect();
        logger.info(`Server closed`, { module: 'BOOT' });
        process.exit(0);
    });
});

export default app;
