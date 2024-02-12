import { z } from "zod";
import { SearchValue } from "./common";

export const AddTaskSchema = z
  .object({
    name: z.string().min(1, { message: "Name cannot be empty" }),
    type: z.literal("Lesson").or(z.literal("Problem")).or(z.literal("Typing")),
    language: z.array(SearchValue).length(1),
    owner: z.array(SearchValue).length(1),
    isPrivate: z.boolean(),
    note: z.string().optional(),
    tags: z.array(SearchValue).optional(),
  })
  .refine(
    (arg) =>
      arg.type === "Typing" ||
      (arg.language != null && arg.language.length > 0),
    {
      path: ["language"],
      message: "Language cannot be empty for non-typing tasks",
    }
  );

export type TAddTask = z.infer<typeof AddTaskSchema>;
