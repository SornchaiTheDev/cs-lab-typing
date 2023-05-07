import { router, adminProcedure } from "@/server/trpc";
import { z } from "zod";
import { deleteStudent } from "./role/student";

export const deleteUserRouter = router({
  deleteUser: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      await deleteStudent(ctx.prisma, id);
      return "Success";
    }),
});
