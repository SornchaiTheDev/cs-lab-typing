import { router, teacherAboveAndRelatedProcedure } from "~/server/api/trpc";
import { AddLabSchema } from "~/schemas/LabSchema";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const createLabRouter = router({
  createLab: teacherAboveAndRelatedProcedure
    .input(AddLabSchema.and(z.object({ courseId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { active, name, tags, courseId } = input;
      const _courseId = parseInt(courseId);

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

        const lab = await ctx.prisma.labs.create({
          data: {
            name,
            tags: {
              connectOrCreate: tags.map(({ value }) => ({
                where: { name: value as string },
                create: { name: value as string },
              })),
            },
            active,
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

        return lab;
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
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
    }),
});
