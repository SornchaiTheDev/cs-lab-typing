import { getHighestRole } from "~/helpers";
import { prisma } from "../db";
export const isUserInThisSection = async (
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
          instructors: {
            some: {
              student_id,
            },
          },
        },
      },
    },
  });

  const asStudent = await prisma.users.findFirst({
    where: {
      student_id,
      deleted_at: null,
      instructors: {
        some: {
          id: section_id,
          instructors: {
            some: {
              student_id,
            },
          },
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

  if (getHighestRole(user?.roles.join(",")) === "ADMIN") return;

  if (!(asStudent || asInstructor)) throw new Error("UNAUTHORIZED");
};