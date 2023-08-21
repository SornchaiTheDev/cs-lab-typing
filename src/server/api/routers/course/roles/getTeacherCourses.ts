import type { PrismaClient } from "@prisma/client";

export const getTeacherCourses = async (
  prisma: PrismaClient,
  limit: number,
  student_id: string,
  cursor: number | null | undefined,
  search?: string
) => {
  return await prisma.courses.findMany({
    where: {
      deleted_at: null,
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          number: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
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
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      sections: {
        where: {
          deleted_at: null,
        },
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
