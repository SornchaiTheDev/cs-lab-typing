import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";
import {
  isKUStudent,
  isNonKUStudent,
  isValidTeacher,
} from "./role/isValidUser";
import { addStudent } from "./role/student";
import { addNonKUStudent } from "./role/nonKU";
import { TRPCError } from "@trpc/server";
import { isArrayUnique } from "@/helpers";

export const createUserRouter = router({
  addUser: adminProcedure
    .input(
      z.object({
        role: z.union([
          z.literal("student"),
          z.literal("teacher"),
          z.literal("admin"),
        ]),
        users: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { role, users } = input;
      if (role === "student") {
        for (const user of users) {
          if (isKUStudent(user)) {
            return await addStudent(ctx.prisma, user);
          } else if (isNonKUStudent(user)) {
            return await addNonKUStudent(ctx.prisma, user);
          } else {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "INVALID_INPUT",
            });
          }
        }
      } else {
        const role_name = role.toUpperCase();

        if (!isArrayUnique(users)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "DUPLICATED_USER",
          });
        }

        for (const user of users) {
          if (!isValidTeacher(user)) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "INVALID_INPUT",
            });
          }

          const [email, full_name] = user.split(",");
          const fetchUser = await ctx.prisma.users.findUnique({
            where: {
              email,
            },
            select: {
              roles: true,
            },
          });
          if (fetchUser?.roles.some((_role) => _role.name === role_name)) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_USER",
            });
          }
          await ctx.prisma.users.upsert({
            where: {
              email,
            },
            update: {
              roles: {
                connect: {
                  name: role_name,
                },
              },
            },
            create: {
              student_id: email,
              email,
              full_name,
              roles: {
                connect: [{ name: role_name }, { name: "STUDENT" }],
              },
            },
          });
        }
      }
    }),
});
