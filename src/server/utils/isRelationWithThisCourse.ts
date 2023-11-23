import { getHighestRole } from "~/helpers";
import { prisma } from "../db";
export const isRelationWithThisCourse = async (
  student_id: string,
  course_id: string
) => {
  const parsedCourseId = parseInt(course_id);
  const asInstructor = await prisma.sections.findFirst({
    where: {
      course_id: parsedCourseId,
      instructors: {
        some: {
          student_id,
        },
      },
    },
  });

  const asAuthor = await prisma.courses.findFirst({
    where: {
      id: parsedCourseId,
      authors: {
        some: {
          student_id,
        },
      },
    },
  });

  const user = await prisma.users.findFirst({
    where: {
      student_id,
      deleted_at: null,
    },
  });

  if (getHighestRole(user?.roles ?? []) === "ADMIN") return true;
  return asInstructor || asAuthor;
};
