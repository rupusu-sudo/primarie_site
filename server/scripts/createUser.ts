import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function createUser() {
    try {
        const existingUser = await prisma.user.findUnique({
            where: { email: 'admin@primarie.ro' }
        });

        if (existingUser) {
            console.log('Userul există deja!');
            await prisma.$disconnect();
            return;
        }
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = await prisma.user.create({
            data: {
                email: 'admin@primarie.ro',
                password: hashedPassword,
                role: 'ADMIN',
                name: 'Administrator'
            }
        });

        console.log('User creat cu succes!');
        console.log('Email:', user.email);
        console.log('Parolă: admin123');
        console.log('Rol:', user.role);
    } catch (error) {
        console.error('Eroare la creare user:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createUser();