import { z } from "zod";

export const AddTaskSchema = z.object({
  name: z.string().nonempty({ message: "Name cannot be empty" }),
  type: z.string().nonempty({ message: "Term cannot be empty" }),
  language: z.string().nonempty({ message: "Language cannot be empty" }),
  owner: z.array(z.string()).nonempty({ message: "Owner cannot be empty" }),
  isPrivate: z.boolean(),
  note: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export type TAddTask = z.infer<typeof AddTaskSchema>;
