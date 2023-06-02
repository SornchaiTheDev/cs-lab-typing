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

      await ctx.prisma.task_histories.create({
        data: {
          action: "Delete task",
          user: {
            connect: {
              full_name: ctx.user.full_name,
            },
          },
          tasks: {
            connect: {
              id: task.id,
            },
          },
        },
      });
      if (!task) {
        return null;
      }
      return task;
    }),
});
