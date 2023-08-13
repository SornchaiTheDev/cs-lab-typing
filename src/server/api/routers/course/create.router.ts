import { AddCourseSchema } from "~/schemas/CourseSchema";
import { adminProcedure, router } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const createCourseRouter = router({
  createCourse: adminProcedure
    .input(AddCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { number, name, authors, note, comments } = input;
      let course;
      try {
        // FIX THIS (cannot use full_name to find users use student_id instead)
        const users = await ctx.prisma.users.findMany({
          where: {
            full_name: {
              in: authors,
            },
            deleted_at: null,
          },
        });

        course = await ctx.prisma.courses.create({
          data: {
            number,
            name,
            authors: {
              connect: users.map((user) => ({ id: user.id })),
            },
            note,
            comments,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_COURSE",
              cause: "DUPLICATED_COURSE",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      }
      return course;
    }),
});
