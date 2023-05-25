import { router, teacherProcedure } from "~/server/api/trpc";
import { z } from "zod";
import bcrypt from "bcrypt";
import type { roles } from "@prisma/client";

export const updateUserRouter = router({
  updateKUStudent: teacherProcedure
    .input(
      z.object({
        email: z.string().email(),
        full_name: z.string(),
        roles: z.array(z.string()),
        student_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, full_name, roles, student_id } = input;

      await ctx.prisma.users.update({
        where: {
          email,
        },
        data: {
          full_name,
          student_id,
          roles: {
            set: roles.map((role) => role.toUpperCase()) as roles[],
          },
        },
      });
    }),
  updateNonKUStudent: teacherProcedure
    .input(
      z.object({
        email: z.string().email(),
        full_name: z.string(),
        roles: z.array(z.string()),
        student_id: z.string(),
        password: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, full_name, roles, student_id, password } = input;

      await ctx.prisma.users.update({
        where: {
          email,
        },
        data: {
          full_name,
          student_id,
          ...(password.length > 0 && {
            password: await bcrypt.hash(password, 10),
          }),
          roles: {
            set: roles.map((role) => role.toUpperCase()) as roles[],
          },
        },
      });
    }),
  updateTeacher: teacherProcedure
    .input(
      z.object({
        email: z.string().email(),
        full_name: z.string(),
        roles: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email, full_name, roles } = input;

      await ctx.prisma.users.update({
        where: {
          email,
        },
        data: {
          full_name,
          roles: {
            set: roles.map((role) => role.toUpperCase()) as roles[],
          },
        },
      });
    }),
});
