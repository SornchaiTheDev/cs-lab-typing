import { z } from "zod";

export const AddLabSchema = z.object({
  name: z.string().nonempty({ message: "Name cannot be empty" }),
  tags: z.array(z.string()).nullable(),
  isDisabled: z.boolean().nullable(),
});

export type TAddLabSchema = z.infer<typeof AddLabSchema>;
