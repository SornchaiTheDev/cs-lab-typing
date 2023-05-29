import { teacherProcedure, router } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteLabRouter = router({
  deleteLab: teacherProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const requester = ctx.user.full_name;
      let lab;
      try {
        lab = await ctx.prisma.labs.delete({
          where: {
            name,
          },
        });

        await ctx.prisma.lab_history.create({
          data: {
            action: "Delete section",
            user: {
              connect: {
                full_name: requester,
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
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return lab;
    }),
  deleteTaskFromLab: teacherProcedure
    .input(z.object({ labId: z.number(), taskId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { labId, taskId } = input;
      const requester = ctx.user.full_name;
      
      try {
        await ctx.prisma.labs.update({
          where: {
            id: labId,
          },
          data: {
            tasks: {
              disconnect: {
                id: taskId,
              },
            },
            history: {
              create: {
                action: "Delete task from lab",
                user: {
                  connect: {
                    full_name: requester,
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
