import type { submission_type } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, authedProcedure } from "~/server/api/trpc";

export const createFrontRouter = router({
  submitTyping: authedProcedure
    .input(
      z.object({
        sectionId: z.number(),
        labId: z.number(),
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
        labId,
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

      let status: submission_type = "FAILED";
      if (percentError <= 3) {
        status = "PASSED";
      }

      if (user) {
        await ctx.prisma.users.update({
          where: {
            full_name,
          },
          data: {
            submissions: {
              upsert: {
                where: {
                  user_id_task_id_section_id_lab_id: {
                    user_id: user.id,
                    section_id: sectionId,
                    lab_id: labId,
                    task_id: taskId,
                  },
                },
                create: {
                  section: {
                    connect: {
                      id: sectionId,
                    },
                  },
                  lab: {
                    connect: {
                      id: labId,
                    },
                  },
                  task: {
                    connect: {
                      id: taskId,
                    },
                  },
                  status: status,
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
                  status: status,
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
        await ctx.prisma.tasks.update({
          where: {
            id: taskId,
          },
          data: {
            submission_count: {
              increment: 1,
            },
            lab_loggers: {
              create: {
                type: "SUBMIT",
                ip_address: ctx.ip as string,
                user: {
                  connect: {
                    id: user.id,
                  },
                },
                section: {
                  connect: {
                    id: sectionId,
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
