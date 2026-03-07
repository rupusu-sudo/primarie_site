import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

type NodeEnv = 'development' | 'test' | 'production';

const ENV_FILE_CANDIDATES = [
  path.resolve(process.cwd(), '.env'),
  path.resolve(process.cwd(), 'server/.env'),
  path.resolve(__dirname, '../../.env'),
  path.resolve(__dirname, '../../../.env'),
];

let loadedEnvFile: string | null = null;
for (const envFile of ENV_FILE_CANDIDATES) {
  if (fs.existsSync(envFile)) {
    dotenv.config({ path: envFile });
    loadedEnvFile = envFile;
    break;
  }
}

const readRaw = (...keys: string[]) => {
  for (const key of keys) {
    const value = process.env[key];
    if (typeof value === 'string' && value.trim()) {
      return value.trim();
    }
  }
  return '';
};

const readBoolean = (key: string, fallback: boolean) => {
  const value = readRaw(key).toLowerCase();
  if (!value) return fallback;
  if (['true', '1', 'yes', 'on', 'da'].includes(value)) return true;
  if (['false', '0', 'no', 'off', 'nu'].includes(value)) return false;
  return fallback;
};

const readNumber = (key: string, fallback: number) => {
  const value = readRaw(key);
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const splitCsv = (value: string) =>
  value
    .split(',')
    .map((entry) => entry.trim().replace(/\/+$/, ''))
    .filter(Boolean);

const deriveDatabaseUrl = () => {
  const directUrl = readRaw('DATABASE_URL', 'MYSQL_PUBLIC_URL', 'MYSQL_URL');
  if (directUrl) return directUrl;

  const host = readRaw('MYSQLHOST');
  const port = readRaw('MYSQLPORT');
  const user = readRaw('MYSQLUSER');
  const password = readRaw('MYSQLPASSWORD', 'MYSQL_ROOT_PASSWORD');
  const database = readRaw('MYSQLDATABASE', 'MYSQL_DATABASE');

  if (host && port && user && password && database) {
    return `mysql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  }

  return '';
};

const nodeEnv = (readRaw('NODE_ENV') || 'development') as NodeEnv;
const isProduction = nodeEnv === 'production';
const databaseUrl = deriveDatabaseUrl();
const port = readNumber('PORT', 3001);
const clientUrl = readRaw('CLIENT_URL') || (isProduction ? '' : 'http://localhost:5173');
const corsAllowedOrigins = splitCsv(readRaw('CORS_ALLOWED_ORIGINS') || clientUrl || 'http://localhost:5173');
const corsAllowNoOrigin = readBoolean('CORS_ALLOW_NO_ORIGIN', !isProduction);
const corsTestApiKey = readRaw('CORS_TEST_API_KEY');

const jwtSecret = readRaw('JWT_SECRET', 'AUTH_SECRET', 'JWT_KEY');
const jwtExpiresIn = readRaw('JWT_EXPIRES_IN') || '24h';

const uploadDir = path.resolve(process.cwd(), readRaw('UPLOAD_DIR') || 'uploads');
const maxFileSizeBytes = readNumber('MAX_FILE_SIZE', 10 * 1024 * 1024);

const smtpService = readRaw('SMTP_SERVICE');
const smtpHost = readRaw('SMTP_HOST');
const smtpPort = readNumber('SMTP_PORT', 465);
const smtpSecure = readBoolean('SMTP_SECURE', smtpPort === 465);
const smtpUser = readRaw('SMTP_USER');
const smtpPass = readRaw('SMTP_PASS');
const smtpFromEmail = readRaw('SMTP_FROM_EMAIL', 'CONTACT_FROM_EMAIL') || smtpUser;
const smtpFromName = readRaw('SMTP_FROM_NAME') || 'Primăria Comunei Almăj';
const smtpPassLooksPlaceholder =
  /replace-with-real|changeme|your_password|example_password|password_here|replace-with-app-password/i.test(smtpPass);
const emailEnabled = Boolean((smtpService || smtpHost) && smtpUser && smtpPass && !smtpPassLooksPlaceholder);

const contactRecipientEmail =
  readRaw('CONTACT_RECIPIENT_EMAIL', 'CONTACT_EMAIL') || smtpFromEmail;
const primarRecipientEmail =
  readRaw('PRIMAR_RECIPIENT_EMAIL', 'PRIMAR_EMAIL') || contactRecipientEmail;
const investmentRecipientEmail =
  readRaw('INVESTMENT_RECIPIENT_EMAIL') || contactRecipientEmail;

const adminEmail = readRaw('ADMIN_EMAIL');
const adminPassword = readRaw('ADMIN_PASSWORD');
const adminName = readRaw('ADMIN_NAME') || 'Administrator';

const errors: string[] = [];
const warnings: string[] = [];

if (!databaseUrl) {
  errors.push(
    'Lipsește DATABASE_URL. Setați DATABASE_URL, MYSQL_PUBLIC_URL, MYSQL_URL sau setul MYSQLHOST/MYSQLPORT/MYSQLUSER/MYSQLPASSWORD/MYSQLDATABASE.',
  );
}

if (!jwtSecret || jwtSecret.length < 32) {
  errors.push('Lipsește JWT_SECRET sau este prea scurt. Folosiți o valoare de minimum 32 de caractere.');
}

if ((smtpService || smtpHost || smtpUser || smtpPass) && !emailEnabled) {
  warnings.push('Configurația SMTP este incompletă sau conține placeholdere. Funcțiile de email vor fi dezactivate.');
}

if (!contactRecipientEmail) {
  warnings.push('CONTACT_RECIPIENT_EMAIL nu este setat. Formularele publice de contact nu vor avea destinatar explicit.');
}

if ((adminEmail && !adminPassword) || (!adminEmail && adminPassword)) {
  warnings.push('ADMIN_EMAIL și ADMIN_PASSWORD trebuie setate împreună pentru scripturile de bootstrap admin.');
}

if (errors.length > 0) {
  throw new Error(['Configurare mediu invalidă:', ...errors].join('\n- '));
}

process.env.DATABASE_URL = databaseUrl;

export const appEnv = {
  nodeEnv,
  isProduction,
  port,
  loadedEnvFile,
  clientUrl,
  database: {
    url: databaseUrl,
  },
  auth: {
    jwtSecret,
    jwtExpiresIn,
    adminEmail,
    adminPassword,
    adminName,
  },
  cors: {
    allowedOrigins: corsAllowedOrigins,
    allowNoOrigin: corsAllowNoOrigin,
    testApiKey: corsTestApiKey,
  },
  uploads: {
    dir: uploadDir,
    maxFileSizeBytes,
  },
  email: {
    enabled: emailEnabled,
    service: smtpService,
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    user: smtpUser,
    pass: smtpPass,
    fromEmail: smtpFromEmail,
    fromName: smtpFromName,
    recipients: {
      contact: contactRecipientEmail,
      primar: primarRecipientEmail,
      investments: investmentRecipientEmail,
    },
  },
  warnings,
} as const;

export type AppEnv = typeof appEnv;
