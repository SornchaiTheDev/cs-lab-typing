import { router, teacherProcedure } from "~/server/api/trpc";
import { z } from "zod";
import type { submission_type, tasks } from "@prisma/client";

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
          sections: true,
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
          tasks: true,
          history: {
            include: {
              user: true,
            },
          },
        },
      });

      if (lab) {
        const sortedTaskLab = lab.tasks_order.map((id) => {
          const task = lab?.tasks.find((task) => task.id === id) as tasks;
          return task;
        });

        return { ...lab, tasks: sortedTaskLab };
      }

      return null;
    }),

  getLabStatus: teacherProcedure
    .input(z.object({ sectionId: z.number(), labId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { sectionId, labId } = input;

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
              id: sectionId,
            },
          },
        },
        select: {
          submissions: {
            where: {
              lab_id: labId,
              section_id: sectionId,
            },
            select: {
              task_id: true,
              status: true,
            },
          },
          full_name: true,
          student_id: true,
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
      return { usersTaskStatus, taskLength };
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
