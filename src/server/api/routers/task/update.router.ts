import { teacherProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { AddTaskSchema } from "~/forms/TaskSchema";

export const updateTaskRouter = router({
  updateTask: teacherProcedure
    .input(AddTaskSchema.and(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { isPrivate, language, owner, type, note, name, tags, id } = input;
      const actionUser = ctx.user.full_name;
      let task;
      try {
        task = await ctx.prisma.tasks.update({
          where: {
            id,
          },
          data: {
            name,
            tags: {
              connectOrCreate: tags?.map((tag) => ({
                where: {
                  name: tag,
                },
                create: {
                  name: tag,
                },
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
          },
        });
        await ctx.prisma.task_history.create({
          data: {
            action: "Update task info",
            user: {
              connect: {
                full_name: actionUser,
              },
            },
            tasks: {
              connect: {
                id: task.id,
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

      return task;
    }),
  setTaskBody: teacherProcedure
    .input(z.object({ id: z.number(), body: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const actionUser = ctx.user.full_name;
      const { id, body } = input;
      try {
        const task = await ctx.prisma.tasks.update({
          where: {
            id,
          },
          data: {
            body,
          },
        });
        await ctx.prisma.task_history.create({
          data: {
            action: "Edit task body",
            user: {
              connect: {
                full_name: actionUser,
              },
            },
            tasks: {
              connect: {
                id: task.id,
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
