import { prisma } from "../db";
export const isUserIsStudentInThisSection = async (
  student_id: string,
  section_id: number
) => {
  const user = await prisma.users.findFirst({
    where: {
      student_id,
      deleted_at: null,
      students: {
        some: {
          id: section_id,
          students: {
            some: {
              student_id,
            },
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  if (!user) throw new Error("UNAUTHORIZED");
};
