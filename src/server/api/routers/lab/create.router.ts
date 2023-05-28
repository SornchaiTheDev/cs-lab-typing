import { router, teacherProcedure } from "~/server/api/trpc";
import { AddLabSchema } from "~/forms/LabSchema";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const createLabRouter = router({
  createLab: teacherProcedure
    .input(AddLabSchema.and(z.object({ courseId: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { isDisabled, name, tags, courseId } = input;
      let lab;
      try {
        lab = await ctx.prisma.labs.create({
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
            history: {
              create: {
                action: "Create a lab",
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

      return lab;
    }),
});
