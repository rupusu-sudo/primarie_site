import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function resetAdmin() {
    try {
        console.log('🔐 Creez admin cu parolă criptată...\n');

        // Șterge toți userii existenți (opțional, comentează dacă vrei să păstrezi alți useri)
        await prisma.user.deleteMany({
            where: { email: 'admin@primarie.ro' }
        });
        
        console.log('🗑️  Useri vechi șterse...');

        // Generează hash pentru parolă cu salt rounds = 10 (foarte sigur)
        const hashedPassword = await bcrypt.hash('admin123', 10);
        
        console.log(`🔒 Hash generat: ${hashedPassword.substring(0, 20)}...`);

        // Creează userul nou cu parolă criptată
        const user = await prisma.user.create({
            data: {
                email: 'admin@primarie.ro',
                password: hashedPassword,  // Parolă CRIPTATĂ
                role: 'ADMIN',
                name: 'Administrator'
            }
        });

        console.log('\n Admin creat cu PAROLĂ CRIPTATĂ!');
        console.log('════════════════════════════════════');
        console.log(' Email: admin@primarie.ro');
        console.log(' Parolă: admin123 (text clar - doar pentru login)');
        console.log(`Hash în DB: ${user.password.substring(0, 30)}...`);
        console.log('Rol: ADMIN');
        console.log('════════════════════════════════════\n');

        // Verifică că parola funcționează
        const isValid = await bcrypt.compare('admin123', user.password);
        console.log(` Verificare parolă: ${isValid ? ' CORECTĂ' : ' INCORECTĂ'}\n`);
        
    } catch (error) {
        console.error('Eroare:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();