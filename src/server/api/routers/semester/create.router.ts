import { SemesterSchema } from "~/forms/SemesterSchema";
import { adminProcedure, router } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createSemesterRouter = router({
  createSemester: adminProcedure
    .input(SemesterSchema)
    .mutation(async ({ ctx, input }) => {
      const { startDate, term, year } = input;
      try {
        await ctx.prisma.semesters.create({
          data: {
            startDate,
            term,
            year,
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_SEMESTER",
              cause: "DUPLICATED_SEMESTER",
            });
          }
        }
      }
    }),
});
