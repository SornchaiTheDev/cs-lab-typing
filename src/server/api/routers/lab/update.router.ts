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

      try {
        await ctx.prisma.labs.update({
          where: {
            id: labId,
          },
          data: {
            tasks: {
              updateMany: tasks.map((task) => ({
                where: {
                  id: {
                    equals: task.id,
                  },
                },
                data: {
                  order: task.order,
                },
              })),
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
});
