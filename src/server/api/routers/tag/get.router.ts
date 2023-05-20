import { adminProcedure, router } from "~/server/api/trpc";

export const getTagRouter = router({
  getTags: adminProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tags.findMany();
    return tags;
  }),
});
