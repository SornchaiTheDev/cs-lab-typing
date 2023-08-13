import { AddCourseSchema } from "~/schemas/CourseSchema";
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
        // FIX THIS (cannot use full_name to find users use student_id instead)
        const authorsIds = await ctx.prisma.users.findMany({
          where: {
            full_name: {
              in: authors,
            },
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        await ctx.prisma.courses.update({
          where: {
            id: _id,
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return "Success";
    }),
});
