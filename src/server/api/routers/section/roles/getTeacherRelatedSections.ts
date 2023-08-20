import type { PrismaClient, SectionType } from "@prisma/client";

export const getTeacherRelatedSections = async (
  prisma: PrismaClient,
  courseId: number,
  limit: number,
  student_id: string,
  cursor: number | null | undefined,
  search?: string
) => {
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
      active: true,
      AND: [
        {
          OR: [
            {
              instructors: {
                some: {
                  student_id,
                },
              },
            },
            {
              created_by: {
                student_id,
              },
            },
          ],
        },
        {
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
        },
      ],
    },
    take: limit + 1,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      _count: {
        select: {
          students: true,
        },
      },
    },
  });
};
