import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import rateLimit from 'express-rate-limit';
import { authenticateToken, authorizeRole } from '../middleware/auth';
import { getAnnouncements, createAnnouncement, deleteAnnouncement } from '../controllers/announcementController';

const router = Router();
const uploadDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const allowedUploadMap = new Map<string, string[]>([
  ['.pdf', ['application/pdf']],
  ['.png', ['image/png']],
  ['.jpg', ['image/jpeg']],
  ['.jpeg', ['image/jpeg']],
  ['.webp', ['image/webp']],
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname).toLowerCase()}`);
  },
});

const fileFilter: multer.Options['fileFilter'] = (_req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedMimes = allowedUploadMap.get(extension);

  if (!allowedMimes || !allowedMimes.includes(file.mimetype)) {
    return cb(new Error('Unsupported file type.'));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

const announcementsWriteLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many publish attempts. Try again later.' },
});

router.get('/', getAnnouncements);

router.post(
  '/',
  authenticateToken,
  authorizeRole(['ADMIN', 'EDITOR']),
  announcementsWriteLimiter,
  upload.single('file'),
  createAnnouncement
);

router.delete(
  '/:id',
  authenticateToken,
  authorizeRole(['ADMIN']),
  announcementsWriteLimiter,
  deleteAnnouncement
);

export default router;
