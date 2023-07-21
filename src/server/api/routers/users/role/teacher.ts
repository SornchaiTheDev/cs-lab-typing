import type { PrismaClient } from "@prisma/client";

export const addTeacher = async (prisma: PrismaClient, user: string) => {
  const [email, full_name] = user.split(",");

  try {
    const isExist = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    if (isExist) throw new Error("DUPLICATED_USER");

    await prisma.users.create({
      data: {
        student_id: email as string,
        email: email as string,
        full_name: full_name as string,
        roles: {
          set: ["STUDENT", "TEACHER"],
        },
      },
    });
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "P2002") {
        throw new Error("DUPLICATED_USER");
      }
    }
  }
};
