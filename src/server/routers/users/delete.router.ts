import { router, adminProcedure } from "@/server/trpc";
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
      await await ctx.prisma.users.delete({
        where: {
          email,
        },
      });
      return "Success";
    }),
});
