import { z } from "zod";
import { SearchValue } from "./common";

export const AddCourseSchema = z.object({
  number: z
    .string()
    .nonempty({ message: "Number cannot be empty" })
    .default(""),
  name: z.string().nonempty({ message: "Name cannot be empty" }).default(""),
  authors: z
    .array(SearchValue)
    .nonempty({ message: "Authors cannot be empty" }),
  note: z.string().nullable(),
  comments: z.string().nullable(),
});

export type TAddCourse = z.infer<typeof AddCourseSchema>;
