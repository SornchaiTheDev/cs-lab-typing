import { router, adminProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteSemesterRouter = router({
  deleteSemester: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;

      try {
        await ctx.prisma.semesters.delete({
          where: {
            id,
          },
        });

        await ctx.prisma.sections.deleteMany({
          where: {
            semester: {
              id,
            },
          },
        });

        return "Success";
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
