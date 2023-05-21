import { adminProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
export const getTaskRouter = router({
  getTask: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;

      const tasks = await ctx.prisma.tasks.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          deleted_at: null,
        },
        include: {
          tags: {
            select: {
              name: true,
            },
          },
          owner: {
            select: {
              full_name: true,
            },
          },
        },
      });
      if (!tasks) {
        return [];
      }
      return tasks;
    }),
  getTaskById: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const task = await ctx.prisma.tasks.findUnique({
        where: {
          id,
        },
        include: {
          tags: true,
          owner: true,
        },
      });
      return task;
    }),
  getTaskObjectRelation: adminProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;

      const task = await ctx.prisma.tasks.findUnique({
        where: {
          name,
        },
      });

      // const course = await ctx.prisma.courses.findUnique({
      //   where: {
      //     id: lab?.courseId,
      //   },
      //   include: {
      //     sections: {
      //       include: {
      //         students: true,
      //         instructors: true,
      //         tas: true,
      //         semester: true,
      //       },
      //     },
      //     authors: true,
      //   },
      // });

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
