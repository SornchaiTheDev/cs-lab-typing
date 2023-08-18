import { z } from "zod";

export const AddTaskSchema = z
  .object({
    name: z.string().nonempty({ message: "Name cannot be empty" }),
    type: z.literal("Lesson").or(z.literal("Problem")).or(z.literal("Typing")),
    language: z.string().or(z.null()).default(null),
    owner: z.object({ label: z.string(), value: z.string() }).refine((arg) => {
      return arg.value.length > 0 && arg.label.length > 0;
    }),
    isPrivate: z.boolean(),
    note: z.string().optional(),
    tags: z
      .array(z.object({ label: z.string(), value: z.string() }))
      .optional(),
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
