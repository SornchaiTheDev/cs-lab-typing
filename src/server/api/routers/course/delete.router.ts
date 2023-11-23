import { router, adminProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteCourseRouter = router({
  deleteCourse: adminProcedure
    .input(
      z.object({
        courseId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { courseId } = input;
      try {
        await ctx.prisma.courses.delete({
          where: {
            id: courseId,
          },
        });

        await ctx.prisma.labs.deleteMany({
          where: {
            course: {
              id : courseId,
            },
          },
        });

        await ctx.prisma.sections.deleteMany({
          where: {
            course: {
              id : courseId,
            },
          },
        });

        return "Success";
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
