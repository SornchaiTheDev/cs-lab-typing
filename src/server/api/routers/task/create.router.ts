import { adminProcedure, router } from "~/server/api/trpc";
import { AddTaskSchema } from "~/forms/TaskSchema";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const createTaskRouter = router({
  addTask: adminProcedure
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
          },
        });
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
});
