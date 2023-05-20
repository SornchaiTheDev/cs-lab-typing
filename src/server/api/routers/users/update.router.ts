import { router, adminProcedure } from "~/server/api/trpc";
import { z } from "zod";
import bcrypt from "bcrypt";

export const updateUserRouter = router({
  updateKUStudent: adminProcedure
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
            set: roles.map((role) => ({ name: role.toUpperCase() })),
          },
        },
      });
    }),
  updateNonKUStudent: adminProcedure
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
            set: roles.map((role: string) => ({ name: role.toUpperCase() })),
          },
        },
      });
    }),
  updateTeacher: adminProcedure
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
            set: roles.map((role) => ({ name: role.toUpperCase() })),
          },
        },
      });
    }),
});
