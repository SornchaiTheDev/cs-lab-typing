import { router, adminProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const deleteCourseRouter = router({
  deleteCourse: adminProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;

      await ctx.prisma.courses.update({
        where: {
          name,
        },
        data: {
          deleted_at: new Date(),
        },
      });
      return "Success";
    }),
});
