import { router, adminProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const deleteSectionsRouter = router({
  deleteSection: adminProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      await ctx.prisma.sections.delete({
        where: {
          name,
        },
      });
      return "Success";
    }),
});
