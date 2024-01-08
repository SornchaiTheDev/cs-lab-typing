import { router, teacherAboveProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { isRelateWithThisLab } from "~/utils/isRelateWithThisLab";

export const deleteLabRouter = router({
  deleteLab: teacherAboveProcedure
    .input(z.object({ labId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { labId } = input;
      const requester = ctx.user.student_id;
      let lab;
      try {
        await isRelateWithThisLab(requester, labId);
        const fetchLab = await ctx.prisma.labs.findUnique({
          where: {
            id: labId,
          },
        });

        if (fetchLab?.deleted_at !== null) {
          throw new Error("ALREADY_DELETE");
        }

        lab = await ctx.prisma.labs.delete({
          where: {
            id: labId,
          },
        });

        await ctx.prisma.labs_status.deleteMany({
          where: {
            labId,
          },
        });

        const sections = await ctx.prisma.sections.findMany({
          where: {
            labs: {
              some: {
                id: labId,
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
                  id: labId,
                },
              },
              labs_order: {
                set: section.labs_order.filter((_labId) => _labId !== labId),
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
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
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
        await isRelateWithThisLab(requester, _labId);

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
