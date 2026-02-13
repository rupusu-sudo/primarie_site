import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const hasYesFlag = process.argv.includes('--yes');
if (!hasYesFlag) {
  console.error('Refuz executia fara confirmare explicita. Ruleaza cu: --yes');
  process.exit(1);
}

const targetUrl = (process.env.TARGET_DATABASE_URL || process.env.DATABASE_URL || '').trim();
const sourceEnv = process.env.TARGET_DATABASE_URL ? 'TARGET_DATABASE_URL' : 'DATABASE_URL';

if (!targetUrl) {
  console.error('Lipseste URL-ul bazei de date. Seteaza TARGET_DATABASE_URL sau DATABASE_URL.');
  process.exit(1);
}

const prisma = new PrismaClient({
  datasources: {
    db: { url: targetUrl },
  },
});

const maskUrl = (url: string) => {
  try {
    const parsed = new URL(url);
    const user = parsed.username ? `${parsed.username}:***@` : '';
    return `${parsed.protocol}//${user}${parsed.host}${parsed.pathname}${parsed.search}`;
  } catch {
    return 'invalid-url-format';
  }
};

async function main() {
  console.log('--- WIPE DATABASE ---');
  console.log(`Source env: ${sourceEnv}`);
  console.log(`Target DB:  ${maskUrl(targetUrl)}`);

  const countsBefore = await Promise.all([
    prisma.documentLike.count(),
    prisma.document.count(),
    prisma.announcement.count(),
    prisma.auditLog.count(),
    prisma.user.count(),
  ]);

  console.log(
    `Before -> likes:${countsBefore[0]} documents:${countsBefore[1]} announcements:${countsBefore[2]} auditLogs:${countsBefore[3]} users:${countsBefore[4]}`
  );

  await prisma.$transaction([
    prisma.documentLike.deleteMany(),
    prisma.document.deleteMany(),
    prisma.announcement.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const countsAfter = await Promise.all([
    prisma.documentLike.count(),
    prisma.document.count(),
    prisma.announcement.count(),
    prisma.auditLog.count(),
    prisma.user.count(),
  ]);

  console.log(
    `After  -> likes:${countsAfter[0]} documents:${countsAfter[1]} announcements:${countsAfter[2]} auditLogs:${countsAfter[3]} users:${countsAfter[4]}`
  );
  console.log('WIPE DONE');
}

main()
  .catch((error) => {
    console.error('WIPE FAILED:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

