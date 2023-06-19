import { Prisma, type PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const addNonKUStudent = async (prisma: PrismaClient, user: string) => {
  const [username, password, email, full_name] = user.split(",");

  const passwordHash = await bcrypt.hash(password as string, 10);
  try {
    await prisma.users.create({
      data: {
        student_id: username as string,
        password: passwordHash,
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DUPLICATED_USER",
          cause: "DUPLICATED_USER",
        });
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
