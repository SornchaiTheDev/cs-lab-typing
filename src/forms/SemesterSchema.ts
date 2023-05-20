import { z } from "zod";

export const SemesterSchema = z.object({
  year: z
    .string()
    .nonempty({ message: "Year cannot be empty" })
    .min(4)
    .max(4)
    .refine((val) => isNaN(Number(val)) === false, {
      message: "Year must be a number",
    }),
  term: z.literal("First").or(z.literal("Second")).or(z.literal("Summer")),
  startDate: z.date(),
});

export type TSemesterSchema = z.infer<typeof SemesterSchema>;
