import { teacherProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteTaskRouter = router({
  deleteTask: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        const task = await ctx.prisma.tasks.delete({
          where: {
            id,
          },
        });

        const labs = await ctx.prisma.labs.findMany({
          where: {
            tasks: {
              some: {
                id,
              },
            },
          },
        });

        labs.forEach(async (lab) => {
          await ctx.prisma.labs.update({
            where: {
              id: lab.id,
            },
            data: {
              tasks: {
                disconnect: {
                  id,
                },
              },
              tasks_order: {
                set: lab.tasks_order.filter((taskId) => taskId !== id),
              },
            },
          });
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
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
