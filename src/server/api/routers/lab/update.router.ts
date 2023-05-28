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
});
