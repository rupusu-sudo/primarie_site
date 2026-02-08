import { Request, Response } from 'express';
import { announcementSchema } from '../validators/announcementSchema';
import { z } from 'zod';

// Mock database - replace with your actual database
let announcements: any[] = [];

export const createAnnouncement = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const validatedData = announcementSchema.parse(req.body);

    // Create announcement
    const announcement = {
      id: Date.now().toString(),
      ...validatedData,
      createdBy: req.user?.id,
      createdAt: new Date().toISOString(),
      status: 'published'
    };

    announcements.push(announcement);

    res.status(201).json({
      success: true,
      message: 'Anunț creat cu succes',
      data: announcement
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: error.errors
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Eroare la crearea anunțului'
      });
    }
  }
};

export const getAnnouncements = async (req: Request, res: Response) => {
  try {
    const { category, priority } = req.query;

    let filtered = announcements;

    if (category) {
      filtered = filtered.filter(a => a.category === category);
    }

    if (priority) {
      filtered = filtered.filter(a => a.priority === priority);
    }

    res.status(200).json({
      success: true,
      data: filtered,
      total: filtered.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Eroare la obținerea anunțurilor'
    });
  }
};

export const getAnnouncementById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const announcement = announcements.find(a => a.id === id);

    if (!announcement) {
      res.status(404).json({
        success: false,
        message: 'Anunțul nu a fost găsit'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Eroare la obținerea anunțului'
    });
  }
};

export const updateAnnouncement = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const validatedData = announcementSchema.partial().parse(req.body);

    const index = announcements.findIndex(a => a.id === id);

    if (index === -1) {
      res.status(404).json({
        success: false,
        message: 'Anunțul nu a fost găsit'
      });
      return;
    }

    announcements[index] = {
      ...announcements[index],
      ...validatedData,
      updatedAt: new Date().toISOString()
    };

    res.status(200).json({
      success: true,
      message: 'Anunț actualizat cu succes',
      data: announcements[index]
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        success: false,
        message: 'Date invalide',
        errors: error.errors
      });
    } else {
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
    const index = announcements.findIndex(a => a.id === id);

    if (index === -1) {
      res.status(404).json({
        success: false,
        message: 'Anunțul nu a fost găsit'
      });
      return;
    }

    announcements.splice(index, 1);

    res.status(200).json({
      success: true,
      message: 'Anunț șters cu succes'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Eroare la ștergerea anunțului'
    });
  }
};