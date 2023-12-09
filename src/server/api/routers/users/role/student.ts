import type { PrismaClient } from "@prisma/client";

export const addStudent = async (prisma: PrismaClient, user: string) => {
  const [student_id, email, full_name] = user.split(",");

  try {
    const isExist = await prisma.users.findFirst({
      where: {
        OR: [
          {
            email,
          },
          { student_id },
        ],
        deleted_at: null,
      },
    });

    if (isExist) {
      return await prisma.users.update({
        where: {
          id: isExist.id,
        },
        data: {
          full_name,
          email,
        },
      });
    }

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
