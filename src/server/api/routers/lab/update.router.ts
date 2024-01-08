import {
  router,
  teacherAboveAndRelatedToCourseProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AddLabSchema } from "~/schemas/LabSchema";
import { Prisma } from "@prisma/client";
import { createNotExistTags } from "~/utils/createNotExistTags";

export const updateLabRouter = router({
  updateLab: teacherAboveAndRelatedToCourseProcedure
    .input(
      AddLabSchema.and(z.object({ courseId: z.string(), labId: z.string() }))
    )
    .mutation(async ({ ctx, input }) => {
      const { active, name, tags, courseId, labId } = input;

      const _labId = parseInt(labId);
      const _courseId = parseInt(courseId);

      try {
        await createNotExistTags(
          ctx.prisma,
          tags.map((tag) => tag.value as string)
        );

        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: ctx.user.student_id,
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
              set: tags.map((tag) => ({ name: tag.value as string })),
            },
            active,
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

        await ctx.prisma.labs_status.updateMany({
          where: {
            labId: _labId,
          },
          data: {
            status: active ? "ACTIVE" : "DISABLED",
          },
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
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
  updateTaskOrder: teacherAboveAndRelatedToCourseProcedure
    .input(
      z.object({
        labId: z.string(),
        tasks: z.array(z.object({ id: z.number(), order: z.number() })),
        courseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { labId, tasks } = input;
      const requester = ctx.user.student_id;

      const tasks_order = tasks
        .sort((a, b) => a.order - b.order)
        .map((t) => t.id);

      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
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
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  addTask: teacherAboveAndRelatedToCourseProcedure
    .input(
      z.object({ labId: z.string(), taskId: z.number(), courseId: z.string() })
    )
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

        const newTasksOrder = lab.tasks_order.concat(taskId);

        await ctx.prisma.labs.update({
          where: {
            id: _labId,
          },
          data: {
            tasks_order: {
              set: newTasksOrder,
            },
          },
        });
        return "Success";
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  removeTask: teacherAboveAndRelatedToCourseProcedure
    .input(
      z.object({ courseId: z.string(), labId: z.string(), taskId: z.number() })
    )
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
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return "Success";
    }),
});
