import { Prisma, PrismaClient } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const addNonKUStudent = async (prisma: PrismaClient, user: string) => {
  const [username, password, email, full_name] = user.split(",");

  const passwordHash = await bcrypt.hash(password, 10);
  try {
    await prisma.users.create({
      data: {
        student_id: username,
        password: passwordHash,
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

export const getStudentObjectRelation = async (
  prisma: PrismaClient,
  email: string
) => {
  const user = await prisma.users.findUnique({
    where: {
      email,
    },
    include: {
      roles: true,
    },
  });

  return user;
};

export const deleteStudent = async (prisma: PrismaClient, id: number) => {
  await prisma.users.delete({
    where: {
      id,
    },
  });
};