import { TRPCError } from "@trpc/server";
import { router, authedProcedure } from "~/server/api/trpc";
import { checkSameHash } from "~/server/utils/checkSameHash";
import {
  TypingExamResultWithHashSchema,
  TypingResultWithHashSchema,
} from "~/schemas/TypingResult";
import { saveSubmission } from "./saveSubmission";

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

      try {
        await saveSubmission({
          endedAt,
          errorChar,
          totalChars,
          hash,
          ip: ctx.ip as string,
          labId,
          sectionId,
          startedAt,
          student_id: ctx.session?.user?.student_id as string,
          taskId,
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "ALREADY_CLOSED") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "ALREADY_CLOSED",
            });
          }
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

      try {
        await saveSubmission({
          endedAt,
          errorChar,
          totalChars,
          hash,
          ip: ctx.ip as string,
          labId,
          sectionId,
          startedAt,
          student_id: ctx.session?.user?.student_id as string,
          taskId,
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "ALREADY_CLOSED") {
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "ALREADY_CLOSED",
            });
          }
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
