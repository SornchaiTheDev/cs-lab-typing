import { teacherProcedure, router } from "~/server/api/trpc";
import { z } from "zod";

export const deleteTaskRouter = router({
  deleteTask: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      const task = await ctx.prisma.tasks.delete({
        where: {
          id,
        },
      });
      if (!task) {
        return null;
      }
      return task;
    }),
});
