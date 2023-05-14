import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const createSemesterRouter = router({
  createSemester: adminProcedure
    .input(
      z.object({
        startDate: z.date(),
        term: z
          .literal("First")
          .or(z.literal("Second"))
          .or(z.literal("Summer")),
        year: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { startDate, term, year } = input;
      await ctx.prisma.semester.create({
        data: {
          startDate,
          term,
          year,
        },
      });
    }),
});
