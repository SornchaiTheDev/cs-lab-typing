import { z } from "zod";

export const AddCourseSchema = z.object({
  number: z.string().nonempty({ message: "Number cannot be empty" }),
  name: z.string().nonempty({ message: "Name cannot be empty" }),
  note: z.string().nullable(),
  comments: z.string().nullable(),
});

export type TAddCourse = z.infer<typeof AddCourseSchema>;
