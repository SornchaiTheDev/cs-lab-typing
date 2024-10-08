import { getHighestRole } from "~/utils";
import { prisma } from "../server/db";
export const isRelationWithThisCourse = async (
  student_id: string,
  course_id: number
) => {
  
  const asInstructor = await prisma.sections.findFirst({
    where: {
      course_id,
      instructors: {
        some: {
          student_id,
        },
      },
    },
  });

  const asAuthor = await prisma.courses.findFirst({
    where: {
      id: course_id,
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
