import type { PrismaClient, roles } from "@prisma/client";
import { getHighestRole } from "~/utils";
import { adminCondition, teacherCondition } from "./rolesCondition";

interface Params {
  prisma: PrismaClient;
  limit: number;
  cursor: number | null | undefined;
  search?: string;
  student_id?: string;
  role: roles[];
}

export const getCoursesPaginationByRole = async (params: Params) => {
  const { prisma, limit, cursor, search, student_id, role } = params;

  const highestRole = getHighestRole(role);

  const whereCondition =
    highestRole === "ADMIN"
      ? adminCondition(search)
      : teacherCondition(student_id as string, search);
  try {
    const _courses = await prisma.courses.findMany({
      where: whereCondition,
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

    const courses = _courses.map((course) => ({
      ...course,
      students: course.sections.reduce(
        (acc, section) => acc + section._count.students,
        0
      ),
    }));

    let nextCursor: typeof cursor = undefined;

    if (courses.length > limit) {
      const nextItem = courses.pop();
      nextCursor = nextItem?.id;
    }

    return { courses, nextCursor };
  } catch (err) {
    throw new Error("SOMETHING_WENT_WRONG");
  }
};
