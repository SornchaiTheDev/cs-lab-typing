import { TRPCError } from "@trpc/server";
import { router, authedAndRelateToSectionProcedure } from "~/server/api/trpc";
import { checkSameHash } from "~/utils/checkSameHash";
import {
  ExamTypingResultWithHashSchema,
  TypingResultWithHashSchema,
  type TypingResultWithHashType,
} from "~/schemas/TypingResult";
import { saveSubmission } from "./saveSubmission";
import type { Context } from "~/server/context";

export const createFrontRouter = router({
  submitTyping: authedAndRelateToSectionProcedure
    .input(TypingResultWithHashSchema)
    .mutation(async ({ ctx, input }) => {
      const result = Object.assign({}, input);

      delete result.hash;

      if (!checkSameHash(result, input.hash as string)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "INVALID_INPUT",
        });
      }
      processRequest(ctx, input);
    }),
  submitExamTyping: authedAndRelateToSectionProcedure
    .input(ExamTypingResultWithHashSchema)
    .mutation(async ({ ctx, input }) => {
      const {
        liame: email,
        dInoitces: sectionId,
        dIbal: labId,
        dIksat: taskId,
        tAdetrats: startedAt,
        tAdedne: endedAt,
        hsah: hash,
        sekortSyek: keyStrokes,
      } = input;

      const result = Object.assign({}, input);

      delete result.hsah;

      if (!checkSameHash(result, hash as string)) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "INVALID_INPUT",
        });
      }

      processRequest(ctx, {
        sectionId,
        labId,
        taskId,
        startedAt,
        endedAt,
        hash,
        keyStrokes,
        email,
      });
    }),
});

const processRequest = async (
  ctx: Context,
  input: TypingResultWithHashType
) => {
  const { endedAt, hash, labId, sectionId, startedAt, taskId, keyStrokes } =
    input;

  try {
    await saveSubmission({
      endedAt,
      hash,
      ip: ctx.ip as string,
      labId,
      sectionId,
      startedAt,
      student_id: ctx.session?.user?.student_id as string,
      taskId,
      keyStrokes,
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
};
