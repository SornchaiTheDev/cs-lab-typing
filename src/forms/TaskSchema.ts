import { z } from "zod";

export const AddTaskSchema = z
  .object({
    name: z.string().nonempty({ message: "Name cannot be empty" }),
    type: z.literal("Lesson").or(z.literal("Problem")).or(z.literal("Typing")),
    language: z.string().or(z.null()).default(null),
    owner: z
      .string()
      .nonempty({ message: "Owner cannot be empty" })
      .default(""),
    isPrivate: z.boolean(),
    note: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine((arg) => arg.type === "Typing" || (arg.language != null && arg.language.length > 0), {
    path: ["language"],
    message: "Language cannot be empty for non-typing tasks",
  });

export type TAddTask = z.infer<typeof AddTaskSchema>;
