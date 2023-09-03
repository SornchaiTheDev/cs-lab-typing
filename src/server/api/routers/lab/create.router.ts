import { router, teacherAboveProcedure } from "~/server/api/trpc";
import { AddLabSchema } from "~/schemas/LabSchema";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { isUserInThisCourse } from "~/server/utils/checkUser";

export const createLabRouter = router({
  createLab: teacherAboveProcedure
    .input(AddLabSchema.and(z.object({ courseId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { active, name, tags, courseId } = input;
      const _courseId = parseInt(courseId);

      try {
        await isUserInThisCourse(ctx.user.student_id, _courseId);
        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: ctx.user.student_id,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        // const sections = await ctx.prisma.sections.findMany({
        //   where: {
        //     course_id: _courseId,
        //   },
        // });

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
            // sections: {
            //   connect: sections.map(({ id }) => ({ id })),
            // },
          },
        });

        // await ctx.prisma.sections.updateMany({
        //   where: {
        //     course_id: _courseId,
        //   },
        //   data: {
        //     labs_order: {
        //       push: lab.id,
        //     },
        //   },
        // });

        // await ctx.prisma.labs_status.createMany({
        //   data: sections.map(({ id }) => ({
        //     sectionId: id,
        //     labId: lab.id,
        //     status: "ACTIVE",
        //   })),
        // });

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
