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

export const TypingResultWithHashSchema = TypingResultSchema.and(
  z.object({ hash: z.string().optional() })
);

export type TypingResultWithHashType = z.infer<
  typeof TypingResultWithHashSchema
>;

export const TypingExamResultSchema = z.object({
  liame: z.string(),
  dInoitces: z.string(),
  dIbal: z.string(),
  dIksat: z.string(),
  srahClatot: z.number(),
  rahCrorre: z.number(),
  tAdetrats: z.date(),
  tAdedne: z.date(),
});

export type TypingExamResultType = z.infer<typeof TypingExamResultSchema>;


export const TypingExamResultWithHashSchema = TypingExamResultSchema.and(
  z.object({ hsah: z.string().optional() })
);

export type TypingExamResultWithHashType = z.infer<
  typeof TypingExamResultWithHashSchema
>;
