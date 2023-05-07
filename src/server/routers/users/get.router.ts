import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";
import { getStudentObjectRelation } from "./role/student";

export const getUserRouter = router({
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
});
