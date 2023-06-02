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
                // {
                //   instructors: {
                //     some: {
                //       full_name,
                //     },
                //   },
                // },
                // {
                //   tas: {
                //     some: {
                //       full_name,
                //     },
                //   },
                // },
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
            labs_order: true,
            labs: true,
          },
        });

        if (labs) {
          const sortedLab = labs.labs_order.map((id) => {
            const lab = labs?.labs.find((lab) => lab.id === id) as labs;
            return lab;
          });
          return { ...labs, labs: sortedLab };
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getTasks: authedProcedure
    .input(z.object({ labId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { labId } = input;
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
            name: true,
            tasks_order: true,
            tasks: true,
          },
        });
        if (lab) {
          const sortedTaskLab = lab.tasks_order.map((id) => {
            const task = lab?.tasks.find((task) => task.id === id) as tasks;
            return task;
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
        return { task, lab, section };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getTypingHistory: authedProcedure
    .input(z.object({ taskId: z.number(), sectionId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { sectionId, taskId } = input;
      const full_name = ctx.user.full_name;
      try {
        const typingHistories = await ctx.prisma.typing_histories.findMany({
          where: {
            submission: {
              section_id: sectionId,
              user: {
                full_name,
              },
              task_id: taskId,
            },
          },
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
