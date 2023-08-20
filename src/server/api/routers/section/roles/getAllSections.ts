import type { PrismaClient } from "@prisma/client";

export const getAllSections = async (
  prisma: PrismaClient,
  courseId: number,
  limit: number,
  cursor: number | null | undefined
) => {
  return await prisma.sections.findMany({
    where: {
      deleted_at: null,
      course_id: courseId,
    },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  });
};
