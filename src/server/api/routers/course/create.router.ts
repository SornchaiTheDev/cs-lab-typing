import { AddCourseSchema } from "~/schemas/CourseSchema";
import { adminProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const createCourseRouter = router({
  createCourse: adminProcedure
    .input(AddCourseSchema)
    .mutation(async ({ ctx, input }) => {
      const { number, name, authors, note, comments } = input;
      try {
        const courseExist = await ctx.prisma.courses.findFirst({
          where: {
            OR: [
              {
                number,
              },
              { name },
            ],
            deleted_at: null,
          },
        });

        if (courseExist) {
          throw new Error("DUPLICATED_COURSE");
        }

        const course = await ctx.prisma.courses.create({
          data: {
            number,
            name,
            authors: {
              connect: authors.map((author) => ({
                email: author.value as string,
              })),
            },
            note,
            comments,
          },
        });

        return course;
      } catch (e) {
        if (e instanceof Error) {
          if (e.message === "DUPLICATED_COURSE") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_COURSE",
            });
          }
        }

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
