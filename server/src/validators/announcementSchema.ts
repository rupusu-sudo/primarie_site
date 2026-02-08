import { z } from 'zod';


export const announcementSchema = z.object({
  title: z.string().min(5, 'Titlul trebuie să aibă cel puțin 5 caractere'),
  content: z.string().min(20, 'Conținutul trebuie să aibă cel puțin 20 caractere'),
  category: z.enum(['official', 'event', 'news', 'urgent'], {
    errorMap: () => ({ message: 'Categoria nu este validă' })
  }),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  publishDate: z.string().datetime().optional(),
  expiryDate: z.string().datetime().optional(),
  attachments: z.array(z.string()).optional(),
});

export type AnnouncementInput = z.infer<typeof announcementSchema>;

export const validateAnnouncement = (data: unknown) => {
  return announcementSchema.parse(data);
};