import { AddSectionSchema } from "~/forms/SectionSchema";
import { adminProcedure, router, teacherProcedure } from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const updateSectionsRouter = router({
  updateSection: teacherProcedure
    .input(AddSectionSchema.and(z.object({ id: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { id, instructors, name, semester, tas, note, active } = input;
      const year = semester.split("/")[0] ?? "";
      const term = semester.split("/")[1] ?? "";
      const requester = ctx.user.full_name;
      try {
        await ctx.prisma.sections.update({
          where: {
            id,
          },
          data: {
            active,
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
              set: instructors.map((instructor) => ({
                full_name: instructor,
              })),
            },
            tas: {
              set: tas ? tas.map((ta) => ({ full_name: ta })) : [],
            },
            history: {
              create: {
                action: "Update section",
                user: {
                  connect: {
                    full_name: requester,
                  },
                },
              },
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
  addLab: teacherProcedure
    .input(
      z.object({
        sectionId: z.number(),
        labId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { labId, sectionId } = input;
      const requester = ctx.user.full_name;
      try {
        await ctx.prisma.sections.update({
          where: {
            id: sectionId,
          },
          data: {
            labs: {
              connect: {
                id: labId,
              },
            },
            labs_order: {
              push: labId,
            },
            history: {
              create: {
                action: "Add lab",
                user: {
                  connect: {
                    full_name: requester,
                  },
                },
              },
            },
            labs_status: {
              create: {
                labs: {
                  connect: {
                    id: labId,
                  },
                },
                status: "ACTIVE",
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
  updateLabOrder: teacherProcedure
    .input(
      z.object({
        sectionId: z.number(),
        order: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sectionId, order } = input;
      const requester = ctx.user.full_name;

      try {
        await ctx.prisma.sections.update({
          where: {
            id: sectionId,
          },
          data: {
            labs_order: {
              set: order,
            },
            history: {
              create: {
                action: "Re-order lab",
                user: {
                  connect: {
                    full_name: requester,
                  },
                },
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
  updateLabStatus: teacherProcedure
    .input(
      z.object({
        sectionId: z.number(),
        labId: z.number(),
        status: z
          .literal("ACTIVE")
          .or(z.literal("READONLY"))
          .or(z.literal("DISABLED")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sectionId, labId, status } = input;
      try {
        await ctx.prisma.labs_status.update({
          where: {
            labId_sectionId: {
              labId,
              sectionId,
            },
          },
          data: {
            status,
          },
        });
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
