import type { PrismaClient } from "@prisma/client";

export const getAdminCourses = async (
  prisma: PrismaClient,
  page: number,
  limit: number,
  cursor: number | null | undefined
) => {
  return await prisma.courses.findMany({
    where: {
      deleted_at: null,
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
