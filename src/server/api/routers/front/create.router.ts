import { TRPCError } from "@trpc/server";
import { router, authedProcedure } from "~/server/api/trpc";
import { checkSameHash } from "~/server/utils/checkSameHash";
import { TypingResultWithHashSchema } from "~/schemas/TypingResult";
import { saveSubmission } from "./saveSubmission";

export const createFrontRouter = router({
  submitTyping: authedProcedure
    .input(TypingResultWithHashSchema)
    .mutation(async ({ ctx, input }) => {
      const { sectionId, labId, taskId, startedAt, endedAt, hash, keyStrokes } =
        input;
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
    }),
});
