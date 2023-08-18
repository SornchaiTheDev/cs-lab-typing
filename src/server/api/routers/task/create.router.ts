import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { AddTaskSchema } from "~/schemas/TaskSchema";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createTaskRouter = router({
  addTask: teacherAboveProcedure
    .input(AddTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { isPrivate, language, name, owner, type, note, tags } = input;

      let task;
      try {
        const _owner = await ctx.prisma.users.findFirst({
          where: {
            student_id: owner.value,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        task = await ctx.prisma.tasks.create({
          data: {
            isPrivate,
            name,
            language,
            note: note ?? "",
            tags: {
              connectOrCreate: tags?.map(({ value }) => ({
                where: { name: value },
                create: { name: value },
              })),
            },
            owner: {
              connect: {
                id: _owner?.id,
              },
            },
            type,
            history: {
              create: {
                action: "Create a task",
                user: {
                  connect: {
                    id: _owner?.id,
                  },
                },
              },
            },
          },
        });
        return task;
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_TASK",
              cause: "DUPLICATED_TASK",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      }

      return task;
    }),

  cloneTask: teacherAboveProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const owner_student_id = ctx.user.student_id;
      try {
        const _owner = await ctx.prisma.users.findFirst({
          where: {
            student_id: owner_student_id,
            deleted_at: null,
          },
        });

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
              name: `${name} (clone)`,
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
                  id: _owner?.id,
                },
              },
            },
          });
          await ctx.prisma.task_histories.create({
            data: {
              action: `Clone from ${owner.full_name}/${name}`,
              user: {
                connect: {
                  id: _owner?.id,
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
