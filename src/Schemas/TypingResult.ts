import z from "zod";

export const TypingResultSchema = z.object({
  email: z.string(),
  sectionId: z.string(),
  labId: z.string(),
  taskId: z.string(),
  totalChars: z.number(),
  errorChar: z.number(),
  startedAt: z.date(),
  endedAt: z.date(),
});

export type TypingResultType = z.infer<typeof TypingResultSchema>;

const TypingResultWithHashSchema = TypingResultSchema.and(
  z.object({ hash: z.string().optional() })
);

export type TypingResultWithHashType = z.infer<
  typeof TypingResultWithHashSchema
>;
