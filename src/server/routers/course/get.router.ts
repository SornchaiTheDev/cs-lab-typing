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
        where: {
          deleted_at: null,
        },
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
  getCourseObjectRelation: adminProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;

      const semester = await ctx.prisma.courses.findUnique({
        where: {
          name,
        },
      });

      const relation = {
        summary: [
          { name: "Courses", amount: 1 },
          { name: "Semester", amount: 1 },
          { name: "Users", amount: 2 },
          { name: "Sections", amount: 10 },
        ],
        object: [
          { name: "Courses", data: [name] },
          {
            name: "Semester",
            data: ["2566/F"],
          },
          {
            name: "Sections",
            data: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
          },
          {
            name: "Users",
            data: ["Sornchai Somsakul", "Sornchai Laksanapeeti"],
          },
        ],
      };

      return relation;
    }),
});
