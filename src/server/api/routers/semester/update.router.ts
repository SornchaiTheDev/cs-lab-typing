import { SemesterSchema } from "~/schemas/SemesterSchema";
import { adminProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateSemesterRouter = router({
  updateSemester: adminProcedure
    .input(SemesterSchema.and(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { id, startDate, term, year } = input;
      try {
        await ctx.prisma.semesters.update({
          where: {
            id,
          },
          data: {
            startDate,
            term,
            year,
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SAME_YEAR_AND_TERM",
        });
      }
      return "Success";
    }),
});
