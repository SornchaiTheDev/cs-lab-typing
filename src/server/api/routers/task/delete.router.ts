import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getHighestRole } from "~/utils";

export const deleteTaskRouter = router({
  deleteTask: teacherAboveProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const role = getHighestRole(ctx.user.roles);
      try {
        const task = await ctx.prisma.tasks.findUnique({
          where: {
            id,
          },
          select: {
            owner: true,
          },
        });
        if (task && role !== "ADMIN") {
          if (task.owner) {
            if (task.owner.student_id !== ctx.user.student_id) {
              throw new TRPCError({
                code: "UNAUTHORIZED",
                message: "UNAUTHORIZED",
              });
            }
          }
        }

        await ctx.prisma.tasks.delete({
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

        for (const lab of labs) {
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
        }

        const requester = ctx.user.student_id;
        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
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
                id,
              },
            },
          },
        });

        return task;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
