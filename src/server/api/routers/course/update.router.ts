import { AddCourseSchema } from "~/schemas/CourseSchema";
import {
  router,
  teacherAboveAndRelatedToCourseProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateCoursesRouter = router({
  updateCourse: teacherAboveAndRelatedToCourseProcedure
    .input(AddCourseSchema.and(z.object({ courseId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { courseId, number, name, authors, note, comments } = input;
      const id = parseInt(courseId);
      try {
        const authorsIds = await ctx.prisma.users.findMany({
          where: {
            student_id: {
              in: authors.map((author) => author.value as string),
            },
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        await ctx.prisma.courses.update({
          where: {
            id,
          },
          data: {
            number,
            name,
            authors: {
              set: authorsIds,
            },
            note,
            comments,
          },
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return "Success";
    }),
});
