import { z } from "zod";

export const AddSectionSchema = z.object({
  name: z.string().nonempty({ message: "Name cannot be empty" }),
  note: z.string().optional(),
});

export type TAddSection = z.infer<typeof AddSectionSchema>;
