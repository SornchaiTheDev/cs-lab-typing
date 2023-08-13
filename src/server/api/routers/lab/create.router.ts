import { router, teacherAboveProcedure } from "~/server/api/trpc";
import { AddLabSchema } from "~/schemas/LabSchema";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const createLabRouter = router({
  createLab: teacherAboveProcedure
    .input(AddLabSchema.and(z.object({ courseId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { isDisabled, name, tags, courseId } = input;
      const _courseId = parseInt(courseId);

      let lab;
      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: ctx.user.student_id,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

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
                id: _courseId,
              },
            },
            history: {
              create: {
                action: "Create a lab",
                user: {
                  connect: {
                    id: user?.id,
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
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      }

      return lab;
    }),
});
