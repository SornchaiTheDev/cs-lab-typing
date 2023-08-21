import type { submission_type } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { calculateErrorPercentage } from "~/components/Typing/utils/calculateErrorPercentage";
import { calculateTypingSpeed } from "~/components/Typing/utils/calculateWPM";
import { getDuration } from "~/components/Typing/utils/getDuration";
import { router, authedProcedure } from "~/server/api/trpc";
import {
  TypingResultWithHashSchema,
  TypingExamResultWithHashSchema,
} from "~/schemas/TypingResult";
import { checkSameHash } from "~/server/utils/checkSameHash";
import { evaluate } from "~/helpers/evaluateTypingScore";

export const createFrontRouter = router({
  submitTyping: authedProcedure
    .input(TypingResultWithHashSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        sectionId,
        labId,
        taskId,
        totalChars,
        errorChar,
        startedAt,
        endedAt,
        hash,
      } = input;
      const result = Object.assign({}, input);

      delete result.hash;

      if (!checkSameHash(result, hash as string)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "INVALID_INPUT",
        });
      }

      const _sectionId = parseInt(sectionId);
      const _labId = parseInt(labId);
      const _taskId = parseInt(taskId);

      try {
        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: _sectionId,
          },
          include: {
            labs_status: {
              where: {
                labId: _labId,
              },
            },
          },
        });

        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
        });

        const isSectionClose = section?.active === false;
        const isLabClose =
          !lab?.active ||
          section?.labs_status.some((lab) =>
            ["DISABLED", "READONLY"].includes(lab.status)
          );

        if (isSectionClose || isLabClose) {
          throw new Error("INTERNAL_SERVER_ERROR");
        }

        const duration = getDuration(startedAt as Date, endedAt as Date);
        const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
          totalChars,
          errorChar,
          duration.minutes
        );

        const errorPercentage = calculateErrorPercentage(totalChars, errorChar);

        const score = evaluate(adjustedSpeed, errorPercentage);

        const student_id = ctx.session?.user?.student_id;

        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id,
            deleted_at: null,
          },
        });

        let status: submission_type = "FAILED";
        if (errorPercentage <= 3) {
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
                  id: hash as string,
                  raw_speed: rawSpeed,
                  adjusted_speed: adjustedSpeed,
                  started_at: startedAt,
                  ended_at: endedAt,
                  percent_error: errorPercentage,
                  score,
                },
              },
            },
            update: {
              status: status,
              task_type: "Typing",
              typing_histories: {
                create: {
                  id: hash as string,
                  raw_speed: rawSpeed,
                  adjusted_speed: adjustedSpeed,
                  started_at: startedAt,
                  ended_at: endedAt,
                  percent_error: errorPercentage,
                  score,
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
  examSubmitTyping: authedProcedure
    .input(TypingExamResultWithHashSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        dInoitces: sectionId,
        dIbal: labId,
        dIksat: taskId,
        srahClatot: totalChars,
        rahCrorre: errorChar,
        tAdetrats: startedAt,
        tAdedne: endedAt,
        hsah: hash,
      } = input;
      const result = Object.assign({}, input);

      delete result.hsah;

      if (!checkSameHash(result, hash as string)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "INVALID_INPUT",
        });
      }

      const _sectionId = parseInt(sectionId);
      const _labId = parseInt(labId);
      const _taskId = parseInt(taskId);

      const student_id = ctx.session?.user?.student_id;

      try {
        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: _sectionId,
          },
          include: {
            labs_status: {
              where: {
                labId: _labId,
              },
            },
          },
        });

        const lab = await ctx.prisma.labs.findUnique({
          where: {
            id: _labId,
          },
        });

        const isSectionClose = section?.active === false;
        const isLabClose =
          !lab?.active ||
          section?.labs_status.some((lab) =>
            ["DISABLED", "READONLY"].includes(lab.status)
          );

        if (isSectionClose || isLabClose) {
          throw new Error("INTERNAL_SERVER_ERROR");
        }

        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id,
            deleted_at: null,
          },
        });

        const duration = getDuration(startedAt as Date, endedAt as Date);
        const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
          totalChars,
          errorChar,
          duration.minutes
        );

        const errorPercentage = calculateErrorPercentage(totalChars, errorChar);

        const score = evaluate(adjustedSpeed, errorPercentage);

        let status: submission_type = "FAILED";
        if (errorPercentage <= 3) {
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
                  id: hash as string,
                  raw_speed: rawSpeed,
                  adjusted_speed: adjustedSpeed,
                  started_at: startedAt,
                  ended_at: endedAt,
                  percent_error: errorPercentage,
                  score,
                },
              },
            },
            update: {
              status: status,
              task_type: "Typing",
              typing_histories: {
                create: {
                  id: hash as string,
                  raw_speed: rawSpeed,
                  adjusted_speed: adjustedSpeed,
                  started_at: startedAt,
                  ended_at: endedAt,
                  percent_error: errorPercentage,
                  score,
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
