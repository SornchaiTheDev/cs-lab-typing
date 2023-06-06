import { router, teacherProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const getLabLogRouter = router({
  getLabLog: teacherProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        date: z.object({
          from: z.union([z.date(), z.undefined()]),
          to: z.union([z.date(), z.undefined()]).optional(),
        }),
        sectionId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, date, sectionId } = input;

      const labLoggers = await ctx.prisma.lab_loggers.findMany({
        where: {
          date: {
            lte: date.to,
            gte: date.from,
          },
          sectionId,
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
          sectionId: true,
          taskId: true,
        },
      });

      return labLoggers;
    }),
});
