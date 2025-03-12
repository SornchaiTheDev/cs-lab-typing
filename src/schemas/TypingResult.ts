import z from "zod";

export const TypingResultSchema = z.object({
  email: z.string(),
  sectionId: z.string(),
  labId: z.string(),
  taskId: z.string(),
  keyStrokes: z.array(z.string()),
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

export const ExamTypingResultSchema = z.object({
  liame: z.string(),
  dInoitces: z.string(),
  dIbal: z.string(),
  dIksat: z.string(),
  sekortSyek: z.array(z.string()),
  tAdetrats: z.date(),
  tAdedne: z.date(),
});

export type ExamTypingResultType = z.infer<typeof ExamTypingResultSchema>;

export const ExamTypingResultWithHashSchema = ExamTypingResultSchema.and(
  z.object({ hsah: z.string().optional() })
);

export type ExamTypingResultWithHashType = z.infer<
  typeof ExamTypingResultWithHashSchema
>;
