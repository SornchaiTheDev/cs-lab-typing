import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteLabRouter = router({
  deleteLab: teacherAboveProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const requester = ctx.user.student_id;
      let lab;
      try {
        const fetchLab = await ctx.prisma.labs.findUnique({
          where: {
            id,
          },
        });

        if (fetchLab?.deleted_at !== null) {
          throw new Error("ALREADY_DELETE");
        }

        lab = await ctx.prisma.labs.delete({
          where: {
            id,
          },
        });

        await ctx.prisma.labs_status.deleteMany({
          where: {
            labId: id,
          },
        });

        const sections = await ctx.prisma.sections.findMany({
          where: {
            labs: {
              some: {
                id,
              },
            },
          },
        });

        for (const section of sections) {
          await ctx.prisma.sections.update({
            where: {
              id: section.id,
            },
            data: {
              labs: {
                disconnect: {
                  id,
                },
              },
              labs_order: {
                set: section.labs_order.filter((labId) => labId !== id),
              },
            },
          });
        }

        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        await ctx.prisma.lab_histories.create({
          data: {
            action: "Delete lab",
            user: {
              connect: {
                id: user?.id,
              },
            },
            lab: {
              connect: {
                id: lab.id,
              },
            },
          },
        });
        if (!lab) {
          return null;
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "ALREADY_DELETE") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "ALREADY_DELETE",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return lab;
    }),
  deleteTaskFromLab: teacherAboveProcedure
    .input(z.object({ labId: z.string(), taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { labId, taskId } = input;
      const requester = ctx.user.student_id;
      const _labId = parseInt(labId);

      try {
        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
          include: {
            tasks: true,
          },
        });
        if (!lab) {
          throw new Error("Lab not found");
        }

        const filteredTasks = lab.tasks
          .filter((task) => task.id !== taskId)
          .map((task) => task.id);

        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        await ctx.prisma.labs.update({
          where: {
            id: _labId,
          },
          data: {
            tasks: {
              disconnect: {
                id: taskId,
              },
            },
            tasks_order: {
              set: filteredTasks,
            },
            history: {
              create: {
                action: "Delete task from lab",
                user: {
                  connect: {
                    id: user?.id,
                  },
                },
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
