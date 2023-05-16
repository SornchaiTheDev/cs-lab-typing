import { router, adminProcedure } from "@/server/trpc";
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

      await ctx.prisma.sections.update({
        where: {
          name,
        },
        data: {
          deleted_at: new Date(),
        },
      });
      return "Success";
    }),
});
