import { adminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateSemestersRouter = router({
  updateSemester: adminProcedure
    .input(
      z.object({
        id: z.number(),
        startDate: z.date(),
        term: z
          .literal("First")
          .or(z.literal("Second"))
          .or(z.literal("Summer")),
        year: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, startDate, term, year } = input;
      try {
        await ctx.prisma.semester.update({
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
