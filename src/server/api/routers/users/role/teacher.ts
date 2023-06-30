import { Prisma, type PrismaClient } from "@prisma/client";

export const addTeacher = async (prisma: PrismaClient, user: string) => {
  const [email, full_name] = user.split(",");

  try {
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new Error("DUPLICATED_USER");
      }
    }
  }
};

export const getStudentObjectRelation = async (
  prisma: PrismaClient,
  email: string
) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
  });

  return user;
};
