import { z } from "zod";

export const AnnouncementSchema = z.object({
  title: z.string(),
  description: z.string(),
});

export type TAnnouncementSchema = z.infer<typeof AnnouncementSchema>;
