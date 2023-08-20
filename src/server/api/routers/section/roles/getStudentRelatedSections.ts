import type { PrismaClient } from "@prisma/client";

export const getStudentRelatedSections = async (
  prisma: PrismaClient,
  courseId: number,
  limit: number,
  student_id: string,
  cursor: number | null | undefined
) => {
  return await prisma.sections.findMany({
    where: {
      deleted_at: null,
      course_id: courseId,
      students: {
        some: {
          student_id,
        },
      },
      active: true,
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
