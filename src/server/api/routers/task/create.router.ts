import { teacherProcedure, router } from "~/server/api/trpc";
import { AddTaskSchema } from "~/forms/TaskSchema";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createTaskRouter = router({
  addTask: teacherProcedure
    .input(AddTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { isPrivate, language, name, owner, type, note, tags } = input;

      let task;
      try {
        task = await ctx.prisma.tasks.create({
          data: {
            isPrivate,
            name,
            language,
            note: note ?? "",
            tags: {
              connectOrCreate: tags?.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
            },
            owner: {
              connect: {
                full_name: owner,
              },
            },
            type,
            history: {
              create: {
                action: "Create a task",
                user: {
                  connect: {
                    full_name: owner,
                  },
                },
              },
            },
          },
        });
        return task
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_TASK",
              cause: "DUPLICATED_TASK",
            });
          }
        }
      }

      return task;
    }),

  cloneTask: teacherProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const owner_full_name = ctx.user.full_name;
      try {
        const originalTask = await ctx.prisma.tasks.findUnique({
          where: {
            id,
          },
          include: {
            tags: true,
            owner: true,
          },
        });
        if (originalTask) {
          const { isPrivate, name, body, language, note, type, tags, owner } =
            originalTask;
          const cloneTask = await ctx.prisma.tasks.create({
            data: {
              name,
              body,
              isPrivate,
              language,
              note,
              type,
              tags: {
                connect: tags.map(({ id }) => ({ id })),
              },
              owner: {
                connect: {
                  full_name: owner_full_name,
                },
              },
            },
          });
          await ctx.prisma.task_histories.create({
            data: {
              action: `Clone from ${owner.full_name}/${name}`,
              user: {
                connect: {
                  full_name: owner_full_name,
                },
              },
              tasks: {
                connect: {
                  id: cloneTask.id,
                },
              },
            },
          });
          return cloneTask;
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
