import { router, teacherAboveProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteUserRouter = router({
  deleteUser: teacherAboveProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      try {
        await ctx.prisma.users.delete({
          where: {
            id,
          },
        });
        await ctx.prisma.users.update({
          where: {
            id,
          },
          data: {
            instructors: {
              set: [],
            },
            students: {
              set: [],
            },
            authors: {
              set: [],
            },
            created_sections: {
              set: [],
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
