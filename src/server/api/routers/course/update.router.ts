import { AddCourseSchema } from "~/Schemas/CourseSchema";
import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateCoursesRouter = router({
  updateCourse: teacherAboveProcedure
    .input(AddCourseSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { id, number, name, authors, note, comments } = input;
      const _id = parseInt(id);
      try {
        await ctx.prisma.courses.update({
          where: {
            id: _id,
          },
          data: {
            number,
            name,
            authors: {
              set: authors.map((author) => ({
                full_name: author,
              })),
            },
            note,
            comments,
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return "Success";
    }),
});
