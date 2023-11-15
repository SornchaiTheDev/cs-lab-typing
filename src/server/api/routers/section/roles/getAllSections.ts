import type { PrismaClient, SectionType } from "@prisma/client";

interface Params {
  prisma: PrismaClient;
  courseId: number;
  limit: number;
  cursor: number | null | undefined;
  semester: string;
  search?: string;
  status?: string;
}
export const getAllSections = async (params: Params) => {
  const { prisma, courseId, limit, cursor, semester, search, status } = params;
  const active =
    status === "All" ? undefined : status === "Active" ? true : false;
  const term = semester.split(" ")[0];
  const year = semester.split(" ")[1];
  let sectionType: SectionType[] = ["Lesson", "Exam"];
  if (search !== undefined) {
    const _search = search.toLowerCase();
    const type = _search.charAt(0).toUpperCase() + _search.slice(1);
    if (["Lesson", "Exam"].includes(type)) {
      sectionType = [type as SectionType];
    } else {
      sectionType = [];
    }
  }
  return await prisma.sections.findMany({
    where: {
      deleted_at: null,
      course_id: courseId,
      active,
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          type: {
            in: sectionType,
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
