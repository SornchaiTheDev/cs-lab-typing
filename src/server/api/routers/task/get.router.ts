import { authedProcedure, teacherProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
import type { Relation } from "~/types/Relation";
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
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const _id = parseInt(id);

      const task = await ctx.prisma.tasks.findUnique({
        where: {
          id: _id,
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

  getUserTaskStatus: teacherProcedure
    .input(
      z.object({
        student_id: z.string(),
        sectionId: z.string(),
        labId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { student_id, sectionId, labId } = input;
      const _sectionId = parseInt(sectionId);

      const tasks = await ctx.prisma.tasks.findMany({
        where: {
          submissions: {
            some: {
              lab_id: labId,
              section_id: _sectionId,
              user: {
                student_id,
              },
            },
          },
        },
        select: {
          name: true,
          submissions: {
            include: {
              typing_histories: {
                orderBy: {
                  created_at: "desc",
                },
                take: 1,
              },
            },
            orderBy: {
              created_at: "desc",
            },
            take: 1,
          },
        },
      });

      const tasksWithHistory = tasks.map((task) => {
        const { submissions } = task;

        return {
          name: task.name,
          history: submissions[0]?.typing_histories[0],
        };
      });

      return tasksWithHistory;
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
        include: {
          labs: {
            include: {
              submissions: true,
            },
          },
        },
      });

      const submissions = await ctx.prisma.submissions.findMany({
        where: {
          task_id: id,
        },
      });

      const relation: Relation = {
        summary: [
          { name: "Tasks", amount: 1 },
          { name: "Assignments", amount: 1 },
          { name: "Submissions", amount: task?.submission_count ?? 0 },
        ],
        object: [
          {
            name: "Task",
            data: [{ name: task?.name as string, data: [] }],
          },
          {
            name: "Assignments",
            data: task?.labs.map((lab) => ({ name: lab.name, data: [] })) ?? [],
          },
          {
            name: "Submissions",
            data: submissions.map(({ created_at, user_id, section_id }) => ({
              name: `Submitted at ${created_at} by user-id:${user_id} sec-id:${section_id}`,
              data: [],
            })),
          },
        ],
      };

      return relation;
    }),
});
