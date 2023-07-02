import {
  teacherAboveProcedure,
  router,
  TaAboveProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import type { Relation } from "~/types/Relation";
import { TRPCError } from "@trpc/server";
export const getTaskRouter = router({
  getTaskPagination: teacherAboveProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      try {
        const [tasks, amount] = await ctx.prisma.$transaction([
          ctx.prisma.tasks.findMany({
            skip: page * limit,
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
          }),
          ctx.prisma.tasks.count({
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
          }),
        ]);

        return { tasks, pageCount: Math.ceil(amount / limit) };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getTaskById: TaAboveProcedure.input(
    z.object({
      id: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const { id } = input;
    const _id = parseInt(id);
    try {
      const task = await ctx.prisma.tasks.findUnique({
        where: {
          id: _id,
        },
        include: {
          tags: true,
          owner: true,
        },
      });
      return task;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),
  getTaskHistoryPagination: teacherAboveProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        taskId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, taskId } = input;

      const _taskId = parseInt(taskId);

      try {
        const [taskHistory, amount] = await ctx.prisma.$transaction([
          ctx.prisma.task_histories.findMany({
            where: {
              tasksId: _taskId,
            },
            skip: page * limit,
            take: limit,
            include: {
              user: true,
            },
          }),
          ctx.prisma.task_histories.count({
            where: {
              tasksId: _taskId,
            },
          }),
        ]);

        return { taskHistory, pageCount: Math.ceil(amount / limit) };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getUserTaskStatus: TaAboveProcedure.input(
    z.object({
      student_id: z.string(),
      sectionId: z.string(),
      labId: z.number(),
    })
  ).query(async ({ ctx, input }) => {
    const { student_id, sectionId, labId } = input;
    const _sectionId = parseInt(sectionId);
    try {
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
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),

  searchTasks: teacherAboveProcedure
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
      try {
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
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),

  getTaskObjectRelation: teacherAboveProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
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
            section: {
              deleted_at: null,
            },
          },
        });

        const typingHistories = await ctx.prisma.typing_histories.findMany({
          where: {
            submission_id: {
              in: submissions.map(({ id }) => id),
            },
          },
          include: {
            submission: true,
          },
        });

        const relation: Relation = {
          summary: [
            { name: "Tasks", amount: 1 },
            { name: "Assignments", amount: task?.labs.length ?? 0 },
            { name: "Submissions", amount: typingHistories.length ?? 0 },
          ],
          object: [
            {
              name: "Task",
              data: [{ name: task?.name as string, data: [] }],
            },
            {
              name: "Assignments",
              data:
                task?.labs.map((lab) => ({ name: lab.name, data: [] })) ?? [],
            },
            {
              name: "Submissions",
              data: typingHistories.map(({ created_at, submission }) => {
                const { user_id, section_id } = submission;
                return {
                  name: `Submitted at ${created_at} by user-id:${user_id} sec-id:${section_id}`,
                  data: [],
                };
              }),
            },
          ],
        };

        return relation;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
