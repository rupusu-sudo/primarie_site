import { Request, Response } from 'express';
import { announcementSchema } from '../validators/announcementSchema';
import { z } from 'zod';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = announcementSchema.parse(req.body);

    // Create announcement in database
    const announcement = await prisma.announcement.create({
      data: {
        title: validatedData.title,
        content: validatedData.content,
        category: validatedData.category,
        fileUrl: validatedData.fileUrl || null,
        authorId: (req as any).user?.id || 1, // Default to user 1 if not authenticated
      },
      include: {
        author: true
      }
    });

    res.status(201).json(announcement);
  } catch (error) {
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