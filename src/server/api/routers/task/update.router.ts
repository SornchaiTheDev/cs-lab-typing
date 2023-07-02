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
      const actionUser = ctx.user.full_name;
      let task;
      try {
        await createNotExistTags(ctx.prisma, tags);

        task = await ctx.prisma.tasks.update({
          where: {
            id: _id,
          },
          data: {
            name,
            tags: {
              set: tags.map((tag) => ({
                name: tag,
              })),
            },
            isPrivate,
            language,
            owner: {
              connect: {
                full_name: owner,
              },
            },
            type,
            note,
            history: {
              create: {
                action: "Update task info",
                user: {
                  connect: {
                    full_name: actionUser,
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
      const actionUser = ctx.user.full_name;
      const { taskId, body } = input;
      const _taskId = parseInt(taskId);
      try {
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
                    full_name: actionUser,
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
