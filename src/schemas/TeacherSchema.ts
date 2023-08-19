import { z } from "zod";
import { SearchValue } from "./common";

export const TeacherSchema = z.object({
  email: z.string().email(),
  full_name: z.string().min(1),
  roles: z.array(SearchValue),
});

export type TTeacherSchema = z.infer<typeof TeacherSchema>;
