import { adminProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { AddLabSchema } from "~/forms/LabSchema";
import { Prisma } from "@prisma/client";

export const updateLabRouter = router({
  updateLab: adminProcedure
    .input(AddLabSchema.and(z.object({ courseId: z.number(), id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { isDisabled, name, tags, courseId, id } = input;
      let lab;
      try {
        lab = await ctx.prisma.labs.update({
          where: {
            id,
          },
          data: {
            name,
            tags: {
              connectOrCreate: tags.map((tag) => ({
                where: { name: tag },
                create: { name: tag },
              })),
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

      return lab;
    }),
});
