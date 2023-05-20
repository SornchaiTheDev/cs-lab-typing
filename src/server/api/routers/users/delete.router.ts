import { router, adminProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const deleteUserRouter = router({
  deleteUser: adminProcedure
    .input(
      z.object({
        email: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      await await ctx.prisma.users.update({
        where: {
          email,
        },
        data: {
          deleted_at: new Date(),
        },
      });
      return "Success";
    }),
});
