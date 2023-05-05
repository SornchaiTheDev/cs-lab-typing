import { z } from "zod";

export const AddSemesterSchema = z.object({
  year: z.string(),
  term: z.string().nonempty({ message: "Term cannot be empty" }),
  startDate: z.date(),
});

export type TAddSemesterSchema = z.infer<typeof AddSemesterSchema>;
