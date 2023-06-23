import { router, teacherAboveProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const getLabLogRouter = router({
  getLabLog: teacherAboveProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        date: z.object({
          from: z.union([z.date(), z.undefined()]),
          to: z.union([z.date(), z.undefined()]).optional(),
        }),
        sectionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, date, sectionId } = input;

      const _sectionId = parseInt(sectionId);

      try {
        const [labLoggers, amount] = await ctx.prisma.$transaction([
          ctx.prisma.lab_loggers.findMany({
            where: {
              date: {
                lte: date.to,
                gte: date.from,
              },
              sectionId: _sectionId,
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
              sectionId: true,
              taskId: true,
            },
            orderBy: {
              created_at: "desc",
            },
          }),
          ctx.prisma.lab_loggers.count({
            where: {
              date: {
                lte: date.to,
                gte: date.from,
              },
              sectionId: _sectionId,
            },
          }),
        ]);

        return { logger: labLoggers, pageCount: Math.ceil(amount / limit) };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  exportCSV: teacherAboveProcedure
    .input(
      z.object({
        date: z.object({
          from: z.union([z.date(), z.undefined()]),
          to: z.union([z.date(), z.undefined()]).optional(),
        }),
        sectionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { date, sectionId } = input;

      const _sectionId = parseInt(sectionId);

      try {
        const labLoggers = await ctx.prisma.lab_loggers.findMany({
          where: {
            date: {
              lte: date.to,
              gte: date.from,
            },
            sectionId: _sectionId,
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
            sectionId: true,
            taskId: true,
          },
          orderBy: {
            created_at: "desc",
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
