import { z } from "zod";

export const AddCourseSchema = z.object({
  number: z.string(),
  name: z.string(),
  authors: z.array(z.string()),
  note: z.string(),
  comments: z.string(),
});

export type TAddCourse = z.infer<typeof AddCourseSchema>;
