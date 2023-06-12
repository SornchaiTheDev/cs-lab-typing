import { router, adminProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteSemesterRouter = router({
  deleteSemester: adminProcedure
    .input(
      z.object({
        yearAndTerm: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { yearAndTerm } = input;
      const year = yearAndTerm.split("/")[0] ?? "";
      const term = yearAndTerm.split("/")[1] ?? "";
      try {
        await ctx.prisma.semesters.delete({
          where: {
            year_term: {
              year,
              term,
            },
          },
        });
        return "Success";
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
