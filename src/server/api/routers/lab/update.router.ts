import { router, teacherProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AddLabSchema } from "~/forms/LabSchema";
import { Prisma } from "@prisma/client";
import { createNotExistTags } from "~/server/utils/createNotExistTags";

export const updateLabRouter = router({
  updateLab: teacherProcedure
    .input(AddLabSchema.and(z.object({ courseId: z.number(), id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { isDisabled, name, tags, courseId, id } = input;

      try {
        await createNotExistTags(ctx.prisma, tags);
        await ctx.prisma.labs.update({
          where: {
            id,
          },
          data: {
            name,
            tags: {
              set: tags.map((tag) => ({ name: tag })),
            },
            isDisabled,
            course: {
              connect: {
                id: courseId,
              },
            },
            history: {
              create: {
                action: "Edit lab settings",
                user: {
                  connect: {
                    full_name: ctx.user.full_name,
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
        }
      }
    }),
  updateTaskOrder: teacherProcedure
    .input(
      z.object({
        labId: z.number(),
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
        await ctx.prisma.labs.update({
          where: {
            id: labId,
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
                    full_name: requester,
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
  addTask: teacherProcedure
    .input(z.object({ labId: z.number(), taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { labId, taskId } = input;
      try {
        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: labId,
          },
          include: {
            tasks: true,
          },
        });
        await ctx.prisma.labs.update({
          where: {
            id: labId,
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
            id: labId,
          },
          data: {
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
  removeTask: teacherProcedure
    .input(z.object({ labId: z.number(), taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { labId, taskId } = input;
      try {
        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: labId,
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
            id: labId,
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
