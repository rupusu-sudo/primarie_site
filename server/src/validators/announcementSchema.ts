import { z } from 'zod';

export const announcementSchema = z.object({
  title: z.string().min(5, 'Titlul trebuie să aibă cel puțin 5 caractere'),
  content: z.string().min(10, 'Conținutul trebuie să aibă cel puțin 10 caractere'),
  category: z.enum(['General', 'Urgent', 'Informativ', 'Cultura'], {
    errorMap: () => ({ message: 'Categoria nu este validă' })
  }).default('General'),
  fileUrl: z.string().optional().nullable(),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

export const validateAnnouncement = (data: unknown) => {
  return announcementSchema.parse(data);
};