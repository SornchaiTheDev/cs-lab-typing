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
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, date } = input;
      try {
        const authLogger = await ctx.prisma.auth_loggers.findMany({
          where: {
            date: {
              lte: date.to,
              gte: date.from,
            },
          },
          skip: (page - 1) * limit,
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
        });

        return authLogger;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
