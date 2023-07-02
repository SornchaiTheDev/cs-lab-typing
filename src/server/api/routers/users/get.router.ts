import {
  teacherAboveProcedure,
  router,
  adminProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import type { Relation } from "~/types/Relation";
import { TRPCError } from "@trpc/server";

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

      try {
        const [users, amount] = await ctx.prisma.$transaction([
          ctx.prisma.users.findMany({
            where: {
              deleted_at: null,
            },
            skip: page * limit,
            take: limit,
            orderBy: {
              created_at: "desc",
            },
          }),
          ctx.prisma.users.count(),
        ]);

        return { users, pageCount: Math.ceil(amount / limit) };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getUserByEmail: teacherAboveProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const { email } = input;
      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            email,
            deleted_at: null,
          },
        });
        return user;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getUserObjectRelation: teacherAboveProcedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const { email } = input;
      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            email,
            deleted_at: null,
          },
        });

        const relation: Relation = {
          summary: [{ name: "User", amount: 1 }],
          object: [
            {
              name: "User",
              data: [{ name: user?.full_name as string, data: [] }],
            },
          ],
        };

        return relation;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getAllUsersInRole: teacherAboveProcedure
    .input(
      z.object({
        roles: z.array(
          z.literal("ADMIN").or(z.literal("TEACHER")).or(z.literal("STUDENT"))
        ),
      })
    )
    .query(async ({ ctx, input }) => {
      const { roles } = input;
      try {
        const users = await ctx.prisma.users.findMany({
          where: {
            roles: {
              hasSome: roles,
            },
            deleted_at: null,
          },
        });
        return users;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getUserByNameAndRole: teacherAboveProcedure
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
      try {
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
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
