import type { PrismaClient, SectionType } from "@prisma/client";

interface Params {
  prisma: PrismaClient;
  courseId: number;
  limit: number;
  student_id: string;
  cursor: number | null | undefined;
  search?: string;
  semester: string;
  status?: string;
  sectionType?: SectionType;
}
export const getTeacherRelatedSections = async (params: Params) => {
  const {
    prisma,
    courseId,
    limit,
    student_id,
    cursor,
    search,
    semester,
    status,
    sectionType,
  } = params;
  const active =
    status === "Active" ? true : status === "Archive" ? false : undefined;
  const term = semester.split(" ")[0];
  const year = semester.split(" ")[1];

  return await prisma.sections.findMany({
    where: {
      deleted_at: null,
      course_id: courseId,
      active,
      semester: {
        term,
        year,
      },
      type: sectionType,
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
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
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
