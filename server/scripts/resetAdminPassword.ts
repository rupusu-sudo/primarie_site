import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const ADMIN_EMAIL = 'adminalmaj@primarie.ro';
const ADMIN_PASSWORD = 'admin_primarie';

async function main() {
  console.log('--- Reset parolă Admin ---\n');

  const isBcryptHash = (s: string) => typeof s === 'string' && (s.startsWith('$2a$') || s.startsWith('$2b$') || s.startsWith('$2y$'));

  let user = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL }
  });

  if (!user) {
    user = await prisma.user.findUnique({
      where: { email: 'admin@primarie.ro' }
    });
    if (user) {
      console.log(`[INFO] Găsit utilizator admin@primarie.ro → îl actualizăm.`);
    }
  }

  if (!user) {
    console.log('[INFO] Nu există admin – creăm cont nou...');
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
    user = await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'ADMIN',
        name: 'Administrator'
      }
    });
    console.log('[SUCCESS] Cont admin creat.\n');
    console.log('-----------------------------------------------');
    console.log(`  Email:   ${ADMIN_EMAIL}`);
    console.log(`  Parolă:  ${ADMIN_PASSWORD}`);
    console.log('-----------------------------------------------\n');
    return;
  }

  const storedIsHash = isBcryptHash(user.password);
  console.log(`[INFO] Parola stocată în DB: ${storedIsHash ? 'hash bcrypt valid' : 'NU e hash bcrypt (plain text sau invalid)'}`);

  const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword, role: 'ADMIN', name: 'Administrator' }
  });

  const verify = await bcrypt.compare(ADMIN_PASSWORD, hashedPassword);
  if (!verify) {
    console.error('[CRITICAL] Verificare bcrypt eșuată!');
    process.exit(1);
  }

  console.log('\n-----------------------------------------------');
  console.log('[SUCCESS] Parolă admin resetată cu succes!');
  console.log(`  Email:   ${ADMIN_EMAIL}`);
  console.log(`  Parolă:  ${ADMIN_PASSWORD}`);
  console.log('-----------------------------------------------\n');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
