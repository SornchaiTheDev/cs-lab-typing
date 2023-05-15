import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const getCourseRouter = router({
  getCoursePagination: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;

      const semesters = await ctx.prisma.courses.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      if (!semesters) {
        return [];
      }
      return semesters;
    }),
  getCourseById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const course = await ctx.prisma.courses.findFirst({
        where: {
          id,
        },
        include: {
          authors: true,
        },
      });
      if (!course) {
        return null;
      }
      return course;
    }),
});
