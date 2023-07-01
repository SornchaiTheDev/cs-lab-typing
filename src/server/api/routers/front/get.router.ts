import type { labs, tasks } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, authedProcedure } from "~/server/api/trpc";

export const getFrontRouter = router({
  getSections: authedProcedure.query(async ({ ctx }) => {
    const full_name = ctx.session?.user?.full_name;

    try {
      const sections = ctx.prisma.sections.findMany({
        where: {
          AND: [
            { deleted_at: null },
            { active: true },
            {
              OR: [
                {
                  students: {
                    some: {
                      full_name,
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          course: {
            select: {
              id: true,
              number: true,
              name: true,
            },
          },
        },
      });

      return sections;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),
  getTeachingSections: authedProcedure.query(async ({ ctx }) => {
    const full_name = ctx.session?.user?.full_name;

    try {
      const sections = ctx.prisma.sections.findMany({
        where: {
          AND: [
            { deleted_at: null },
            { active: true },
            {
              OR: [
                {
                  instructors: {
                    some: {
                      full_name,
                    },
                  },
                },
              ],
            },
          ],
        },
        include: {
          course: {
            select: {
              id: true,
              number: true,
              name: true,
            },
          },
        },
      });

      return sections;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),
  getLabs: authedProcedure
    .input(z.object({ sectionId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { sectionId } = input;
      const full_name = ctx.user.full_name;
      const _sectionId = parseInt(sectionId);

      try {
        const labs = await ctx.prisma.sections.findUnique({
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
            labs_status: true,
            labs_order: true,
            labs: {
              include: {
                tasks: true,
              },
            },
            students: true,
            submissions: {
              where: {
                user: {
                  full_name,
                },
              },
            },
          },
        });
        const isInSection = labs?.students.some(
          (student) => student.full_name === full_name
        );

        if (!isInSection) {
          throw new Error("NOT_FOUND");
        }

        if (labs) {
          const sortedLab = labs.labs_order.map((id) => {
            const lab = labs?.labs.find((lab) => lab.id === id) as labs;
            return lab;
          });

          const labsAddedSubmissionsAndStatus = sortedLab.map((lab) => {
            const tasksStatus = lab.tasks_order.map((taskId) => {
              const submission = labs.submissions.find(
                (submission) => submission.task_id === taskId
              );

              return submission?.status ?? "NOT_SUBMITTED";
            });

            const labStatus = labs.labs_status.find(
              (status) => status.labId === lab.id
            )?.status;

            return { ...lab, tasksStatus: tasksStatus, status: labStatus };
          });
          return { ...labs, labs: labsAddedSubmissionsAndStatus };
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getTasks: authedProcedure
    .input(z.object({ sectionId: z.string(), labId: z.string() }))
    .query(async ({ ctx, input }) => {
      const { labId, sectionId } = input;
      const _labId = parseInt(labId);
      const _sectionId = parseInt(sectionId);
      const full_name = ctx.user.full_name;
      try {
        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
          select: {
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
            tasks: true,
            submissions: {
              where: {
                user: {
                  full_name,
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
            (status) => status.sectionId === _labId
          );
          if (labStatus?.status === "DISABLED") return null;

          const sortedTaskLab = lab.tasks_order.map((id) => {
            const task = lab?.tasks.find((task) => task.id === id) as tasks;
            const status =
              lab.submissions.find(
                (submission) => submission.task_id === task.id
              )?.status ?? "NOT_SUBMITTED";
            return { ...task, status };
          });

          return {
            courseName: lab.course.name,
            labName: lab.name,
            tasks: sortedTaskLab,
          };
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getTaskById: authedProcedure
    .input(
      z.object({ taskId: z.string(), labId: z.string(), sectionId: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const { taskId, labId, sectionId } = input;
      const _taskId = parseInt(taskId);
      const _labId = parseInt(labId);
      const _sectionId = parseInt(sectionId);

      const full_name = ctx.user.full_name;
      try {
        const task = await ctx.prisma.tasks.findUnique({
          where: {
            id: _taskId,
          },
          select: {
            name: true,
            body: true,
          },
        });

        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
          select: {
            name: true,
            status: {
              where: {
                sectionId: _sectionId,
              },
            },
          },
        });

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
          },
        });

        await ctx.prisma.lab_loggers.create({
          data: {
            type: "ACCESS",
            ip_address: ctx.ip as string,
            user: {
              connect: {
                full_name,
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

        const labStatus = lab?.status.find(
          (status) => status.sectionId === _sectionId
        )?.status;
        return { task, lab, section, labStatus };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getTypingHistory: authedProcedure
    .input(
      z.object({ taskId: z.string(), sectionId: z.string(), labId: z.string() })
    )
    .query(async ({ ctx, input }) => {
      const { sectionId, taskId, labId } = input;

      const _sectionId = parseInt(sectionId);
      const _taskId = parseInt(taskId);
      const _labId = parseInt(labId);

      const full_name = ctx.user.full_name;
      try {
        const typingHistories = await ctx.prisma.typing_histories.findMany({
          where: {
            submission: {
              section_id: _sectionId,
              lab_id: _labId,
              user: {
                full_name,
              },
              task_id: _taskId,
            },
          },
          orderBy: {
            id: "desc",
          },
          take: 10,
        });

        return typingHistories;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
