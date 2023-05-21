import { adminProcedure, router } from "~/server/api/trpc";
import { z } from "zod";

export const deleteTaskRouter = router({
  deleteTask: adminProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const task = await ctx.prisma.tasks.delete({
        where: {
          name,
        },
      });
      if (!task) {
        return null;
      }
      return task;
    }),
});
