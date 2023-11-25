import { getHighestRole } from "~/helpers";
import { prisma } from "../db";
export const isRelatedToThisSection = async (
  student_id: string,
  section_id: number
) => {
  const asInstructor = await prisma.users.findFirst({
    where: {
      student_id,
      deleted_at: null,
      instructors: {
        some: {
          id: section_id,
        },
      },
    },
  });

  const asStudent = await prisma.users.findFirst({
    where: {
      student_id,
      deleted_at: null,
      students: {
        some: {
          id: section_id,
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

  return asStudent || asInstructor;
};
