import { AddCourseSchema } from "~/schemas/CourseSchema";
import { adminProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const createCourseRouter = router({
  createCourse: adminProcedure
    .input(AddCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { number, name, authors, note, comments } = input;
      let course;
      try {
        const courseExist = await ctx.prisma.courses.findFirst({
          where: {
            OR: [
              {
                number,
              },
            ],
            deleted_at: null,
          },
        });

        if (courseExist) {
          throw new Error("DUPLICATED_COURSE");
        }
        const users = await ctx.prisma.users.findMany({
          where: {
            student_id: {
              in: authors.map((author) => author.value) as string[],
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
        if (e instanceof Error) {
          if (e.message === "DUPLICATED_COURSE") {
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
