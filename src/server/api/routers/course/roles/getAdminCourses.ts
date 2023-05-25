import type { PrismaClient } from "@prisma/client";

export const getAdminCourses = async (
  prisma: PrismaClient,
  page: number,
  limit: number
) => {
  return await prisma.courses.findMany({
    where: {
      deleted_at: null,
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
