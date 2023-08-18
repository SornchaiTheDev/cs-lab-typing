import { z } from "zod";

export const AddLabSchema = z.object({
  name: z.string().nonempty({ message: "Name cannot be empty" }),
  tags: z.array(z.object({ label: z.string(), value: z.string() })),
  isDisabled: z.boolean(),
});

export type TAddLabSchema = z.infer<typeof AddLabSchema>;
