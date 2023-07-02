import { SemesterSchema } from "~/schemas/SemesterSchema";
import { adminProcedure, router } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export const createSemesterRouter = router({
  createSemester: adminProcedure
    .input(SemesterSchema)
    .mutation(async ({ ctx, input }) => {
      const { startDate, term, year } = input;
      try {
        const semester = await ctx.prisma.semesters.findFirst({
          where: {
            year,
            term,
            startDate,
            deleted_at: null,
          },
        });
        if (semester) {
          throw new Error("DUPLICATE_SEMESTER");
        }
        await ctx.prisma.semesters.create({
          data: {
            startDate,
            term,
            year,
          },
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "DUPLICATE_SEMESTER") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_SEMESTER",
              cause: "DUPLICATED_SEMESTER",
            });
          }
        }
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      }
    }),
});
