import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { AddTaskSchema } from "~/schemas/TaskSchema";
import { createNotExistTags } from "~/utils/createNotExistTags";
import { getHighestRole } from "~/utils";

export const updateTaskRouter = router({
  updateTask: teacherAboveProcedure
    .input(AddTaskSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const {
        isPrivate,
        language,
        owner,
        type,
        note,
        name,
        tags = [],
        id,
      } = input;
      const _id = parseInt(id);
      const actionUser = ctx.user.student_id;
      let task;
      const role = getHighestRole(ctx.user.roles);

      try {
        task = await ctx.prisma.tasks.findUnique({
          where: {
            id: _id,
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

        await createNotExistTags(
          ctx.prisma,
          tags.map((tag) => tag.value as string)
        );

        const _owner = await ctx.prisma.users.findFirst({
          where: {
            student_id: owner[0]!.value as string,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        const _actionUser = await ctx.prisma.users.findFirst({
          where: {
            student_id: actionUser,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        task = await ctx.prisma.tasks.update({
          where: {
            id: _id,
          },
          data: {
            name,
            tags: {
              set: tags.map(({ value }) => ({
                name: value as string,
              })),
            },
            isPrivate,
            language,
            owner: {
              connect: {
                id: _owner?.id,
              },
            },
            type,
            note,
            history: {
              create: {
                action: "Update task info",
                user: {
                  connect: {
                    id: _actionUser?.id,
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }

      return task;
    }),
  setTaskBody: teacherAboveProcedure
    .input(z.object({ taskId: z.string(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const actionUser = ctx.user.student_id;
      const { taskId, body } = input;
      const _taskId = parseInt(taskId);
      try {
        const task = await ctx.prisma.tasks.findUnique({
          where: {
            id: _taskId,
          },
          select: {
            owner: true,
          },
        });
        if (task) {
          if (task.owner) {
            if (task.owner.student_id !== ctx.user.student_id) {
              throw new Error("UNAUTHORIZED");
            }
          }
        }

        const _actionUser = await ctx.prisma.users.findFirst({
          where: {
            student_id: actionUser,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });
        await ctx.prisma.tasks.update({
          where: {
            id: _taskId,
          },
          data: {
            body,
            history: {
              create: {
                action: "Edit task body",
                user: {
                  connect: {
                    id: _actionUser?.id,
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
});
