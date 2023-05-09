import { z } from "zod";

export const TeacherSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  roles: z.array(z.string()),
});

export type TTeacherSchema = z.infer<typeof TeacherSchema>;
