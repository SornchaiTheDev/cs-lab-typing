import { z } from "zod";
import { SearchValue } from "./common";

const DefaultTaskSchema = z.object({
  name: z.string(),
  owner: z.array(SearchValue).length(1),
  isPrivate: z.boolean(),
  note: z.string().optional(),
  tags: z.array(SearchValue).optional(),
});

const TypingTaskSchema = DefaultTaskSchema.extend({
  type: z.literal("Typing"),
});

export const AddTaskSchema = TypingTaskSchema;

export type TAddTask = z.infer<typeof AddTaskSchema>;
