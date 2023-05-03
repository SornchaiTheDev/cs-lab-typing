import { z } from "zod";

export const AddSectionSchema = z.object({
  name: z.string().nonempty(),
  semester: z.string().nonempty(),
  note: z.string().optional(),
});

export type TAddSection = z.infer<typeof AddSectionSchema>;
