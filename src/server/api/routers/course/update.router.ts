import { AddCourseSchema } from "~/schemas/CourseSchema";
import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { isUserInThisCourse } from "~/server/utils/checkIfUserInThisCourse";

export const updateCoursesRouter = router({
  updateCourse: teacherAboveProcedure
    .input(AddCourseSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { id, number, name, authors, note, comments } = input;
      const _id = parseInt(id);
      try {
        await isUserInThisCourse(ctx.user.student_id, _id);
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
