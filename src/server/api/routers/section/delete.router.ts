import { router, adminProcedure, teacherProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteSectionsRouter = router({
  deleteSection: adminProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { name } = input;
      const requester = ctx.user.full_name;
      try {
        const section = await ctx.prisma.sections.delete({
          where: {
            name,
          },
        });

        await ctx.prisma.section_histories.create({
          data: {
            action: "Delete section",
            user: {
              connect: {
                full_name: requester,
              },
            },
            section: {
              connect: {
                id: section.id,
              },
            },
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return "Success";
    }),
  deleteStudent: teacherProcedure
    .input(
      z.object({
        student_id: z.string(),
        sectionId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sectionId, student_id } = input;

      await ctx.prisma.sections.update({
        where: {
          id: sectionId,
        },
        data: {
          students: {
            disconnect: {
              student_id,
            },
          },
          history: {
            create: {
              action: "Delete student from this section",
              user: {
                connect: {
                  full_name: ctx.user.full_name,
                },
              },
            },
          },
        },
      });
    }),
});
