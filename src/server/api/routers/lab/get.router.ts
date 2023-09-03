import {
  TaAboveProcedure,
  router,
  teacherAboveProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import type { tasks } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import {
  isUserInThisCourse,
  isUserInThisSection,
} from "~/server/utils/checkUser";

export const getLabRouter = router({
  getLabPagination: teacherAboveProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().optional(),
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, courseId, search } = input;
      try {
        await isUserInThisCourse(ctx.user.student_id, parseInt(courseId));
        const [labs, amount] = await ctx.prisma.$transaction([
          ctx.prisma.labs.findMany({
            where: {
              courseId: parseInt(courseId),
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  tags: {
                    some: {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            },
            orderBy: {
              created_at: "asc",
            },
            skip: page * limit,
            take: limit,
            include: {
              tags: {
                select: {
                  name: true,
                },
              },
            },
          }),
          ctx.prisma.labs.count({
            where: {
              courseId: parseInt(courseId),
              OR: [
                {
                  name: {
                    contains: search,
                    mode: "insensitive",
                  },
                },
                {
                  tags: {
                    some: {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  },
                },
              ],
            },
            orderBy: {
              created_at: "asc",
            },
          }),
        ]);

        return { labs, pageCount: Math.ceil(amount / limit) };
      } catch (err) {
        if (err instanceof Error) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "UNAUTHORIZED",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getLabsInfiniteScroll: TaAboveProcedure.input(
    z.object({
      limit: z.number().default(10),
      cursor: z.number().nullish(),
      search: z.string().optional(),
      tags: z.array(z.number()),
      courseId: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const { courseId, cursor, limit, search, tags } = input;

    const hasTags = tags.length > 0;
    try {
      await isUserInThisCourse(ctx.user.student_id, parseInt(courseId));
      const labs = await ctx.prisma.labs.findMany({
        where: {
          deleted_at: null,
          courseId: parseInt(courseId),
          name: {
            contains: search,
            mode: "insensitive",
          },
          tags: hasTags
            ? {
                some: {
                  id: {
                    in: tags,
                  },
                },
              }
            : undefined,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          created_at: "asc",
        },
        include: {
          sections: true,
          tags: {
            select: {
              name: true,
            },
          },
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (labs.length > limit) {
        const nextItem = labs.pop();
        nextCursor = nextItem?.id;
      }

      return { labs, nextCursor };
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "UNAUTHORIZED") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "UNAUTHORIZED",
          });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),
  getLabById: TaAboveProcedure.input(
    z.object({ labId: z.string(), courseId: z.string() })
  ).query(async ({ ctx, input }) => {
    const { labId, courseId } = input;
    const _labId = parseInt(labId);
    try {
      await isUserInThisCourse(ctx.user.student_id, parseInt(courseId));

      const lab = await ctx.prisma.labs.findFirst({
        where: {
          id: _labId,
          courseId: parseInt(courseId),
          deleted_at: null,
        },
        include: {
          tags: true,
          tasks: true,
        },
      });

      if (!lab) {
        throw new Error("UNAUTHORIZED");
      }
      const sortedTaskLab = lab.tasks_order.map((id) => {
        const task = lab?.tasks.find((task) => task.id === id) as tasks;
        return task;
      });

      return { ...lab, tasks: sortedTaskLab };
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "UNAUTHORIZED") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "UNAUTHORIZED",
          });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),

  getLabHistoryPagination: teacherAboveProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        courseId: z.string(),
        labId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, labId, courseId } = input;

      const _labId = parseInt(labId);

      try {
        await isUserInThisCourse(ctx.user.student_id, parseInt(courseId));
        const [labHistory, amount] = await ctx.prisma.$transaction([
          ctx.prisma.lab_histories.findMany({
            where: {
              labId: _labId,
            },
            skip: page * limit,
            take: limit,
            include: {
              user: true,
            },
          }),
          ctx.prisma.lab_histories.count({
            where: {
              labId: _labId,
            },
          }),
        ]);

        return { labHistory, pageCount: Math.ceil(amount / limit) };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),

  getLabStatus: TaAboveProcedure.input(
    z.object({ sectionId: z.string(), labId: z.number() })
  ).query(async ({ ctx, input }) => {
    const { sectionId, labId } = input;
    const _sectionId = parseInt(sectionId);
    try {
      await isUserInThisSection(ctx.user.student_id, _sectionId);
      const lab = await ctx.prisma.labs.findUnique({
        where: {
          id: labId,
        },
        select: {
          tasks_order: true,
        },
      });

      const users = await ctx.prisma.users.findMany({
        where: {
          students: {
            some: {
              id: _sectionId,
              deleted_at: null,
            },
          },
        },
        select: {
          submissions: {
            where: {
              lab_id: labId,
              section_id: _sectionId,
            },
            select: {
              task_id: true,
              status: true,
              typing_histories: true,
            },
          },
          full_name: true,
          student_id: true,
        },
        orderBy: {
          student_id: "asc",
        },
      });

      const usersTaskStatus = users.map((user) => {
        const taskStatus =
          lab?.tasks_order.map((order) => {
            const submission = user.submissions.find(
              (submission) => submission.task_id === order
            );

            return submission?.status ?? "NOT_SUBMITTED";
          }) ?? [];
        return { ...user, taskStatus };
      });
      const taskLength = lab?.tasks_order.length ?? 0;
      const taskOrder = lab?.tasks_order ?? [];
      return { usersTaskStatus, taskLength, taskOrder };
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "UNAUTHORIZED") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "UNAUTHORIZED",
          });
        }
      }
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),

  getLabTaskSubmissions: TaAboveProcedure.input(
    z.object({ labId: z.number(), sectionId: z.string() })
  ).query(async ({ input, ctx }) => {
    const { labId, sectionId } = input;

    try {
      await isUserInThisSection(ctx.user.student_id, parseInt(sectionId));

      const lab = await ctx.prisma.labs.findUnique({
        where: {
          id: labId,
        },
        select: {
          tasks_order: true,
        },
      });

      const taskOrder = lab?.tasks_order ?? [];

      const tasks = [];

      for (const order of taskOrder) {
        const users = await ctx.prisma.users.findMany({
          where: {
            submissions: {
              some: {
                lab_id: labId,
                section_id: parseInt(sectionId),
                task_id: order,
              },
            },
          },
          include: {
            submissions: {
              where: {
                lab_id: labId,
                section_id: parseInt(sectionId),
                task_id: order,
              },
              select: {
                typing_histories: {
                  orderBy: {
                    score: "desc",
                  },
                  take: 1,
                },
              },
            },
          },
          orderBy: {
            student_id: "asc",
          },
        });

        const taskSubmissions = users
          .map(({ submissions, student_id }) =>
            submissions
              .map(({ typing_histories }) =>
                typing_histories
                  .map((typing_history) => ({
                    ...typing_history,
                    student_id,
                    task_id: order,
                  }))
                  .flat()
              )
              .flat()
          )
          .flat();

        tasks.push(taskSubmissions);
      }

      return { taskOrder, tasks };
    } catch (err) {
      if (err instanceof Error) {
        if (err.message === "UNAUTHORIZED") {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "UNAUTHORIZED",
          });
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }
  }),

  getLabObjectRelation: teacherAboveProcedure
    .input(z.object({ labId: z.string(), courseId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { labId, courseId } = input;
      try {
        await isUserInThisCourse(ctx.user.student_id, parseInt(courseId));
        const lab = await ctx.prisma.labs.findFirst({
          where: {
            id: parseInt(labId),
            courseId: parseInt(courseId),
          },
          include: {
            tasks: {
              include: {
                submissions: {
                  where: {
                    lab_id: parseInt(labId),
                  },
                },
              },
            },
          },
        });

        if (!lab) {
          throw new Error("UNAUTHORIZED");
        }

        const assignmentLength = lab?.tasks.length ?? 0;

        const submissionLength =
          lab?.tasks.reduce(
            (prev, curr) => prev + curr.submissions.length,
            0
          ) ??
          0 ??
          0;

        const relation = {
          summary: [
            { name: "Labs", amount: 1 },
            { name: "Assignments", amount: assignmentLength },
            { name: "Submissions", amount: submissionLength },
          ],
          object: [
            {
              name: "Labs",
              data: [{ name: lab?.name as string, data: [] }],
            },
            {
              name: "Assignments",
              data:
                lab?.tasks.map(({ name, submissions }) => ({
                  name,
                  data:
                    submissions.map(({ created_at, user_id, section_id }) => ({
                      name: `Submitted at ${created_at} by user-id:${user_id} sec-id:${section_id}`,
                      data: [],
                    })) ?? [],
                })) ?? [],
            },
          ],
        };

        return relation;
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
