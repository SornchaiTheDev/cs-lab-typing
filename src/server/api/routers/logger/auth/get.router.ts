import { adminProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
export const getAuthLoggerRouter = router({
  getAuthLog: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        date: z.object({
          from: z.union([z.date(), z.undefined()]),
          to: z.union([z.date(), z.undefined()]).optional(),
        }),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, date, search } = input;
      try {
        const [authLogger, amount] = await ctx.prisma.$transaction([
          ctx.prisma.auth_loggers.findMany({
            where: {
              date: {
                lte: date.to,
                gte: date.from,
              },
              OR: [
                {
                  ip_address: {
                    contains: search,
                  },
                },
                {
                  type: {
                    contains: search,
                  },
                },
                {
                  user: {
                    email: {
                      contains: search,
                    },
                  },
                },
              ],
            },
            skip: page * limit,
            take: limit,
            select: {
              date: true,
              ip_address: true,
              type: true,
              user: {
                select: {
                  email: true,
                  student_id: true,
                },
              },
            },
          }),
          ctx.prisma.auth_loggers.count({
            where: {
              date: {
                lte: date.to,
                gte: date.from,
              },
            },
          }),
        ]);

        return { authLogger, pageCount: Math.ceil(amount / limit) };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  exportAuthLoggerCSV: adminProcedure
    .input(
      z.object({
        date: z.object({
          from: z.union([z.date(), z.undefined()]),
          to: z.union([z.date(), z.undefined()]).optional(),
        }),
      })
    )
    .query(async ({ ctx, input }) => {
      const { date } = input;

      try {
        const labLoggers = await ctx.prisma.auth_loggers.findMany({
          where: {
            date: {
              lte: date.to,
              gte: date.from,
            },
          },
          select: {
            date: true,
            ip_address: true,
            type: true,
            user: {
              select: {
                email: true,
                student_id: true,
              },
            },
          },
        });

        return labLoggers;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
