import { AddCourseSchema } from "~/forms/CourseSchema";
import { adminProcedure, router } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateCoursesRouter = router({
  updateCourse: adminProcedure
    .input(AddCourseSchema.and(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { id, number, name, authors, note, comments } = input;
      try {
        await ctx.prisma.courses.update({
          where: {
            id,
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
          message: "EDIT_DUPLICATED_COURSE",
        });
      }
      return "Success";
    }),
});
