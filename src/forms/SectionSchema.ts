import { z } from "zod";

export const AddSectionSchema = z.object({
  semester: z.string().nonempty({ message: "Semester cannot be empty" }),
  name: z.string().nonempty({ message: "Name cannot be empty" }),
  instructors: z
    .array(z.string())
    .nonempty({ message: "Instructors cannot be empty" }),
  note: z.string().optional(),
});

export type TAddSection = z.infer<typeof AddSectionSchema>;
