import { teacherProcedure, router } from "~/server/api/trpc";

export const getTagRouter = router({
  getTags: teacherProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tags.findMany();
    return tags;
  }),
});
