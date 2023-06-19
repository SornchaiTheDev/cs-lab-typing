import { TRPCError } from "@trpc/server";
import { teacherAboveProcedure, router } from "~/server/api/trpc";

export const getTagRouter = router({
  getTags: teacherAboveProcedure.query(async ({ ctx }) => {
    try {
      const tags = await ctx.prisma.tags.findMany();
      return tags;
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),
});
