import { adminProcedure, router } from "~/server/api/trpc";
import { z } from "zod";

export const deleteLabRouter = router({
  deleteLab: adminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const lab = await ctx.prisma.labs.delete({
        where: {
          name,
        },
      });
      if (!lab) {
        return null;
      }
      return lab;
    }),
});
