import type { labs, tasks } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { findHighestSpeedAndScore } from "~/utils";
import {
  router,
  authedProcedure,
  TaAboveProcedure,
  authedAndRelateToSectionProcedure,
} from "~/server/api/trpc";
import { serialize } from "next-mdx-remote/serialize";
import remarkGfm from "remark-gfm";

export const getFrontRouter = router({
  getCheckUser: authedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.sections.findFirst({
      where: {
        deleted_at: null,
        instructors: {
          some: {
            student_id: ctx.user.student_id,
          },
        },
      },
    });
    return { isTaAbove: !!user };
  }),
  getSections: authedProcedure
    .input(z.object({ limit: z.number(), cursor: z.number().nullish() }))
    .query(async ({ ctx, input }) => {
      const { limit, cursor } = input;
      const student_id = ctx.session?.user?.student_id;

      try {
        const sections = await ctx.prisma.sections.findMany({
          where: {
            deleted_at: null,
            active: true,
            OR: [
              {
                closed_at: {
                  gt: new Date(),
                },
              },
              { closed_at: null },
            ],
            students: {
              some: {
                student_id,
                deleted_at: null,
              },
            },
          },
          select: {
            id: true,
            name: true,
            semester: {
              select: {
                year: true,
                term: true,
              },
            },
            course: {
              select: {
                id: true,
                number: true,
                name: true,
              },
            },
            type: true,
          },
          take: limit + 1,
          cursor: cursor ? { id: cursor } : undefined,
          orderBy: {
            id: "asc",
          },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (sections.length > limit) {
          const nextItem = sections.pop();
          nextCursor = nextItem?.id;
        }

        return { sections, nextCursor };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getTeachingSections: TaAboveProcedure.input(
    z.object({
      limit: z.number(),
      cursor: z.number().nullish(),
      semester: z.string(),
      sectionType: z
        .literal("All")
        .or(z.literal("Lesson"))
        .or(z.literal("Exam")),
    })
  ).query(async ({ ctx, input }) => {
    const { limit, cursor, semester, sectionType } = input;
    const term = semester.split(" ")[0];
    const year = semester.split(" ")[1];

    const student_id = ctx.session?.user?.student_id;

    const _sectionType = sectionType === "All" ? undefined : sectionType;

    try {
      const sections = await ctx.prisma.sections.findMany({
        where: {
          deleted_at: null,
          type: _sectionType,
          semester: {
            year,
            term,
          },
          active: true,
          instructors: {
            some: {
              student_id,
              deleted_at: null,
            },
          },
        },
        select: {
          id: true,
          name: true,
          semester: {
            select: {
              year: true,
              term: true,
            },
          },
          course: {
            select: {
              id: true,
              number: true,
              name: true,
            },
          },
          type: true,
        },
        take: limit + 1,
        cursor: cursor ? { id: cursor } : undefined,
        orderBy: {
          id: "asc",
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (sections.length > limit) {
        const nextItem = sections.pop();
        nextCursor = nextItem?.id;
      }

      return { sections, nextCursor };
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),
  getLabs: authedAndRelateToSectionProcedure
    .input(z.object({ sectionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { sectionId } = input;
      const student_id = ctx.user.student_id;
      const _sectionId = parseInt(sectionId);

      try {
        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: _sectionId,
          },
          select: {
            course: {
              select: {
                name: true,
              },
            },
            active: true,
            labs_status: {
              select: {
                labId: true,
                status: true,
              },
            },
            labs_order: true,
            labs: {
              select: {
                id: true,
                name: true,
                tasks_order: true,
                active: true,
              },
            },
            submissions: {
              where: {
                user: {
                  student_id,
                  deleted_at: null,
                },
              },
            },
          },
        });

        if (section) {
          const sortedLab = section.labs_order.map((id) => {
            const lab = section?.labs.find((lab) => lab.id === id) as labs;
            return lab;
          });

          const labsAddedSubmissionsAndStatus = sortedLab.map((lab) => {
            const tasksStatus = lab.tasks_order.map((taskId) => {
              const submission = section.submissions.find((submission) => {
                const isSameTask = submission.task_id === taskId;
                const isSameLab = submission.lab_id === lab.id;
                return isSameTask && isSameLab;
              });

              return submission?.status ?? "NOT_SUBMITTED";
            });

            const labStatus = section.labs_status.find(
              (status) => status.labId === lab.id
            )?.status;

            return { ...lab, tasksStatus, status: labStatus };
          });
          const returnObject = {
            labs: labsAddedSubmissionsAndStatus,
            active: section.active,
            courseName: section.course.name,
          };
          return returnObject;
        }
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
  getTasks: authedAndRelateToSectionProcedure
    .input(z.object({ sectionId: z.string(), labId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { labId, sectionId } = input;
      const _labId = parseInt(labId);
      const _sectionId = parseInt(sectionId);
      const student_id = ctx.user.student_id;
      try {
        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: _sectionId,
          },
          select: {
            labs: true,
            students: true,
            active: true,
            type: true,
          },
        });

        const isLabActive = section?.active;

        const isLabExistInSection = section?.labs.some(
          (lab) => lab.id === _labId
        );

        const isStudentInSection = section?.students.some(
          (student) => student.student_id === student_id
        );

        if (!isLabExistInSection || !isStudentInSection || !isLabActive) {
          throw new Error("NOT_FOUND");
        }

        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
          select: {
            active: true,
            course: {
              select: {
                name: true,
              },
            },
            status: {
              where: {
                sectionId: _sectionId,
              },
            },
            name: true,
            tasks_order: true,
            tasks: {
              select: {
                id: true,
                name: true,
                type: true,
              },
            },
            submissions: {
              where: {
                user: {
                  student_id,
                  deleted_at: null,
                },
                section: {
                  id: _sectionId,
                },
              },
            },
          },
        });

        if (lab) {
          const labStatus = lab.status.find(
            (status) => status.labId === _labId
          );

          const isLabSetDisabled =
            labStatus?.status === "DISABLED" || !lab.active;

          if (isLabSetDisabled) {
            throw new Error("NOT_FOUND");
          }

          const sortedTaskLab = lab.tasks_order.map((id) => {
            const task = lab?.tasks.find((task) => task.id === id) as tasks;
            if (!task) throw new Error("NOT_FOUND");
            const { name, type } = task;
            const status =
              lab.submissions.find(
                (submission) => submission.task_id === task.id
              )?.status ?? "NOT_SUBMITTED";
            return { id, name, type, status };
          });

          return {
            courseName: lab.course.name,
            labName: lab.name,
            tasks: sortedTaskLab,
            sectionType: section.type,
          };
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "NOT_FOUND") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "NOT_FOUND",
            });
          }
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
  getTaskById: authedAndRelateToSectionProcedure
    .input(
      z.object({ taskId: z.string(), labId: z.string(), sectionId: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const { taskId, labId, sectionId } = input;
      const _taskId = parseInt(taskId);
      const _labId = parseInt(labId);
      const _sectionId = parseInt(sectionId);

      const student_id = ctx.user.student_id;
      try {
        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: _sectionId,
          },
          select: {
            active: true,
            type: true,
            closed_at: true,
            course: {
              select: {
                name: true,
              },
            },
            labs: {
              where: {
                id: _labId,
              },
            },
            students: true,
          },
        });

        if (!section?.active || section.labs.length === 0) {
          throw new Error("NOT_FOUND");
        }

        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
          select: {
            name: true,
            active: true,
            status: {
              where: {
                sectionId: _sectionId,
              },
              take: 1,
            },
          },
        });

        if (!lab) {
          throw new Error("NOT_FOUND");
        }

        if (lab.status[0]?.status === "DISABLED" || !lab.active) {
          throw new Error("NOT_FOUND");
        }

        const task = await ctx.prisma.tasks.findUnique({
          where: {
            id: _taskId,
          },
          select: {
            deleted_at: true,
            labs: {
              where: {
                id: _labId,
              },
            },
            name: true,
            body: true,
          },
        });

        if (!task) {
          throw new Error("NOT_FOUND");
        }

        const isTaskNotInLab = task.labs.length === 0;
        const isTaskAlreadyDeleted = task.deleted_at !== null;

        if (isTaskAlreadyDeleted || isTaskNotInLab) {
          throw new Error("NOT_FOUND");
        }

        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        await ctx.prisma.lab_loggers.create({
          data: {
            type: "ACCESS",
            ip_address: ctx.ip as string,
            user: {
              connect: {
                id: user?.id,
              },
            },
            task: {
              connect: {
                id: _taskId,
              },
            },
            section: {
              connect: {
                id: _sectionId,
              },
            },
          },
        });

        const labStatus =
          lab.status.find((status) => status.sectionId === _sectionId)
            ?.status ?? "DISABLED";

        return {
          taskName: task.name,
          taskBody: task.body,
          courseName: section.course.name,
          labName: lab.name,
          labStatus,
          sectionType: section.type,
          closed_at: section.closed_at,
        };
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "NOT_FOUND") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "TASK_NOT_FOUND",
            });
          }
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
  getTypingHistory: authedAndRelateToSectionProcedure
    .input(
      z.object({
        taskId: z.string(),
        sectionId: z.string(),
        labId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { sectionId, taskId, labId } = input;

      const _sectionId = parseInt(sectionId);
      const _taskId = parseInt(taskId);
      const _labId = parseInt(labId);

      const student_id = ctx.user.student_id;
      try {
        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: _sectionId,
          },
          select: {
            type: true,
            labs: {
              where: {
                id: _labId,
              },
            },
            students: true,
          },
        });

        const isLabNotExist = section?.labs.length === 0;

        if (isLabNotExist) {
          throw new Error("NOT_FOUND");
        }

        const typingHistories = await ctx.prisma.typing_histories.findMany({
          where: {
            submission: {
              section_id: _sectionId,
              lab_id: _labId,
              user: {
                student_id,
                deleted_at: null,
              },
              task_id: _taskId,
            },
          },
          select: {
            id: true,
            raw_speed: true,
            adjusted_speed: true,
            percent_error: true,
            score: true,
            started_at: true,
            ended_at: true,
            created_at: true,
          },
          orderBy: {
            created_at: "desc",
          },
        });

        const highestScore = findHighestSpeedAndScore(typingHistories);

        const returnedTypingHistories = typingHistories.map((history) => {
          const {
            id,
            adjusted_speed,
            created_at,
            ended_at,
            percent_error,
            raw_speed,
            started_at,
            score,
          } = history;
          const typingHistory = {
            id,
            adjusted_speed,
            created_at,
            started_at,
            ended_at,
            percent_error,
            raw_speed,
          };
          if (section?.type === "Exam") {
            return {
              ...typingHistory,
              score,
            };
          }
          return typingHistory;
        });

        return {
          histories: returnedTypingHistories,
          highestScore,
        };
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "NOT_FOUND") {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "NOT_FOUND",
            });
          }
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

  getProblemDescription: authedAndRelateToSectionProcedure
    .input(
      z.object({ sectionId: z.string(), labId: z.string(), taskId: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const { labId, taskId } = input;

      try {
        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: parseInt(labId),
          },
          select: {
            tasks: {
              where: {
                id: parseInt(taskId),
              },
              select: {
                name: true,
                problem: {
                  select: {
                    description: true,
                  },
                },
              },
            },
          },
        });
        const serializedDescription = await serialize(
          lab?.tasks[0]?.problem?.description ?? "",
          {
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [],
            },
          }
        );
        return {
          name: lab?.tasks[0]?.name,
          description: serializedDescription,
        };
      } catch (err) {
        console.log(err);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
