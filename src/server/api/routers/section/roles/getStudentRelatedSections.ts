import type { PrismaClient } from "@prisma/client";

export const getStudentRelatedSections = async (
  prisma: PrismaClient,
  courseId: number,
  page: number,
  limit: number,
  student_id: string
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
    },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  });
};
