import {
  router,
  teacherAboveAndRelatedToSectionProcedure,
  taAboveAndRelatedToSectionProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const deleteSectionsRouter = router({
  deleteSection: teacherAboveAndRelatedToSectionProcedure
    .input(
      z.object({
        sectionId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sectionId } = input;
      const requester = ctx.user.student_id;
      try {
        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: sectionId,
          },
          include: {
            created_by: true,
          },
        });
        if (section?.created_by.student_id !== requester) {
          throw new Error("UNAUTHORIZED");
        }

        await ctx.prisma.sections.delete({
          where: {
            id: sectionId,
          },
        });

        await ctx.prisma.sections.update({
          where: {
            id: sectionId,
          },
          data: {
            labs: {
              set: [],
            },
            labs_order: {
              set: [],
            },
            labs_status: {
              deleteMany: {
                sectionId,
              },
            },
            submissions: {
              deleteMany: {},
            },
          },
        });

        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        await ctx.prisma.section_histories.create({
          data: {
            action: "Delete section",
            user: {
              connect: {
                id: user?.id,
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
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      }
      return "Success";
    }),
  deleteStudent: teacherAboveAndRelatedToSectionProcedure
    .input(
      z.object({
        id: z.number(),
        sectionId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sectionId, id } = input;
      const _sectionId = parseInt(sectionId);
      const requester = ctx.user.student_id;
      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });
        await ctx.prisma.sections.update({
          where: {
            id: _sectionId,
          },
          data: {
            students: {
              disconnect: {
                id,
              },
            },
            history: {
              create: {
                action: "Delete student from this section",
                user: {
                  connect: {
                    id: user?.id,
                  },
                },
              },
            },
          },
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  deleteLab: taAboveAndRelatedToSectionProcedure
    .input(
      z.object({
        sectionId: z.string(),
        labId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { labId, sectionId } = input;
      const _sectionId = parseInt(sectionId);

      const requester = ctx.user.student_id;
      try {
        const user = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
            deleted_at: null,
            instructors: {
              some: {
                id: _sectionId,
                instructors: {
                  some: {
                    student_id: requester,
                  },
                },
              },
            },
          },
          select: {
            id: true,
          },
        });

        if (!user) throw new Error("UNAUTHORIZED");

        const section = await ctx.prisma.sections.findUnique({
          where: {
            id: _sectionId,
          },
        });

        const newOrder = section?.labs_order.filter((lab) => lab !== labId);

        await ctx.prisma.sections.update({
          where: {
            id: _sectionId,
          },
          data: {
            labs: {
              disconnect: {
                id: labId,
              },
            },
            labs_order: {
              set: newOrder,
            },
            history: {
              create: {
                action: "Remove lab",
                user: {
                  connect: {
                    id: user?.id,
                  },
                },
              },
            },
            labs_status: {
              deleteMany: {
                labId,
                sectionId: _sectionId,
              },
            },
          },
        });
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
      return "Success";
    }),
});
