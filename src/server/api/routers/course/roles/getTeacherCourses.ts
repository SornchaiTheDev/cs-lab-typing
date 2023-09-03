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
      AND: [
        {
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
        },
        {
          OR: [
            {
              authors: {
                some: {
                  student_id,
                },
              },
            },
            {
              sections: {
                some: {
                  deleted_at: null,
                  instructors: {
                    some: {
                      student_id,
                      deleted_at: null,
                    },
                  },
                },
              },
            },
          ],
        },
      ],
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
