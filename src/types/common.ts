import type { Prisma, typing_histories } from "@prisma/client";

export type taskWithStatus = Prisma.tasksGetPayload<{
  select: {
    id: true;
    name: true;
  };
}> & { status: "PASSED" | "FAILED" | "NOT_SUBMITTED" };

export type TypingHistoryOmitScore = Omit<typing_histories, "submission_id" | "score" | "updated_at">;
