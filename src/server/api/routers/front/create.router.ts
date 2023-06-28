import type { submission_type } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { router, authedProcedure } from "~/server/api/trpc";
import { getVerifyStatus } from "~/server/utils/verifyTurnstileToken";

export const createFrontRouter = router({
  submitTyping: authedProcedure
    .input(
      z.object({
        sectionId: z.string(),
        labId: z.string(),
        taskId: z.string(),
        rawSpeed: z.number(),
        adjustedSpeed: z.number(),
        startedAt: z.date(),
        endedAt: z.date(),
        percentError: z.number(),
        token: z.string(),
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
        token,
      } = input;

      try {
        const status = await getVerifyStatus(token);
        if (status === "FAILED") {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }

      const _sectionId = parseInt(sectionId);
      const _labId = parseInt(labId);
      const _taskId = parseInt(taskId);

      const full_name = ctx.session?.user?.full_name;
      try {
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
          await ctx.prisma.submissions.upsert({
            where: {
              user_id_task_id_section_id_lab_id: {
                user_id: user.id,
                section_id: _sectionId,
                lab_id: _labId,
                task_id: _taskId,
              },
            },
            create: {
              section: {
                connect: {
                  id: _sectionId,
                },
              },
              lab: {
                connect: {
                  id: _labId,
                },
              },
              task: {
                connect: {
                  id: _taskId,
                },
              },
              user: {
                connect: {
                  id: user.id,
                },
              },
              status,
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
          });

          await ctx.prisma.tasks.update({
            where: {
              id: _taskId,
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
                      id: _sectionId,
                    },
                  },
                },
              },
            },
          });
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
