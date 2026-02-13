import { Request } from 'express';
import cors, { CorsOptions, CorsOptionsDelegate } from 'cors';

const normalizeOrigin = (origin = '') => origin.trim().replace(/\/+$/, '');

const DEFAULT_ALLOWED_ORIGINS = [
    'https://primarie-site-ceva.vercel.app',
    'http://localhost:5173'
];

export const allowedOrigins = (
    process.env.CORS_ALLOWED_ORIGINS || DEFAULT_ALLOWED_ORIGINS.join(',')
)
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

const allowedOriginSet = new Set(allowedOrigins);
const corsTestApiKey = (process.env.CORS_TEST_API_KEY || '').trim();

const baseOptions: CorsOptions = {
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Test-Api-Key'],
    optionsSuccessStatus: 204,
    maxAge: 86400
};

const corsOptionsDelegate: CorsOptionsDelegate<Request> = (req, callback) => {
    const originHeader = req.header('Origin');
    const origin = originHeader ? normalizeOrigin(originHeader) : '';
    const testApiKey = req.header('x-test-api-key') || '';
    const isHealthRoute = req.path === '/health';

    if (origin) {
        if (allowedOriginSet.has(origin)) {
            return callback(null, { ...baseOptions, origin: true });
        }

        console.warn(`[CORS] blocked origin=${origin} method=${req.method} path=${req.path}`);
        return callback(new Error('CORS_ORIGIN_NOT_ALLOWED'));
    }

    if (isHealthRoute) {
        return callback(null, { ...baseOptions, origin: false });
    }

    if (corsTestApiKey && testApiKey === corsTestApiKey) {
        return callback(null, { ...baseOptions, origin: false });
    }

    console.warn(`[CORS] missing Origin method=${req.method} path=${req.path}`);
    return callback(new Error('CORS_ORIGIN_MISSING'));
};

export const corsMiddleware = cors(corsOptionsDelegate);
export const corsPreflight = cors(corsOptionsDelegate);
