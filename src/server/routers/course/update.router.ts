import { adminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateCoursesRouter = router({
  updateCourse: adminProcedure
    .input(
      z.object({
        id: z.number(),
        number: z.string(),
        name: z.string(),
        authors: z.array(z.string()),
        note: z.string().nullable(),
        comments: z.string().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, number, name, authors, note, comments } = input;
      try {
        await ctx.prisma.courses.update({
          where: {
            id,
          },
          data: {
            number,
            name,
            authors: {
              set: authors.map((author) => ({
                full_name: author,
              })),
            },
            note,
            comments,
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "EDIT_DUPLICATED_COURSE",
        });
      }
      return "Success";
    }),
});
