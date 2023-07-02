import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteTaskRouter = router({
  deleteTask: teacherAboveProcedure
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

        const requester = ctx.user.full_name;
        const user = await ctx.prisma.users.findFirst({
          where: {
            full_name: requester,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });
        await ctx.prisma.task_histories.create({
          data: {
            action: "Delete task",
            user: {
              connect: {
                id: user?.id,
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
