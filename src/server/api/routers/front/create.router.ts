import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, authedProcedure } from "~/server/api/trpc";

export const createFrontRouter = router({
  submitTyping: authedProcedure
    .input(
      z.object({
        sectionId: z.number(),
        taskId: z.number(),
        rawSpeed: z.number(),
        adjustedSpeed: z.number(),
        startedAt: z.date(),
        endedAt: z.date(),
        percentError: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const {
        sectionId,
        taskId,
        rawSpeed,
        adjustedSpeed,
        startedAt,
        endedAt,
        percentError,
      } = input;
      const full_name = ctx.session?.user?.full_name;
      const user = await ctx.prisma.users.findUnique({
        where: {
          full_name,
        },
      });
      if (user) {
        await ctx.prisma.users.update({
          where: {
            full_name,
          },
          data: {
            submissions: {
              upsert: {
                where: {
                  user_id_task_id_section_id: {
                    user_id: user.id,
                    section_id: sectionId,
                    task_id: taskId,
                  },
                },
                create: {
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
                  status: "Passed",
                  task_type: "Typing",
                  typing_histories: {
                    create: {
                      raw_speed: rawSpeed,
                      adjusted_speed: adjustedSpeed,
                      started_at: startedAt,
                      ended_at: endedAt,
                      percent_error: percentError,
                    },
                  },
                },
                update: {
                  status: "Passed",
                  task_type: "Typing",
                  typing_histories: {
                    create: {
                      raw_speed: rawSpeed,
                      adjusted_speed: adjustedSpeed,
                      started_at: startedAt,
                      ended_at: endedAt,
                      percent_error: percentError,
                    },
                  },
                },
              },
            },
          },
        });
      }

      // typing_history: {
      //   create: {
      //     raw_speed: rawSpeed,
      //     adjusted_speed: adjustedSpeed,
      //     started_at: startedAt,
      //     ended_at: endedAt,
      //     percent_error: percentError,
      //   },
      try {
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
