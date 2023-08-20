import type { PrismaClient } from "@prisma/client";

export const getTeacherCourses = async (
  prisma: PrismaClient,
  page: number,
  limit: number,
  student_id: string,
  cursor: number | null | undefined
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
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
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
