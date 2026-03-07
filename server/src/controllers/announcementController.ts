import { Request, Response } from 'express';
import { announcementSchema } from '../validators/announcementSchema';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const prisma = new PrismaClient();

const hasSignature = (buffer: Buffer, signature: number[]) =>
  signature.every((value, index) => buffer[index] === value);

const validateUploadedFileSignature = (filePath: string, mimeType: string): boolean => {
  const fileBuffer = fs.readFileSync(filePath);
  const bytes = fileBuffer.subarray(0, 16);

  if (mimeType === 'application/pdf') {
    return hasSignature(bytes, [0x25, 0x50, 0x44, 0x46]);
  }
  if (mimeType === 'image/png') {
    return hasSignature(bytes, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  }
  if (mimeType === 'image/jpeg') {
    return hasSignature(bytes, [0xff, 0xd8, 0xff]);
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
  } catch {
    // cleanup best-effort only
  }
};

export const createAnnouncement = async (req: Request, res: Response) => {
  const uploadedFile = (req as any).file as Express.Multer.File | undefined;

  try {
    const currentUserId = Number((req as any).user?.userId ?? (req as any).user?.id);
    if (!Number.isInteger(currentUserId) || currentUserId <= 0) {
      safeDeleteFile(uploadedFile?.path);
      res.status(401).json({
        success: false,
        message: 'Autentificare invalida'
      });
      return;
    }

    if (uploadedFile && !validateUploadedFileSignature(uploadedFile.path, uploadedFile.mimetype)) {
      safeDeleteFile(uploadedFile.path);
      res.status(400).json({
        success: false,
        message: 'Fisier invalid'
      });
      return;
    }

    // Validate request body
    const validatedData = announcementSchema.parse(req.body);
    const fileUrl = uploadedFile ? `/uploads/${uploadedFile.filename}` : (validatedData.fileUrl || null);

    // Create announcement in database
    const announcement = await prisma.announcement.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        category: validatedData.category,
        fileUrl,
        authorId: currentUserId,
      },
      include: {
        author: true
      }
    });

    res.status(201).json(announcement);
  } catch (error) {
    safeDeleteFile(uploadedFile?.path);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: error.errors
      });
    } else {
      console.error('Error creating announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Eroare la crearea anunțului'
      });
    }
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;

    const where: any = {
      isPublished: true
    };
    
    if (category) {
      where.category = Array.isArray(category) ? category[0] : category;
    }

    const announcements = await prisma.announcement.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.status(200).json(announcements);
  } catch (error) {
    console.error('Error fetching announcements:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la obținerea anunțurilor'
    });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const announcementId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
    const announcement = await prisma.announcement.findUnique({
      where: { id: announcementId },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!announcement) {
      res.status(404).json({
        success: false,
        message: 'Anunțul nu a fost găsit'
      });
      return;
    }

    res.status(200).json(announcement);
  } catch (error) {
    console.error('Error fetching announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la obținerea anunțului'
    });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const announcementId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
    const validatedData = announcementSchema.partial().parse(req.body);

    const announcement = await prisma.announcement.update({
      where: { id: announcementId },
      data: validatedData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json(announcement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: error.errors
      });
    } else {
      console.error('Error updating announcement:', error);
      res.status(500).json({
        success: false,
        message: 'Eroare la actualizarea anunțului'
      });
    }
  }
};

export const deleteAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const announcementId = Array.isArray(id) ? parseInt(id[0]) : parseInt(id as string);
    
    await prisma.announcement.delete({
      where: { id: announcementId }
    });

    res.status(200).json({
      success: true,
      message: 'Anunț șters cu succes'
    });
  } catch (error) {
    console.error('Error deleting announcement:', error);
    res.status(500).json({
      success: false,
      message: 'Eroare la ștergerea anunțului'
    });
  }
};
