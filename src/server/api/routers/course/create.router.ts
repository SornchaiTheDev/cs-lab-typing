import { AddCourseSchema } from "~/Schemas/CourseSchema";
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
        course = await ctx.prisma.courses.create({
          data: {
            number,
            name,
            authors: {
              connect: authors.map((author) => ({
                full_name: author,
              })),
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
