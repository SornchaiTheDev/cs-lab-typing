import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { teacherAboveProcedure, router } from "~/server/api/trpc";

export const getTagRouter = router({
  getTags: teacherAboveProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ input, ctx }) => {
      const { name } = input;
      try {
        const tags = await ctx.prisma.tags.findMany({
          where: {
            name: {
              contains: name,
              mode: "insensitive",
            },
          },
          take: 10,
        });
        return tags;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
