import { adminProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { AddTaskSchema } from "~/forms/TaskSchema";

export const updateTaskRouter = router({
  updateTask: adminProcedure
    .input(AddTaskSchema.and(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { isPrivate, language, owner, type, note, name, tags, id } = input;
      let task;
      try {
        task = await ctx.prisma.tasks.update({
          where: {
            id,
          },
          data: {
            name,
            tags: {
              set: tags?.map((tag) => ({ name: tag })),
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
            // course: {
            //   connect: {
            //     id: courseId,
            //   },
            // },
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
});
