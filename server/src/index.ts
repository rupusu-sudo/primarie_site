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
import { allowNoOrigin, allowedOrigins, corsMiddleware, corsPreflight } from './config/cors';
import { appEnv } from './config/env';
import { JWT_SECRET } from './config/jwtSecret';

const IS_EPHEMERAL_JWT_SECRET = false;

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

const app = express();
const prisma = new PrismaClient();
const PORT = appEnv.port;

// Railway runs behind a proxy; this keeps rate-limit and request IP handling correct.
app.set('trust proxy', 1);

logger.info(`Inițializare server...`, { module: 'BOOT' });
if (IS_EPHEMERAL_JWT_SECRET) {
    logger.warn(
        'JWT secret temporar activ. Configurează JWT_SECRET (min 32) în mediul de deploy.',
        { module: 'BOOT' }
    );
}

if (appEnv.warnings.length > 0) {
    appEnv.warnings.forEach((warning) => logger.warn(warning, { module: 'BOOT' }));
}

// ============================================================================
// CONFIGURARE DIRECTOARE
// ============================================================================

const uploadDir = appEnv.uploads.dir;
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

const smtpUser = appEnv.email.user;
const smtpService = appEnv.email.service;
const smtpServiceLower = smtpService.toLowerCase();
const smtpPass = appEnv.email.pass;
const smtpHost = appEnv.email.host;
const smtpPort = appEnv.email.port;
const smtpSecure = appEnv.email.secure;
const isGmailService = !smtpHost && smtpServiceLower === 'gmail';

if (isGmailService && smtpUser && !/@gmail\.com$|@googlemail\.com$/i.test(smtpUser)) {
    logger.warn(`SMTP_USER nu pare cont Gmail pentru SMTP_SERVICE=gmail`, {
        module: 'EMAIL',
        details: { smtpUser }
    });
}

let transporter: nodemailer.Transporter | null = null;

if (appEnv.email.enabled) {
    const transportConfig = smtpHost
        ? {
              host: smtpHost,
              port: smtpPort,
              secure: smtpSecure,
              auth: { user: smtpUser, pass: smtpPass },
              connectionTimeout: 15000,
              greetingTimeout: 10000,
              socketTimeout: 20000
          }
        : {
              service: smtpService,
              auth: { user: smtpUser, pass: smtpPass },
              connectionTimeout: 15000,
              greetingTimeout: 10000,
              socketTimeout: 20000
          };

    transporter = nodemailer.createTransport(transportConfig);

    // Test email connection
    transporter.verify((error) => {
        if (error) {
            logger.warn(`Email service nu este disponibil`, { module: 'EMAIL', details: { error: error.message } });
        } else {
            logger.success(`Email service conectat`, { module: 'EMAIL' });
        }
    });
} else {
    logger.warn(`Email service dezactivat - configurare SMTP incompleta`, {
        module: 'EMAIL',
        details: {
            hasSmtpUser: !!smtpUser,
            hasSmtpPass: !!smtpPass,
            hasSmtpService: !!smtpService,
            hasSmtpHost: !!smtpHost
        }
    });
}

const sendMailWithTimeout = async (mailOptions: nodemailer.SendMailOptions, timeoutMs = 20000) => {
    if (!transporter) throw new Error('SMTP_NOT_CONFIGURED');

    let timeoutHandle: NodeJS.Timeout | null = null;

    const timeoutPromise = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error(`SMTP_TIMEOUT_${timeoutMs}ms`)), timeoutMs);
    });

    try {
        return await Promise.race([transporter.sendMail(mailOptions), timeoutPromise]);
    } finally {
        if (timeoutHandle) clearTimeout(timeoutHandle);
    }
};

const isSmtpAuthError = (errorMessage: string) =>
    /invalid login|username and password not accepted|badcredentials|eauth|535[-\s]*5\.7\.8/i.test(errorMessage);

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
    limits: { fileSize: appEnv.uploads.maxFileSizeBytes } 
});

logger.success(`Multer upload configurat`, {
    module: 'BOOT',
    details: { maxSizeBytes: appEnv.uploads.maxFileSizeBytes }
});

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
app.use(
    '/uploads',
    express.static(uploadDir, {
        maxAge: '30d',
        etag: true,
        setHeaders: (res, filePath) => {
            if (/\.(avif|webp|png|jpe?g|svg)$/i.test(filePath)) {
                res.setHeader('Cache-Control', 'public, max-age=2592000');
                return;
            }
            res.setHeader('Cache-Control', 'public, max-age=86400');
        },
    }),
);

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
app.use('/api/oportunitati/contact', contactLimiter);


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

const getOptionalAuthenticatedUser = (req: Request) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return null;

    try {
        return jwt.verify(token, JWT_SECRET) as any;
    } catch {
        return null;
    }
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

const toStringValue = (value: unknown) => (typeof value === 'string' ? value : '');
const normalizeSingleLine = (value: string) => value.trim().replace(/\s+/g, ' ');
const normalizeMultiline = (value: string) =>
    value
        .replace(/\r\n/g, '\n')
        .replace(/\r/g, '\n')
        .trim();
const hasHeaderInjection = (value: string) => /[\r\n]/.test(value);
const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

const COUNCIL_ACTIVITY_TYPES = [
    'adopted_decision',
    'draft_decision',
    'convocation',
    'meeting_minutes'
] as const;

type CouncilActivityType = (typeof COUNCIL_ACTIVITY_TYPES)[number];

const isCouncilActivityType = (value: string): value is CouncilActivityType =>
    COUNCIL_ACTIVITY_TYPES.includes(value as CouncilActivityType);

const toQueryString = (value: unknown) => {
    if (Array.isArray(value)) return toStringValue(value[0]);
    return toStringValue(value);
};

const toOptionalNormalizedText = (value: unknown) => {
    const normalized = normalizeMultiline(toStringValue(value));
    return normalized ? normalized : null;
};

const parseYearValue = (value: unknown) => {
    const raw = normalizeSingleLine(toStringValue(value));
    if (!raw) return null;

    const parsed = Number(raw);
    if (!Number.isInteger(parsed) || parsed < 1900 || parsed > 2100) return null;
    return parsed;
};

const parseDateValue = (value: unknown) => {
    const raw = normalizeSingleLine(toStringValue(value));
    if (!raw) return null;

    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return null;
    return parsed;
};

const parseBooleanValue = (value: unknown, defaultValue = true) => {
    if (typeof value === 'boolean') return value;
    const raw = normalizeSingleLine(toStringValue(value)).toLowerCase();
    if (!raw) return defaultValue;
    if (['true', '1', 'yes', 'da', 'on'].includes(raw)) return true;
    if (['false', '0', 'no', 'nu', 'off'].includes(raw)) return false;
    return defaultValue;
};

const createSlug = (value: string) =>
    value
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 180);

const buildCouncilActivitySlug = (title: string, idSeed?: number) => {
    const baseSlug = createSlug(title) || 'document-consiliu-local';
    const suffix = idSeed ? String(idSeed) : `${Date.now()}-${crypto.randomBytes(2).toString('hex')}`;
    return `${baseSlug}-${suffix}`.slice(0, 255);
};

const getUploadPathFromUrl = (fileUrl?: string | null) => {
    if (!fileUrl || !fileUrl.startsWith('/uploads/')) return undefined;
    return path.join(uploadDir, path.basename(fileUrl));
};

const safeDeleteUploadByUrl = (fileUrl?: string | null) => {
    safeDeleteFile(getUploadPathFromUrl(fileUrl));
};

const splitStoredFileUrls = (fileUrl?: string | null) =>
    normalizeSingleLine(toStringValue(fileUrl))
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean);

const safeDeleteUploadListByUrl = (fileUrl?: string | null) => {
    splitStoredFileUrls(fileUrl).forEach((entry) => safeDeleteUploadByUrl(entry));
};

const collectUploadedFiles = (files: any): Express.Multer.File[] => {
    if (!files) return [];
    if (Array.isArray(files)) return files;
    if (typeof files === 'object') {
        return Object.values(files).flatMap((entry) => (Array.isArray(entry) ? entry : []));
    }
    return [];
};

const validateUploadedFiles = (files: Express.Multer.File[]) =>
    files.every((file) => validateUploadedFileSignature(file.path, file.mimetype));

// ============================================================================
// RUTE: DOCUMENTE GENERALE
// ============================================================================

app.get('/api/documents', async (req: Request, res: Response): Promise<any> => {
    const reqId = (req as any).id;
    const category = normalizeSingleLine(toQueryString(req.query.category || req.query.servicePage)).slice(0, 100);
    const deviceId = normalizeSingleLine(toQueryString(req.query.deviceId)).slice(0, 100);

    try {
        if (category === 'vocea-almajului') {
            const documents = await prisma.document.findMany({
                where: {
                    OR: [{ category: 'vocea-almajului' }, { category: 'reply' }]
                },
                orderBy: [{ createdAt: 'desc' }]
            });

            const likedIds =
                deviceId && documents.length > 0
                    ? await prisma.documentLike.findMany({
                          where: {
                              deviceId,
                              documentId: { in: documents.map((document) => document.id) }
                          },
                          select: { documentId: true }
                      })
                    : [];

            return res.json({
                documents,
                likedIds: likedIds.map((entry) => entry.documentId)
            });
        }

        const documents = await prisma.document.findMany({
            where: category ? { category } : undefined,
            orderBy: [{ createdAt: 'desc' }]
        });

        logger.debug(`Documente generale preluate`, {
            module: 'DOCUMENTS',
            requestId: reqId,
            details: { category: category || 'all', count: documents.length }
        });

        return res.json(documents);
    } catch (error) {
        logger.error(`Eroare la preluarea documentelor`, error, {
            module: 'DOCUMENTS',
            requestId: reqId,
            details: { category: category || 'all' }
        });
        return res.status(500).json({ error: 'Nu am putut incarca documentele.' });
    }
});

app.post(
    '/api/documents',
    announcementsWriteLimiter,
    upload.fields([
        { name: 'file', maxCount: 1 },
        { name: 'files', maxCount: 5 }
    ]),
    async (req: any, res: Response): Promise<any> => {
        const reqId = req.id;
        const authUser = getOptionalAuthenticatedUser(req);
        const role = String(authUser?.role || '').toUpperCase();
        const title = normalizeSingleLine(toStringValue(req.body?.title)).slice(0, 255);
        const category = normalizeSingleLine(
            toStringValue(req.body?.servicePage || req.body?.category)
        ).slice(0, 100);
        const content = toOptionalNormalizedText(req.body?.content);
        const uploadedFiles = collectUploadedFiles(req.files);
        const ownerId = normalizeSingleLine(
            toStringValue(req.body?.ownerId || req.headers['x-device-id'])
        ).slice(0, 100) || null;
        const isCitizenPost = category === 'vocea-almajului';
        const authorNameInput = normalizeSingleLine(toStringValue(req.body?.authorName)).slice(0, 255);
        const authorName = authorNameInput || authUser?.name || null;
        const year = parseYearValue(req.body?.year) ?? new Date().getFullYear();

        if (!title || !category) {
            uploadedFiles.forEach((file) => safeDeleteFile(file.path));
            return res.status(400).json({ error: 'Titlul si categoria sunt obligatorii.' });
        }

        if (!isCitizenPost && !['ADMIN', 'EDITOR'].includes(role)) {
            uploadedFiles.forEach((file) => safeDeleteFile(file.path));
            return res.status(403).json({ error: 'Acces restrictionat.' });
        }

        if (isCitizenPost && !authorName && !authUser) {
            uploadedFiles.forEach((file) => safeDeleteFile(file.path));
            return res.status(400).json({ error: 'Numele autorului este obligatoriu.' });
        }

        if (!isCitizenPost && uploadedFiles.length === 0) {
            return res.status(400).json({ error: 'Atasati documentul inainte de publicare.' });
        }

        if (!validateUploadedFiles(uploadedFiles)) {
            uploadedFiles.forEach((file) => safeDeleteFile(file.path));
            return res.status(400).json({ error: 'Fisier invalid sau corupt.' });
        }

        try {
            const fileUrl =
                uploadedFiles.length > 0
                    ? uploadedFiles.map((file) => `/uploads/${file.filename}`).join(',')
                    : null;

            const created = await prisma.document.create({
                data: {
                    title,
                    category,
                    content,
                    fileUrl,
                    authorName,
                    ownerId,
                    officialSupport: ['ADMIN', 'EDITOR'].includes(role),
                    year
                }
            });

            logger.success(`Document creat`, {
                module: 'DOCUMENTS',
                requestId: reqId,
                details: { id: created.id, category, hasFile: !!fileUrl }
            });

            return res.status(201).json(created);
        } catch (error) {
            uploadedFiles.forEach((file) => safeDeleteFile(file.path));
            logger.error(`Eroare la crearea documentului`, error, {
                module: 'DOCUMENTS',
                requestId: reqId,
                details: { category }
            });
            return res.status(500).json({ error: 'Nu am putut salva documentul.' });
        }
    }
);

app.post('/api/documents/reply', announcementsWriteLimiter, async (req: Request, res: Response): Promise<any> => {
    const reqId = (req as any).id;
    const authUser = getOptionalAuthenticatedUser(req);
    const role = String(authUser?.role || '').toUpperCase();
    const content = toOptionalNormalizedText(req.body?.content);
    const parentId = Number(req.body?.parentId);
    const ownerId = normalizeSingleLine(
        toStringValue(req.body?.ownerId || req.headers['x-device-id'])
    ).slice(0, 100) || null;
    const authorNameInput = normalizeSingleLine(toStringValue(req.body?.authorName)).slice(0, 255);
    const authorName = authorNameInput || authUser?.name || null;

    if (!content || !Number.isInteger(parentId) || parentId <= 0) {
        return res.status(400).json({ error: 'Continutul si parintele raspunsului sunt obligatorii.' });
    }

    if (!authorName && !['ADMIN', 'EDITOR'].includes(role)) {
        return res.status(400).json({ error: 'Numele autorului este obligatoriu.' });
    }

    try {
        const parent = await prisma.document.findUnique({ where: { id: parentId } });
        if (!parent || parent.category !== 'vocea-almajului') {
            return res.status(404).json({ error: 'Mesajul la care raspundeti nu a fost gasit.' });
        }

        const created = await prisma.document.create({
            data: {
                title: `Raspuns la ${parent.title}`.slice(0, 255),
                category: 'reply',
                content,
                authorName: authorName || 'Reprezentant Primarie',
                ownerId,
                officialSupport: ['ADMIN', 'EDITOR'].includes(role),
                parentId,
                year: new Date().getFullYear()
            }
        });

        logger.success(`Raspuns document creat`, {
            module: 'DOCUMENTS',
            requestId: reqId,
            details: { id: created.id, parentId }
        });

        return res.status(201).json(created);
    } catch (error) {
        logger.error(`Eroare la crearea raspunsului`, error, {
            module: 'DOCUMENTS',
            requestId: reqId,
            details: { parentId }
        });
        return res.status(500).json({ error: 'Nu am putut salva raspunsul.' });
    }
});

app.post('/api/documents/:id/like', announcementsWriteLimiter, async (req: Request, res: Response): Promise<any> => {
    const reqId = (req as any).id;
    const documentId = Number(req.params.id);
    const deviceId = normalizeSingleLine(toStringValue(req.headers['x-device-id'])).slice(0, 100);

    if (!Number.isInteger(documentId) || documentId <= 0 || !deviceId) {
        return res.status(400).json({ error: 'Documentul sau dispozitivul nu sunt valide.' });
    }

    try {
        const document = await prisma.document.findUnique({ where: { id: documentId } });
        if (!document) {
            return res.status(404).json({ error: 'Documentul nu a fost gasit.' });
        }

        const existingLike = await prisma.documentLike.findUnique({
            where: {
                documentId_deviceId: {
                    documentId,
                    deviceId
                }
            }
        });

        if (existingLike) {
            return res.json({ liked: true, alreadyLiked: true });
        }

        await prisma.$transaction([
            prisma.documentLike.create({
                data: {
                    documentId,
                    deviceId
                }
            }),
            prisma.document.update({
                where: { id: documentId },
                data: { likes: { increment: 1 } }
            })
        ]);

        logger.success(`Like inregistrat`, {
            module: 'DOCUMENTS',
            requestId: reqId,
            details: { documentId }
        });

        return res.json({ liked: true });
    } catch (error) {
        logger.error(`Eroare la inregistrarea like-ului`, error, {
            module: 'DOCUMENTS',
            requestId: reqId,
            details: { documentId }
        });
        return res.status(500).json({ error: 'Nu am putut inregistra aprecierea.' });
    }
});

app.delete('/api/documents/:id', async (req: Request, res: Response): Promise<any> => {
    const reqId = (req as any).id;
    const documentId = Number(req.params.id);
    const authUser = getOptionalAuthenticatedUser(req);
    const role = String(authUser?.role || '').toUpperCase();
    const deviceId = normalizeSingleLine(toStringValue(req.headers['x-device-id'])).slice(0, 100);

    if (!Number.isInteger(documentId) || documentId <= 0) {
        return res.status(400).json({ error: 'Document invalid.' });
    }

    try {
        const existing = await prisma.document.findUnique({
            where: { id: documentId },
            include: { replies: true }
        });

        if (!existing) {
            return res.status(404).json({ error: 'Documentul nu a fost gasit.' });
        }

        const canDelete =
            ['ADMIN', 'EDITOR'].includes(role) || (deviceId && existing.ownerId && existing.ownerId === deviceId);

        if (!canDelete) {
            return res.status(403).json({ error: 'Nu aveti permisiunea sa stergeti acest document.' });
        }

        const filesToDelete = [existing.fileUrl, ...existing.replies.map((reply) => reply.fileUrl)];
        await prisma.document.delete({ where: { id: documentId } });
        filesToDelete.forEach((fileUrl) => safeDeleteUploadListByUrl(fileUrl));

        logger.success(`Document sters`, {
            module: 'DOCUMENTS',
            requestId: reqId,
            details: { documentId }
        });

        return res.json({ ok: true });
    } catch (error) {
        logger.error(`Eroare la stergerea documentului`, error, {
            module: 'DOCUMENTS',
            requestId: reqId,
            details: { documentId }
        });
        return res.status(500).json({ error: 'Nu am putut sterge documentul.' });
    }
});

// ============================================================================
// RUTE: ACTIVITATE CONSILIUL LOCAL
// ============================================================================

app.get('/api/council-activity/years', async (req: Request, res: Response): Promise<any> => {
    const reqId = (req as any).id;
    const type = normalizeSingleLine(toQueryString(req.query.type));

    if (type && !isCouncilActivityType(type)) {
        return res.status(400).json({ error: 'Tip de document invalid.' });
    }

    try {
        const years = await prisma.councilActivityDocument.findMany({
            where: {
                isPublished: true,
                ...(type ? { type } : {})
            },
            select: { year: true },
            distinct: ['year'],
            orderBy: { year: 'desc' }
        });

        logger.debug(`Ani activitate consiliu preluati`, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId,
            details: { type: type || 'all', count: years.length }
        });

        return res.json(years.map((entry: { year: number }) => entry.year));
    } catch (error) {
        logger.error(`Eroare la preluarea anilor pentru activitate consiliu`, error, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId
        });
        return res.status(500).json({ error: 'Nu am putut incarca anii disponibili.' });
    }
});

app.get('/api/council-activity/manage', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), async (req: Request, res: Response): Promise<any> => {
    const reqId = (req as any).id;
    const type = normalizeSingleLine(toQueryString(req.query.type));
    const year = parseYearValue(toQueryString(req.query.year));
    const searchQuery = normalizeSingleLine(toQueryString(req.query.q));

    if (type && !isCouncilActivityType(type)) {
        return res.status(400).json({ error: 'Tip de document invalid.' });
    }

    try {
        const documents = await prisma.councilActivityDocument.findMany({
            where: {
                ...(type ? { type } : {}),
                ...(year ? { year } : {}),
                ...(searchQuery
                    ? {
                          OR: [
                              { title: { contains: searchQuery } },
                              { description: { contains: searchQuery } }
                          ]
                      }
                    : {})
            },
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }]
        });

        return res.json(documents);
    } catch (error) {
        logger.error(`Eroare la preluarea documentelor administrative`, error, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId
        });
        return res.status(500).json({ error: 'Nu am putut incarca documentele administrative.' });
    }
});

app.get('/api/council-activity', async (req: Request, res: Response): Promise<any> => {
    const reqId = (req as any).id;
    const type = normalizeSingleLine(toQueryString(req.query.type));
    const year = parseYearValue(toQueryString(req.query.year));
    const searchQuery = normalizeSingleLine(toQueryString(req.query.q));

    if (type && !isCouncilActivityType(type)) {
        return res.status(400).json({ error: 'Tip de document invalid.' });
    }

    try {
        const documents = await prisma.councilActivityDocument.findMany({
            where: {
                isPublished: true,
                ...(type ? { type } : {}),
                ...(year ? { year } : {}),
                ...(searchQuery
                    ? {
                          OR: [
                              { title: { contains: searchQuery } },
                              { description: { contains: searchQuery } }
                          ]
                      }
                    : {})
            },
            orderBy: [{ date: 'desc' }, { createdAt: 'desc' }]
        });

        logger.debug(`Documente activitate consiliu preluate`, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId,
            details: { type: type || 'all', year: year || 'all', count: documents.length }
        });

        return res.json(documents);
    } catch (error) {
        logger.error(`Eroare la preluarea documentelor activitatii consiliului local`, error, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId
        });
        return res.status(500).json({ error: 'Nu am putut incarca documentele activitatii consiliului local.' });
    }
});

app.post('/api/council-activity', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), announcementsWriteLimiter, upload.single('file'), async (req: any, res: Response): Promise<any> => {
    const reqId = req.id;
    const title = normalizeSingleLine(toStringValue(req.body?.title)).slice(0, 255);
    const type = normalizeSingleLine(toStringValue(req.body?.type));
    const year = parseYearValue(req.body?.year);
    const date = parseDateValue(req.body?.date);
    const description = toOptionalNormalizedText(req.body?.description);
    const isPublished = parseBooleanValue(req.body?.isPublished, true);

    if (!title || !type || !year || !date) {
        safeDeleteFile(req.file?.path);
        return res.status(400).json({ error: 'Titlul, tipul, anul si data sunt obligatorii.' });
    }

    if (!isCouncilActivityType(type)) {
        safeDeleteFile(req.file?.path);
        return res.status(400).json({ error: 'Tipul de document selectat nu este valid.' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'Atasati documentul inainte de publicare.' });
    }

    if (!validateUploadedFileSignature(req.file.path, req.file.mimetype)) {
        safeDeleteFile(req.file.path);
        return res.status(400).json({ error: 'Fisier invalid sau corupt.' });
    }

    try {
        const created = await prisma.councilActivityDocument.create({
            data: {
                title,
                slug: buildCouncilActivitySlug(title),
                type,
                year,
                date,
                description,
                fileUrl: `/uploads/${req.file.filename}`,
                isPublished
            }
        });

        return res.status(201).json(created);
    } catch (error) {
        safeDeleteFile(req.file?.path);
        logger.error(`Eroare la crearea documentului pentru activitate consiliu local`, error, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId,
            details: { title, type, year }
        });
        return res.status(500).json({ error: 'Nu am putut salva documentul.' });
    }
});

app.patch('/api/council-activity/:id', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), announcementsWriteLimiter, upload.single('file'), async (req: any, res: Response): Promise<any> => {
    const reqId = req.id;
    const documentId = Number(req.params.id);

    if (!Number.isInteger(documentId) || documentId <= 0) {
        safeDeleteFile(req.file?.path);
        return res.status(400).json({ error: 'Identificator invalid.' });
    }

    try {
        const existing = await prisma.councilActivityDocument.findUnique({ where: { id: documentId } });

        if (!existing) {
            safeDeleteFile(req.file?.path);
            return res.status(404).json({ error: 'Documentul nu a fost gasit.' });
        }

        if (req.file && !validateUploadedFileSignature(req.file.path, req.file.mimetype)) {
            safeDeleteFile(req.file.path);
            return res.status(400).json({ error: 'Fisier invalid sau corupt.' });
        }

        const data: Record<string, unknown> = {};
        const hasTitle = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'title');
        const hasType = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'type');
        const hasYear = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'year');
        const hasDate = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'date');
        const hasDescription = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'description');
        const hasPublished = Object.prototype.hasOwnProperty.call(req.body ?? {}, 'isPublished');

        if (hasTitle) {
            const nextTitle = normalizeSingleLine(toStringValue(req.body.title)).slice(0, 255);
            if (!nextTitle) {
                safeDeleteFile(req.file?.path);
                return res.status(400).json({ error: 'Titlul nu poate fi gol.' });
            }
            data.title = nextTitle;
            data.slug = buildCouncilActivitySlug(nextTitle, documentId);
        }

        if (hasType) {
            const nextType = normalizeSingleLine(toStringValue(req.body.type));
            if (!isCouncilActivityType(nextType)) {
                safeDeleteFile(req.file?.path);
                return res.status(400).json({ error: 'Tipul de document selectat nu este valid.' });
            }
            data.type = nextType;
        }

        if (hasYear) {
            const nextYear = parseYearValue(req.body.year);
            if (!nextYear) {
                safeDeleteFile(req.file?.path);
                return res.status(400).json({ error: 'Anul selectat nu este valid.' });
            }
            data.year = nextYear;
        }

        if (hasDate) {
            const nextDate = parseDateValue(req.body.date);
            if (!nextDate) {
                safeDeleteFile(req.file?.path);
                return res.status(400).json({ error: 'Data selectata nu este valida.' });
            }
            data.date = nextDate;
        }

        if (hasDescription) {
            data.description = toOptionalNormalizedText(req.body.description);
        }

        if (hasPublished) {
            data.isPublished = parseBooleanValue(req.body.isPublished, existing.isPublished);
        }

        if (req.file) {
            data.fileUrl = `/uploads/${req.file.filename}`;
        }

        if (!Object.keys(data).length) {
            safeDeleteFile(req.file?.path);
            return res.status(400).json({ error: 'Nu exista modificari de salvat.' });
        }

        const updated = await prisma.councilActivityDocument.update({
            where: { id: documentId },
            data
        });

        if (req.file && existing.fileUrl && existing.fileUrl !== updated.fileUrl) {
            safeDeleteUploadByUrl(existing.fileUrl);
        }

        return res.json(updated);
    } catch (error) {
        safeDeleteFile(req.file?.path);
        logger.error(`Eroare la actualizarea documentului pentru activitate consiliu local`, error, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId,
            details: { documentId }
        });
        return res.status(500).json({ error: 'Nu am putut actualiza documentul.' });
    }
});

app.delete('/api/council-activity/:id', authenticateToken, authorizeRoles('ADMIN', 'EDITOR'), announcementsWriteLimiter, async (req: any, res: Response): Promise<any> => {
    const reqId = req.id;
    const documentId = Number(req.params.id);

    if (!Number.isInteger(documentId) || documentId <= 0) {
        return res.status(400).json({ error: 'Identificator invalid.' });
    }

    try {
        const existing = await prisma.councilActivityDocument.findUnique({ where: { id: documentId } });

        if (!existing) {
            return res.status(404).json({ error: 'Documentul nu a fost gasit.' });
        }

        await prisma.councilActivityDocument.delete({ where: { id: documentId } });
        safeDeleteUploadByUrl(existing.fileUrl);

        logger.success(`Document activitate consiliu sters`, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId,
            details: { documentId }
        });

        return res.status(204).send();
    } catch (error) {
        logger.error(`Eroare la stergerea documentului pentru activitate consiliu local`, error, {
            module: 'COUNCIL_ACTIVITY',
            requestId: reqId,
            details: { documentId }
        });
        return res.status(500).json({ error: 'Nu am putut sterge documentul.' });
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

    if (!transporter) {
        logger.error(`Serviciul SMTP nu este configurat`, undefined, {
            module: 'CONTACT',
            requestId: reqId
        });
        return res.status(503).json({ error: 'Serviciul de email nu este configurat momentan.' });
    }

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
    const fromSmtpAddress = appEnv.email.fromEmail;
    
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
            from: `"Primăria Almăj" <${fromSmtpAddress}>`,
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
            from: `"Portal Cetățeni" <${fromSmtpAddress}>`,
            to: appEnv.email.recipients.primar,
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

        logger.debug(`Trimitere email-uri...`, { module: 'CONTACT', requestId: reqId });
        await Promise.all([sendMailWithTimeout(mailToUser, 20000), sendMailWithTimeout(mailToPrimar, 20000)]);
        logger.success(`Email-uri trimise`, { module: 'CONTACT', requestId: reqId, details: { to: email } });

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
        const rawError = (error as Error)?.message || String(error);
        const isTimeout = rawError.includes('SMTP_TIMEOUT');
        const isAuth = isSmtpAuthError(rawError);
        const isConfig = rawError.includes('SMTP_NOT_CONFIGURED') || isAuth;
        const status = isConfig ? 503 : 502;
        const publicError = isConfig
            ? 'Serviciul de email nu este configurat corect.'
            : isTimeout
                ? 'Serverul de email nu raspunde momentan. Incercati din nou.'
                : 'Eroare server la trimiterea mail-ului.';
        res.status(status).json({ error: publicError });
    }
});

// ============================================================================
// RUTA: POST /api/contact - CONTACT GENERAL
// ============================================================================

app.post('/api/contact', contactLimiter, async (req: Request, res: Response): Promise<any> => {
    const startTime = Date.now();
    const reqId = (req as any).id;

    logger.info(`Preluare mesaj de contact...`, { module: 'CONTACT_FORM', requestId: reqId });

    const body = (req.body || {}) as Record<string, unknown>;
    const nameRaw = toStringValue(body.name);
    const emailRaw = toStringValue(body.email);
    const phoneRaw = toStringValue(body.phone);
    const subjectRaw = toStringValue(body.subject);
    const messageRaw = toStringValue(body.message);

    if ([nameRaw, emailRaw, phoneRaw, subjectRaw].some(hasHeaderInjection)) {
        logger.warn(`Validare eșuată - header injection detectat`, {
            module: 'CONTACT_FORM',
            requestId: reqId
        });
        return res.status(400).json({ error: 'Datele introduse nu sunt valide.' });
    }

    const name = normalizeSingleLine(nameRaw);
    const email = normalizeSingleLine(emailRaw).toLowerCase();
    const phone = normalizeSingleLine(phoneRaw).slice(0, 50);
    const subject = normalizeSingleLine(subjectRaw).slice(0, 160);
    const message = normalizeMultiline(messageRaw);

    if (!name || !email || !subject || !message) {
        logger.warn(`Validare eșuată - câmpuri obligatorii lipsă`, {
            module: 'CONTACT_FORM',
            requestId: reqId,
            details: { hasName: !!name, hasEmail: !!email, hasSubject: !!subject, hasMessage: !!message }
        });
        return res.status(400).json({ error: 'Nume, email, subiect și mesaj sunt obligatorii.' });
    }

    const hasValidLengths =
        name.length >= 2 &&
        name.length <= 80 &&
        email.length >= 5 &&
        email.length <= 120 &&
        subject.length >= 3 &&
        subject.length <= 160 &&
        message.length >= 10 &&
        message.length <= 2000 &&
        phone.length <= 50;

    if (!hasValidLengths || !isValidEmail(email)) {
        logger.warn(`Validare eșuată - format invalid`, {
            module: 'CONTACT_FORM',
            requestId: reqId,
            details: {
                nameLength: name.length,
                emailLength: email.length,
                subjectLength: subject.length,
                messageLength: message.length,
                phoneLength: phone.length,
                emailFormatValid: isValidEmail(email)
            }
        });
        return res.status(400).json({ error: 'Datele introduse nu sunt valide.' });
    }

    if (!transporter) {
        logger.error(`Serviciul SMTP nu este configurat`, undefined, {
            module: 'CONTACT_FORM',
            requestId: reqId
        });
        return res.status(503).json({ error: 'Serviciul de email nu este configurat momentan.' });
    }

    const OFFICIAL_BLUE = "#003875";
    const fromAddress = `"${appEnv.email.fromName}" <${appEnv.email.fromEmail}>`;
    const contactRecipient = appEnv.email.recipients.contact;
    const stemaPath = path.join(uploadDir, 'stema.png');
    const safePhoneDigits = phone.replace(/\D/g, '');
    const attachments = [];
    const hasLogo = fs.existsSync(stemaPath);

    if (hasLogo) {
        attachments.push({
            filename: 'stema.png',
            path: stemaPath,
            cid: 'stema_logo'
        });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Nespecificat');
    const safeSubject = escapeHtml(subject);
    const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br>');
    const safeMessageText = message || 'Mesaj indisponibil.';
    const logoHtml = hasLogo
        ? `<img src="cid:stema_logo" width="120" alt="Stema" style="margin-bottom: 24px; display: block;">`
        : ``;

    try {
        logger.debug(`Preparare email contact...`, {
            module: 'CONTACT_FORM',
            requestId: reqId,
            details: { recipient: contactRecipient }
        });

        const mailToPrimarie = {
            from: fromAddress,
            to: contactRecipient,
            replyTo: email,
            subject: 'Mesaj nou de pe site-ul Primăriei Almăj',
            attachments,
            text:
                `Nume: ${name}\n` +
                `Email: ${email}\n` +
                `Telefon: ${phone || 'Nespecificat'}\n\n` +
                `Subiect:\n${subject}\n\n` +
                `Mesaj:\n${safeMessageText}`,
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
                                        <p style="margin: 0; font-size: 14px; font-weight: 700; color: #333333; letter-spacing: 1px;">PRIMĂRIA COMUNEI ALMĂJ</p>
                                        <p style="margin: 5px 0; font-size: 12px; font-weight: 600; color: #555555; text-transform: uppercase;">Portal Digital • Formular Contact</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px; color: #333333; line-height: 1.6;">
                                        <h2 style="color: ${OFFICIAL_BLUE}; font-size: 20px; border-bottom: 2px solid ${OFFICIAL_BLUE}; padding-bottom: 10px; margin-top: 0;">Mesaj nou de pe site</h2>
                                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                            <table width="100%" cellpadding="5" cellspacing="0">
                                                <tr>
                                                    <td width="34%" style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Nume</td>
                                                    <td style="font-size: 15px; font-weight: 600; color: #111827;">${safeName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Email</td>
                                                    <td style="font-size: 14px; color: #374151;">${safeEmail}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Telefon</td>
                                                    <td style="font-size: 14px; color: #374151;">${safePhone}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Subiect</td>
                                                    <td style="font-size: 14px; color: #374151;">${safeSubject}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="padding-top: 15px;">
                                                        <p style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin: 0 0 5px 0;">Mesaj</p>
                                                        <div style="background-color: #ffffff; border: 1px solid #d1d5db; padding: 15px; border-radius: 4px; color: #4b5563; white-space: normal;">
                                                            ${safeMessageHtml}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        ${safePhoneDigits ? `
                                        <div style="text-align: center; margin-top: 30px;">
                                            <a href="tel:${safePhoneDigits}" style="display: inline-block; background-color: ${OFFICIAL_BLUE}; color: #ffffff; padding: 14px 26px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0, 56, 117, 0.2);">
                                                Contactează solicitantul
                                            </a>
                                        </div>
                                        ` : ''}
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

        await sendMailWithTimeout(mailToPrimarie, 20000);
        logger.success(`Mesaj de contact trimis`, {
            module: 'CONTACT_FORM',
            requestId: reqId,
            details: { email: email.substring(0, 3) + '***' }
        });

        const duration = Date.now() - startTime;
        logger.success(`Solicitare contact procesată`, {
            module: 'CONTACT_FORM',
            requestId: reqId,
            duration,
            details: { name, subject }
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        logger.error(`Eroare trimitere email contact`, error, {
            module: 'CONTACT_FORM',
            requestId: reqId,
            details: { name, email }
        });

        const rawError = (error as Error)?.message || String(error);
        const isAuth = isSmtpAuthError(rawError);
        const isConfig = rawError.includes('SMTP_NOT_CONFIGURED') || isAuth;
        const isTimeout = rawError.includes('SMTP_TIMEOUT');
        const status = isConfig ? 503 : 502;
        const publicError = isConfig
            ? 'Serviciul de email nu este configurat corect.'
            : isTimeout
                ? 'Serverul de email nu răspunde momentan. Încercați din nou.'
                : 'Nu am putut trimite emailul momentan.';

        return res.status(status).json({ error: publicError });
    }
});

// ============================================================================
// RUTA: POST /api/oportunitati/contact - OPORTUNITĂȚI DE DEZVOLTARE
// ============================================================================

app.post('/api/oportunitati/contact', async (req: Request, res: Response): Promise<any> => {
    const startTime = Date.now();
    const reqId = (req as any).id;

    logger.info(`Preluare solicitare oportunități...`, { module: 'OPORTUNITATI', requestId: reqId });

    const body = (req.body || {}) as Record<string, unknown>;
    const nameRaw = toStringValue(body.name);
    const companyRaw = toStringValue(body.company);
    const emailRaw = toStringValue(body.email);
    const phoneRaw = toStringValue(body.phone);
    const messageRaw = toStringValue(body.message);
    const topicRaw = toStringValue(body.topic);

    if ([nameRaw, companyRaw, emailRaw, topicRaw].some(hasHeaderInjection)) {
        logger.warn(`Validare eșuată - header injection detectat`, {
            module: 'OPORTUNITATI',
            requestId: reqId
        });
        return res.status(400).json({ error: 'Datele introduse nu sunt valide.' });
    }

    const name = normalizeSingleLine(nameRaw);
    const company = normalizeSingleLine(companyRaw).slice(0, 160);
    const email = normalizeSingleLine(emailRaw).toLowerCase();
    const phone = normalizeSingleLine(phoneRaw).slice(0, 50);
    const message = normalizeMultiline(messageRaw);
    const topic = normalizeSingleLine(topicRaw).slice(0, 80);

    if (!name || !email || !message) {
        logger.warn(`Validare eșuată - câmpuri obligatorii lipsă`, {
            module: 'OPORTUNITATI',
            requestId: reqId,
            details: { hasName: !!name, hasEmail: !!email, hasMessage: !!message }
        });
        return res.status(400).json({ error: 'Nume, email și mesaj sunt obligatorii.' });
    }

    const hasValidLengths =
        name.length >= 2 &&
        name.length <= 80 &&
        email.length >= 5 &&
        email.length <= 120 &&
        message.length >= 10 &&
        message.length <= 2000;

    if (!hasValidLengths || !isValidEmail(email)) {
        logger.warn(`Validare eșuată - format invalid`, {
            module: 'OPORTUNITATI',
            requestId: reqId,
            details: {
                nameLength: name.length,
                emailLength: email.length,
                messageLength: message.length,
                emailFormatValid: isValidEmail(email)
            }
        });
        return res.status(400).json({ error: 'Datele introduse nu sunt valide.' });
    }

    if (!transporter) {
        logger.error(`Serviciul SMTP nu este configurat`, undefined, {
            module: 'OPORTUNITATI',
            requestId: reqId
        });
        return res.status(503).json({ error: 'Serviciul de email nu este configurat momentan.' });
    }

    const OFFICIAL_BLUE = "#003875";
    const fromAddress = `"${appEnv.email.fromName}" <${appEnv.email.fromEmail}>`;
    const contactRecipient = appEnv.email.recipients.investments;
    const stemaPath = path.join(uploadDir, 'stema.png');
    const safePhoneDigits = phone.replace(/\D/g, '');

    const attachments = [];
    const hasLogo = fs.existsSync(stemaPath);
    if (hasLogo) {
        attachments.push({
            filename: 'stema.png',
            path: stemaPath,
            cid: 'stema_logo'
        });
    }

    const safeName = escapeHtml(name);
    const safeCompany = escapeHtml(company || 'Nespecificată');
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone || 'Nespecificat');
    const safeTopic = escapeHtml(topic || 'Investiții');
    const safeMessageHtml = escapeHtml(message).replace(/\n/g, '<br>');

    const logoHtml = hasLogo
        ? `<img src="cid:stema_logo" width="90" alt="Stema" style="display: block; margin: 0 auto 15px auto;">`
        : ``;

    const adminLogoHtml = hasLogo
        ? `<img src="cid:stema_logo" width="120" alt="Stema" style="margin-bottom: 25px; display: block;">`
        : ``;

    const registrationNumber = `OD-${Math.floor(10000 + Math.random() * 90000)}`;
    const registrationDate = new Date().toLocaleDateString('ro-RO');
    const subjectForPrimarie = `[Oportunități] Mesaj nou: ${name}${company ? ` - ${company}` : ''}`;

    try {
        logger.debug(`Preparare email-uri oportunități...`, {
            module: 'OPORTUNITATI',
            requestId: reqId,
            details: { recipient: email, adminRecipient: contactRecipient }
        });

        const mailToUser = {
            from: fromAddress,
            to: email,
            subject: 'Confirmare solicitare - Oportunități de dezvoltare',
            attachments,
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
                                        <p style="font-size: 16px; margin-bottom: 20px;"><strong>Stimate/Stimată ${safeName},</strong></p>
                                        <p>Vă confirmăm înregistrarea solicitării pentru oportunități de dezvoltare.</p>
                                        <div style="background-color: #f8fafc; border-left: 4px solid ${OFFICIAL_BLUE}; padding: 15px; margin: 20px 0;">
                                            <p style="margin: 0; font-size: 14px;"><strong>Număr înregistrare:</strong> ${registrationNumber}</p>
                                            <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Data:</strong> ${registrationDate}</p>
                                            <p style="margin: 5px 0 0 0; font-size: 14px;"><strong>Subiect:</strong> ${safeTopic}</p>
                                        </div>
                                        <p>Vă vom transmite un răspuns preliminar în cel mai scurt timp.</p>
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

        const mailToPrimarie = {
            from: fromAddress,
            to: contactRecipient,
            subject: subjectForPrimarie,
            attachments,
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
                                        <p style="margin: 5px 0; font-size: 12px; font-weight: 600; color: #555555; text-transform: uppercase;">Portal Digital • Oportunități de dezvoltare</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 40px; color: #333333; line-height: 1.6;">
                                        <h2 style="color: ${OFFICIAL_BLUE}; font-size: 20px; border-bottom: 2px solid ${OFFICIAL_BLUE}; padding-bottom: 10px; margin-top: 0;">Mesaj nou de la investitor</h2>
                                        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                            <table width="100%" cellpadding="5" cellspacing="0">
                                                <tr>
                                                    <td width="36%" style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Nume</td>
                                                    <td style="font-size: 15px; font-weight: 600; color: #111827;">${safeName}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Companie</td>
                                                    <td style="font-size: 14px; color: #374151;">${safeCompany}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Email</td>
                                                    <td style="font-size: 14px; color: #374151;">${safeEmail}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Telefon</td>
                                                    <td style="font-size: 14px; color: #374151;">${safePhone}</td>
                                                </tr>
                                                <tr>
                                                    <td style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase;">Subiect</td>
                                                    <td style="font-size: 14px; color: #374151;">${safeTopic}</td>
                                                </tr>
                                                <tr>
                                                    <td colspan="2" style="padding-top: 15px;">
                                                        <p style="font-size: 12px; font-weight: bold; color: #6b7280; text-transform: uppercase; margin: 0 0 5px 0;">Mesaj</p>
                                                        <div style="background-color: #ffffff; border: 1px solid #d1d5db; padding: 15px; border-radius: 4px; color: #4b5563; white-space: normal;">
                                                            ${safeMessageHtml}
                                                        </div>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                        ${safePhoneDigits ? `
                                        <div style="text-align: center; margin-top: 30px;">
                                            <a href="tel:${safePhoneDigits}" style="display: inline-block; background-color: ${OFFICIAL_BLUE}; color: #ffffff; padding: 14px 26px; text-decoration: none; font-weight: bold; font-size: 15px; border-radius: 4px; box-shadow: 0 4px 6px rgba(0, 56, 117, 0.2);">
                                                &#128222; APELEAZĂ SOLICITANTUL
                                            </a>
                                        </div>
                                        ` : ''}
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

        logger.debug(`Trimitere email-uri oportunități...`, { module: 'OPORTUNITATI', requestId: reqId });
        await Promise.all([sendMailWithTimeout(mailToUser, 20000), sendMailWithTimeout(mailToPrimarie, 20000)]);
        logger.success(`Email-uri oportunități trimise`, { module: 'OPORTUNITATI', requestId: reqId, details: { to: email } });

        const duration = Date.now() - startTime;
        logger.success(`Solicitare oportunități procesată`, {
            module: 'OPORTUNITATI',
            requestId: reqId,
            duration,
            details: { name, email: email.substring(0, 3) + '***', topic: topic || 'Investiții' }
        });

        return res.status(200).json({ success: true });
    } catch (error) {
        logger.error(`Eroare trimitere email oportunități`, error, {
            module: 'OPORTUNITATI',
            requestId: reqId,
            details: { name, email }
        });

        const rawError = (error as Error)?.message || String(error);
        const isAuth = isSmtpAuthError(rawError);
        const isConfig = rawError.includes('SMTP_NOT_CONFIGURED') || isAuth;
        const isTimeout = rawError.includes('SMTP_TIMEOUT');
        const status = isConfig ? 503 : 502;
        const publicError = isConfig
            ? 'Serviciul de email nu este configurat corect.'
            : isTimeout
                ? 'Serverul de email nu răspunde momentan. Încercați din nou.'
                : 'Nu am putut trimite emailul momentan.';

        return res.status(status).json({ error: publicError });
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
            const token = jwt.sign(
                { userId: user.id, role: user.role, name: user.name },
                JWT_SECRET,
                { expiresIn: appEnv.auth.jwtExpiresIn as any }
            );
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
    logger.info(`Environment`, { module: 'BOOT', details: { env: appEnv.nodeEnv } });
    
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
    }).catch((err: unknown) => {
        logger.error(`Database connection failed`, err, { module: 'DATABASE' });
    });
    
    logger.divider();
    console.log('\n📍 API Endpoints:');
    console.log('   GET  /api/announcements');
    console.log('   POST /api/announcements');
    console.log('   GET  /api/council-activity');
    console.log('   GET  /api/council-activity/years');
    console.log('   GET  /api/council-activity/manage');
    console.log('   POST /api/council-activity');
    console.log('   PATCH /api/council-activity/:id');
    console.log('   DELETE /api/council-activity/:id');
    console.log('   POST /api/contact');
    console.log('   POST /api/contact-primar');
    console.log('   POST /api/oportunitati/contact');
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
