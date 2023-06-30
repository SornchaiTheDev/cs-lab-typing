import { Prisma, type PrismaClient } from "@prisma/client";
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
        throw new Error("DUPLICATED_USER");
      }
    }
  }
};
