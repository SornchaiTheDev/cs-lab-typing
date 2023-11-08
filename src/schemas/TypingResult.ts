import z from "zod";

export const KeyStroke = z.object({
  letter: z.string(),
  status: z.number(),
});

export const TypingResultSchema = z.object({
  email: z.string(),
  sectionId: z.string(),
  labId: z.string(),
  taskId: z.string(),
  keyStrokes: z.array(KeyStroke),
  startedAt: z.date(),
  endedAt: z.date(),
});

export type TypingResultType = z.infer<typeof TypingResultSchema>;

export const TypingResultWithHashSchema = TypingResultSchema.and(
  z.object({ hash: z.string().optional() })
);

export type TypingResultWithHashType = z.infer<
  typeof TypingResultWithHashSchema
>;
