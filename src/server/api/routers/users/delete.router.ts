import { router, teacherProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const deleteUserRouter = router({
  deleteUser: teacherProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      await await ctx.prisma.users.delete({
        where: {
          email,
        },
      });
      return "Success";
    }),
});
