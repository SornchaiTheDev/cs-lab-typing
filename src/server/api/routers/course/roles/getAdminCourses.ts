import type { PrismaClient } from "@prisma/client";

export const getAdminCourses = async (
  prisma: PrismaClient,
  limit: number,
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
