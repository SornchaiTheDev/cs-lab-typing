import { z } from "zod";

export const AddSectionSchema = z.object({
  semester: z
    .string()
    .nonempty({ message: "Semester cannot be empty" })
    .default(""),
  name: z.string().min(1, { message: "Name cannot be empty" }),
  instructors: z
    .array(z.string())
    .min(1, { message: "Instructors cannot be empty" }),
  tas: z.array(z.string()).optional(),
  note: z.string().optional(),
  active: z.boolean().default(true),
});

export type TAddSection = z.infer<typeof AddSectionSchema>;
