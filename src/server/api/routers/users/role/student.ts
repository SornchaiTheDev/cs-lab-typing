import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const addStudent = async (prisma: PrismaClient, user: string) => {
  const [student_id, email, full_name] = user.split(",");

  try {
    await prisma.users.create({
      data: {
        student_id,
        email,
        full_name,
        roles: {
          connect: {
            name: "STUDENT",
          },
        },
      },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === "P2002") {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DUPLICATED_USER",
          cause: "DUPLICATED_USER",
        });
      }
    }
  }
};
