import type { PrismaClient } from "@prisma/client";

export const getTeacherRelatedSections = async (
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
      OR: [
        {
          instructors: {
            some: {
              student_id,
            },
          },
        },
        {
          created_by: {
            student_id,
          },
        },
      ],
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
