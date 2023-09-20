import type { Prisma } from "@prisma/client";

export type taskWithStatus = Prisma.tasksGetPayload<{
  select: {
    id: true;
    name: true;
  };
}> & { status: "PASSED" | "FAILED" | "NOT_SUBMITTED" };
