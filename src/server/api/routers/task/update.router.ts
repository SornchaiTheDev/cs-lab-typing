import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { AddTaskSchema } from "~/schemas/TaskSchema";
import { createNotExistTags } from "~/server/utils/createNotExistTags";

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
      try {
        await createNotExistTags(
          ctx.prisma,
          tags.map((tag) => tag.value)
        );

        const _owner = await ctx.prisma.users.findFirst({
          where: {
            student_id: owner.value,
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
                name: value,
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
