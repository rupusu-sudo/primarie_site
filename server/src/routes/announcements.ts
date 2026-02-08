import { Router } from 'express';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getAnnouncements);

router.post('/', 
  authenticateToken, 
  authorizeRole(['ADMIN', 'EDITOR'] as string[]), 
  upload.single('document'), 
  createAnnouncement
);

router.delete('/:id', 
  authenticateToken, 
  authorizeRole(['ADMIN'] as string[]), 
  deleteAnnouncement
);

export default router;
