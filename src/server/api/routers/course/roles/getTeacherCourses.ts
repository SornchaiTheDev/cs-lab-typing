import type { PrismaClient } from "@prisma/client";

export const getTeacherCourses = async (
  prisma: PrismaClient,
  page: number,
  limit: number,
  student_id: string
) => {
  return await prisma.courses.findMany({
    where: {
      deleted_at: null,
      AND: {
        sections: {
          some: {
            instructors: {
              some: {
                student_id,
                deleted_at: null,
              },
            },
          },
        },
      },
    },
    skip: (page - 1) * limit,
    take: limit,
    include: {
      sections: {
        select: {
          _count: {
            select: {
              students: true,
            },
          },
        },
      },
    },
  });
};
