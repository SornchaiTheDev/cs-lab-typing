import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const getUserRouter = router({
  getUserPagination: adminProcedure
    .input(
      z.object({
        role: z.union([
          z.literal("student"),
          z.literal("teacher"),
          z.literal("admin"),
        ]),
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, role } = input;

      const users = await ctx.prisma.users.findMany({
        where: {
          deleted_at: null,
        },
        skip: (page - 1) * limit,
        take: limit,
      });
      if (!users) {
        return [];
      }
      return users;
    }),
  getUserByEmail: adminProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const { email } = input;
      const user = await ctx.prisma.users.findUnique({
        where: {
          email,
        },
        include: {
          roles: true,
        },
      });
      return user;
    }),
  getUserObjectRelation: adminProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const { email } = input;
      const user = await ctx.prisma.users.findUnique({
        where: {
          email,
        },
        include: {
          roles: true,
        },
      });

      const relation = {
        summary: [{ name: "Role", amount: user?.roles.length }],
        object: [
          {
            name: "Role",
            data: user?.roles.map((role) => role.name),
          },
        ],
      };

      return relation;
    }),
});
