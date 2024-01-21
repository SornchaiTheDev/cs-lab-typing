import { router, adminProcedure } from "~/server/api/trpc";
import bcrypt from "bcrypt";
import type { roles } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { KUStudentSchema } from "~/schemas/KUStudentSchema";
import { NonKUStudent } from "~/schemas/NonKUSchema";
import { TeacherSchema } from "~/schemas/TeacherSchema";

export const updateUserRouter = router({
  updateKUStudent: adminProcedure
    .input(KUStudentSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, full_name, roles, student_id } = input;
      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            email,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });
        await ctx.prisma.users.update({
          where: {
            id: user?.id,
          },
          data: {
            full_name,
            student_id,
            roles: {
              set: roles.map((role) => role.value.toUpperCase()) as roles[],
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  updateNonKUStudent: adminProcedure
    .input(NonKUStudent)
    .mutation(async ({ ctx, input }) => {
      const { email, full_name, roles, student_id, password } = input;
      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            email,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });
        await ctx.prisma.users.update({
          where: {
            id: user?.id,
          },
          data: {
            full_name,
            student_id,
            ...(password.length > 0 && {
              password: await bcrypt.hash(password, 10),
            }),
            roles: {
              set: roles.map((role) => role.value.toUpperCase()) as roles[],
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  updateTeacher: adminProcedure
    .input(TeacherSchema)
    .mutation(async ({ ctx, input }) => {
      const { email, full_name, roles } = input;
      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            email,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });
        await ctx.prisma.users.update({
          where: {
            id: user?.id,
          },
          data: {
            full_name,
            roles: {
              set: roles.map((role) => role.value.toUpperCase()) as roles[],
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
