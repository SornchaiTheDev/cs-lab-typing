import { Prisma, type PrismaClient } from "@prisma/client";

export const addStudent = async (prisma: PrismaClient, user: string) => {
  const [student_id, email, full_name] = user.split(",");

  try {
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new Error("DUPLICATED_USER");
      }
    }
  }
};
