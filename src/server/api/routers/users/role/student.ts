import type { PrismaClient } from "@prisma/client";

export const addStudent = async (prisma: PrismaClient, user: string) => {
  const [student_id, email, full_name] = user.split(",");

  try {
    const isExist = await prisma.users.findFirst({
      where: {
        email,
        deleted_at: null,
      },
    });
    if (isExist) throw new Error("DUPLICATED_USER");

    await prisma.users.create({
      data: {
        student_id: student_id as string,
        email: email as string,
        full_name: full_name as string,
        roles: {
          set: ["STUDENT"],
        },
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "DUPLICATED_USER") {
        throw new Error("DUPLICATED_USER");
      }
    }
  }
};
