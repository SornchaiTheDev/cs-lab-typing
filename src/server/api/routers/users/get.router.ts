import { adminProcedure, router } from "~/server/api/trpc";
import { z } from "zod";

export const getUserRouter = router({
  getUserPagination: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;

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
      });

      const relation = {
        summary: [{ name: "Role", amount: user?.roles.length ?? 0 }],
        object: [
          {
            name: "Role",
            data: user?.roles ?? [],
          },
        ],
      };

      return relation;
    }),
  getAllUsersInRole: adminProcedure
    .input(
      z.object({
        roles: z.array(
          z.literal("ADMIN").or(z.literal("TEACHER")).or(z.literal("STUDENT"))
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      const { roles } = input;
      const users = await ctx.prisma.users.findMany({
        where: {
          roles: {
            hasSome: roles,
          },
          deleted_at: null,
        },
      });
      return users;
    }),
  getUserByNameAndRole: adminProcedure
    .input(
      z.object({
        name: z.string(),
        roles: z.array(
          z.literal("ADMIN").or(z.literal("TEACHER")).or(z.literal("STUDENT"))
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      const { name, roles } = input;
      const users = await ctx.prisma.users.findMany({
        where: {
          full_name: {
            contains: name,
          },
          roles: {
            hasSome: roles,
          },
          deleted_at: null,
        },
        take: 20,
      });
      return users;
    }),
});
