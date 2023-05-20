import { router, adminProcedure } from "~/server/api/trpc";
import { z } from "zod";

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

      await ctx.prisma.semesters.delete({
        where: {
          year_term: {
            year,
            term,
          },
        },
      });
      return "Success";
    }),
});
