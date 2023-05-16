import { AddSectionSchema } from "@/forms/SectionSchema";
import { SemesterSchema } from "@/forms/SemesterSchema";
import { adminProcedure, router } from "@/server/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateSectionsRouter = router({
  updateSection: adminProcedure
    .input(AddSectionSchema.and(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { id, instructors, name, semester, tas, note } = input;
      const year = semester.split("/")[0];
      const term = semester.split("/")[1];

      try {
        await ctx.prisma.sections.update({
          where: {
            id,
          },
          data: {
            name,
            note,
            semester: {
              connect: {
                year_term: {
                  year,
                  term,
                },
              },
            },
            instructors: {
              connect: instructors.map((instructor) => ({
                full_name: instructor,
              })),
            },
            tas: {
              connect: tas.map((ta) => ({ full_name: ta })),
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SAME_YEAR_AND_TERM",
        });
      }
      return "Success";
    }),
});
