import { z } from "zod";

export const AddTaskSchema = z
  .object({
    name: z.string().nonempty({ message: "Name cannot be empty" }),
    type: z.string().nonempty({ message: "Type cannot be empty" }).default(""),
    language: z.string().default(""),
    owner: z
      .string()
      .nonempty({ message: "Owner cannot be empty" })
      .default(""),
    isPrivate: z.boolean(),
    note: z.string().optional(),
    tags: z.array(z.string()).optional(),
  })
  .refine((arg) => arg.type === "Typing" || arg.language.length > 0, {
    path: ["language"],
    message: "Language cannot be empty for non-typing tasks",
  });

export type TAddTask = z.infer<typeof AddTaskSchema>;
