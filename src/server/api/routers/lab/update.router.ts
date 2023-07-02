import { router, teacherAboveProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AddLabSchema } from "~/schemas/LabSchema";
import { Prisma } from "@prisma/client";
import { createNotExistTags } from "~/server/utils/createNotExistTags";

export const updateLabRouter = router({
  updateLab: teacherAboveProcedure
    .input(
      AddLabSchema.and(z.object({ courseId: z.string(), labId: z.string() }))
    )
    .mutation(async ({ ctx, input }) => {
      const { isDisabled, name, tags, courseId, labId } = input;

      const _labId = parseInt(labId);
      const _courseId = parseInt(courseId);

      try {
        await createNotExistTags(ctx.prisma, tags);

        const user = await ctx.prisma.users.findFirst({
          where: {
            full_name: ctx.user.full_name,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        await ctx.prisma.labs.update({
          where: {
            id: _labId,
          },
          data: {
            name,
            tags: {
              set: tags.map((tag) => ({ name: tag })),
            },
            isDisabled,
            course: {
              connect: {
                id: _courseId,
              },
            },
            history: {
              create: {
                action: "Edit lab settings",
                user: {
                  connect: {
                    id: user?.id,
                  },
                },
              },
            },
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_LAB",
              cause: "DUPLICATED_LAB",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      }
    }),
  updateTaskOrder: teacherAboveProcedure
    .input(
      z.object({
        labId: z.string(),
        tasks: z.array(z.object({ id: z.number(), order: z.number() })),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { labId, tasks } = input;
      const requester = ctx.user.full_name;

      const tasks_order = tasks
        .sort((a, b) => a.order - b.order)
        .map((t) => t.id);

      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            full_name: requester,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        await ctx.prisma.labs.update({
          where: {
            id: parseInt(labId),
          },
          data: {
            tasks_order: {
              set: tasks_order,
            },
            history: {
              create: {
                action: "Edit task order",
                user: {
                  connect: {
                    id: user?.id,
                  },
                },
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  addTask: teacherAboveProcedure
    .input(z.object({ labId: z.string(), taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { labId, taskId } = input;
      const _labId = parseInt(labId);

      try {
        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
          include: {
            tasks: true,
          },
        });
        await ctx.prisma.labs.update({
          where: {
            id: _labId,
          },
          data: {
            tasks: {
              connect: {
                id: taskId,
              },
            },
          },
        });
        if (!lab) throw new Error("Lab not found");

        const filteredTasks = lab.tasks
          .filter((task) => task.id !== taskId)
          .map((task) => task.id)
          .concat(taskId);

        await ctx.prisma.labs.update({
          where: {
            id: _labId,
          },
          data: {
            tasks_order: {
              set: filteredTasks,
            },
          },
        });
        return "Success";
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  removeTask: teacherAboveProcedure
    .input(z.object({ labId: z.string(), taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { labId, taskId } = input;
      const _labId = parseInt(labId);

      try {
        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
          include: {
            tasks: true,
          },
        });
        if (!lab) throw new Error("Lab not found");

        const filteredTasks = lab.tasks
          .filter((task) => task.id !== taskId)
          .map((task) => task.id);
        await ctx.prisma.labs.update({
          where: {
            id: _labId,
          },
          data: {
            tasks: {
              disconnect: {
                id: taskId,
              },
            },
            tasks_order: {
              set: filteredTasks,
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return "Success";
    }),
});
