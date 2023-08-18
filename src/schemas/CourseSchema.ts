import { z } from "zod";

export const AddCourseSchema = z.object({
  number: z
    .string()
    .nonempty({ message: "Number cannot be empty" })
    .default(""),
  name: z.string().nonempty({ message: "Name cannot be empty" }).default(""),
  authors: z
    .array(z.object({ label: z.string(), value: z.number().or(z.string()) }))
    .nonempty({ message: "Authors cannot be empty" }),
  note: z.string().nullable(),
  comments: z.string().nullable(),
});

export type TAddCourse = z.infer<typeof AddCourseSchema>;
