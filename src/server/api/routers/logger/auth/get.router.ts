import { adminProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
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
      if (!authLogger) {
        return [];
      }
      return authLogger;
    }),
});
