import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const addNonKUStudent = async (prisma: PrismaClient, user: string) => {
  const [username, password, email, full_name] = user.split(",");

  const passwordHash = await bcrypt.hash(password as string, 10);
  try {
    const isExist = await prisma.users.findFirst({
      where: {
        email,
        student_id: username,
        deleted_at: null,
      },
    });
    if (isExist) throw new Error("DUPLICATED_USER");
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
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "DUPLICATED_USER") {
        throw new Error("DUPLICATED_USER");
      }
    }
  }
};
