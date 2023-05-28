import { router, teacherProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const getLabRouter = router({
  getLabPagination: teacherProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        courseId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, courseId } = input;

      const labs = await ctx.prisma.labs.findMany({
        where: {
          deleted_at: null,
          courseId,
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          tags: {
            select: {
              name: true,
            },
          },
        },
      });
      if (!labs) {
        return [];
      }
      return labs;
    }),
  getLabById: teacherProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const lab = await ctx.prisma.labs.findFirst({
        where: {
          id,
          deleted_at: null,
        },
        include: {
          tags: true,
        },
      });

      return lab;
    }),
  getLabObjectRelation: teacherProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;

      const lab = await ctx.prisma.labs.findUnique({
        where: {
          name,
        },
      });

      const course = await ctx.prisma.courses.findUnique({
        where: {
          id: lab?.courseId,
        },
        include: {
          sections: {
            include: {
              students: true,
              instructors: true,
              tas: true,
              semester: true,
            },
          },
          authors: true,
        },
      });

      const relation = {
        summary: [
          { name: "Sections", amount: 1 },
          { name: "Lab in this course", amount: 1 },
          { name: "Submissions", amount: 100 },
        ],
        object: [
          {
            name: "Sections",
            data: [],
          },
          {
            name: "Lab in this course",
            data: [],
          },
          {
            name: "Submissions",
            data: [],
          },
        ],
      };

      return relation;
    }),
});
