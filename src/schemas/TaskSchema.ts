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

const ProblemTaskSchema = DefaultTaskSchema.extend({
  type: z.literal("Problem"),
  language: z.array(SearchValue).length(1),
});

export const AddTaskSchema = TypingTaskSchema.or(ProblemTaskSchema);

export type TAddTask = z.infer<typeof AddTaskSchema>;
