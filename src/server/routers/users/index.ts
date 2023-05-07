import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";
import {
  addStudent,
  deleteStudent,
  getStudentObjectRelation,
} from "./role/student";
import { addNonKUStudent } from "./role/nonKU";
import { isKUStudent, isNonKUStudent } from "./role/isValidStudent";
import { TRPCError } from "@trpc/server";
import { isArrayUnique } from "@/helpers";

export const usersRouter = router({
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
        let isValidUser = users.every(
          (email) => z.string().email().safeParse(email).success
        );

        if (!isValidUser) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "INVALID_INPUT",
          });
        }

        if (!isArrayUnique(users)) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "DUPLICATED_USER",
          });
        }

        for (const email of users) {
          const user = await ctx.prisma.users.findUnique({
            where: {
              email,
            },
            select: {
              roles: true,
            },
          });
          if (user?.roles.some((_role) => _role.name === role_name)) {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_USER",
            });
          }
          await ctx.prisma.users.update({
            where: {
              email,
            },
            data: {
              roles: {
                connect: {
                  name: role_name,
                },
              },
            },
          });
        }
      }
    }),
  getUserPagination: adminProcedure
    .input(
      z.object({
        role: z.union([
          z.literal("student"),
          z.literal("teacher"),
          z.literal("admin"),
          z.literal("non-ku-student"),
        ]),
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, role } = input;

      const users = await ctx.prisma.users.findMany({
        where: {
          roles: {
            some: {
              name: role.toUpperCase(),
            },
          },
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      if (!users) {
        return [];
      }
      return users;
    }),
  getUserById: adminProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const { email } = input;

      return getStudentObjectRelation(ctx.prisma, email);
    }),
  deleteUser: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await deleteStudent(ctx.prisma, id);
      return "Success";
    }),
});
