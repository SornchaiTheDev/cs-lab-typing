import type { PrismaClient } from "@prisma/client";

export const getAllSections = async (
  prisma: PrismaClient,
  courseId: number,
  page: number,
  limit: number
) => {
  return await prisma.sections.findMany({
    where: {
      deleted_at: null,
      course_id: courseId,
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
