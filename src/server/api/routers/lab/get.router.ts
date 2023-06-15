import { router, teacherProcedure } from "~/server/api/trpc";
import { z } from "zod";
import type { tasks } from "@prisma/client";

export const getLabRouter = router({
  getLabPagination: teacherProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, courseId } = input;

      const labs = await ctx.prisma.labs.findMany({
        where: {
          deleted_at: null,
          courseId: parseInt(courseId),
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
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const _id = parseInt(id);

      const lab = await ctx.prisma.labs.findFirst({
        where: {
          id: _id,
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
    .input(z.object({ sectionId: z.string(), labId: z.number() }))
    .query(async ({ ctx, input }) => {
      const { sectionId, labId } = input;
      const _sectionId = parseInt(sectionId);

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
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;

      const lab = await ctx.prisma.labs.findUnique({
        where: {
          id,
        },
        include: {
          submissions: true,
          tasks: {
            include: {
              submissions: true,
            },
          },
        },
      });

      const assignmentLength = lab?.tasks.length ?? 0;

      const submissionLength = lab?.submissions.length ?? 0;

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
    }),
});
