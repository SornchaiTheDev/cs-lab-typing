import type { PrismaClient, SectionType } from "@prisma/client";

interface Params {
  prisma: PrismaClient;
  courseId: number;
  limit: number;
  cursor: number | null | undefined;
  semester: string;
  search?: string;
  status?: string;
  sectionType?: SectionType;
}
export const getAllSections = async (params: Params) => {
  const {
    prisma,
    courseId,
    limit,
    cursor,
    semester,
    search,
    status,
    sectionType,
  } = params;
  const active =
    status === "All" ? undefined : status === "Active" ? true : false;
  const term = semester.split(" ")[0];
  const year = semester.split(" ")[1];
  return await prisma.sections.findMany({
    where: {
      deleted_at: null,
      course_id: courseId,
      active,
      type: sectionType,
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
      semester: {
        term,
        year,
      },
    },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      semester: true,
      _count: {
        select: {
          students: true,
        },
      },
    },
  });
};
