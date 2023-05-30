import { authedProcedure, teacherProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
export const getTaskRouter = router({
  getTask: authedProcedure
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
          OR: [
            { isPrivate: false },
            {
              owner: {
                full_name: ctx.user.full_name,
              },
            },
          ],
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
        orderBy: {
          updated_at: "desc",
        },
      });
      if (!tasks) {
        return [];
      }
      return tasks;
    }),
  getTaskById: authedProcedure
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
          history: {
            include: {
              user: true,
            },
          },
        },
      });
      return task;
    }),

  searchTasks: authedProcedure
    .input(
      z.object({
        query: z.string(),
        tags: z.array(z.string()),
        types: z.array(
          z.literal("Lesson").or(z.literal("Problem")).or(z.literal("Typing"))
        ),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { query, limit, tags, types } = input;

      if (types.length === 0) types.push("Lesson", "Problem", "Typing");

      const tasks = await ctx.prisma.tasks.findMany({
        take: limit,
        where: {
          deleted_at: null,
          AND: [
            {
              name: {
                contains: query,
                mode: "insensitive",
              },
            },
            {
              OR: [
                {
                  tags: {
                    some: {
                      name: {
                        in: tags,
                      },
                    },
                  },
                },
                {
                  type: {
                    in: types,
                  },
                },
              ],
            },

            {
              OR: [
                { isPrivate: false },
                {
                  owner: {
                    full_name: ctx.user.full_name,
                  },
                },
              ],
            },
          ],
        },
        include: {
          tags: true,
          labs: {
            select: {
              id: true,
            },
          },
        },
      });

      return tasks;
    }),

  getTaskObjectRelation: teacherProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const task = await ctx.prisma.tasks.findUnique({
        where: {
          id,
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
