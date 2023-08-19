import { z } from "zod";
import { SearchValue } from "./common";

export const KUStudentSchema = z.object({
  student_id: z
    .string()
    .length(10)
    .refine((val) => parseInt(val)),
  email: z.string().email(),
  full_name: z.string().min(1),
  roles: z.array(SearchValue),
});

export type TKUStudentSchema = z.infer<typeof KUStudentSchema>;
