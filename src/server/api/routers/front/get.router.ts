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
            {
              OR: [
                {
                  students: {
                    some: {
                      full_name,
                    },
                  },
                },
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
    .input(z.object({ sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { sectionId } = input;
      const full_name = ctx.user.full_name;

      try {
        const labs = await ctx.prisma.sections.findUnique({
          where: {
            id: sectionId,
          },
          select: {
            course: {
              select: {
                name: true,
              },
            },
            labs_status: true,
            labs_order: true,
            labs: {
              include: {
                tasks: true,
              },
            },
            submissions: {
              where: {
                user: {
                  full_name,
                },
              },
            },
          },
        });

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
    .input(z.object({ sectionId: z.number(), labId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { labId, sectionId } = input;
      const full_name = ctx.user.full_name;
      try {
        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: labId,
          },
          select: {
            course: {
              select: {
                name: true,
              },
            },
            status: {
              where: {
                sectionId,
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
                  id: sectionId,
                },
              },
            },
          },
        });
        if (lab) {
          const labStatus = lab.status.find(
            (status) => status.sectionId === labId
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
      z.object({ taskId: z.number(), labId: z.number(), sectionId: z.number() })
    )
    .query(async ({ ctx, input }) => {
      const { taskId, labId, sectionId } = input;
      const full_name = ctx.user.full_name;
      try {
        const task = await ctx.prisma.tasks.findUnique({
          where: {
            id: taskId,
          },
          select: {
            name: true,
            body: true,
          },
        });

        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: labId,
          },
          select: {
            name: true,
            status: {
              where: {
                sectionId,
              },
            },
          },
        });

        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: sectionId,
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
                id: taskId,
              },
            },
            section: {
              connect: {
                id: sectionId,
              },
            },
          },
        });

        const labStatus = lab?.status.find(
          (status) => status.sectionId === sectionId
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
      z.object({ taskId: z.number(), sectionId: z.number(), labId: z.number() })
    )
    .query(async ({ ctx, input }) => {
      const { sectionId, taskId, labId } = input;
      const full_name = ctx.user.full_name;
      try {
        const typingHistories = await ctx.prisma.typing_histories.findMany({
          where: {
            submission: {
              section_id: sectionId,
              lab_id: labId,
              user: {
                full_name,
              },
              task_id: taskId,
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
