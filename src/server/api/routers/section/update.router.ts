import { AddSectionSchema } from "~/schemas/SectionSchema";
import {
  TaAboveProcedure,
  router,
  teacherAboveProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { isArrayUnique } from "~/helpers";

export const updateSectionsRouter = router({
  updateSection: teacherAboveProcedure
    .input(AddSectionSchema.and(z.object({ id: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { id, instructors, name, semester, note, active } = input;
      const year = semester.split("/")[0] ?? "";
      const term = semester.split("/")[1] ?? "";
      const requester = ctx.user.full_name;
      const _id = parseInt(id);
      try {
        await ctx.prisma.sections.update({
          where: {
            id: _id,
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
  addLab: TaAboveProcedure.input(
    z.object({
      sectionId: z.string(),
      labId: z.number(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { labId, sectionId } = input;

    const _sectionId = parseInt(sectionId);

    const requester = ctx.user.full_name;
    try {
      await ctx.prisma.sections.update({
        where: {
          id: _sectionId,
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
  updateLabOrder: TaAboveProcedure.input(
    z.object({
      sectionId: z.string(),
      order: z.array(z.number()),
    })
  ).mutation(async ({ ctx, input }) => {
    const { sectionId, order } = input;
    const _sectionId = parseInt(sectionId);
    const requester = ctx.user.full_name;

    try {
      await ctx.prisma.sections.update({
        where: {
          id: _sectionId,
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
  updateLabStatus: TaAboveProcedure.input(
    z.object({
      sectionId: z.string(),
      labId: z.number(),
      status: z
        .literal("ACTIVE")
        .or(z.literal("READONLY"))
        .or(z.literal("DISABLED")),
    })
  ).mutation(async ({ ctx, input }) => {
    const { sectionId, labId, status } = input;

    const _sectionId = parseInt(sectionId);

    try {
      await ctx.prisma.labs_status.update({
        where: {
          labId_sectionId: {
            labId,
            sectionId: _sectionId,
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
  addUsersToSection: teacherAboveProcedure
    .input(z.object({ studentIds: z.array(z.string()), sectionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { studentIds, sectionId } = input;
      const requester = ctx.user.full_name;
      const _sectionId = parseInt(sectionId);

      if (!isArrayUnique(studentIds)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DUPLICATED_USER",
        });
      }
      try {
        const sectionUsers = await ctx.prisma.sections.findUnique({
          where: {
            id: _sectionId,
          },
          select: {
            students: {
              where: {
                student_id: {
                  in: studentIds,
                },
              },
            },
          },
        });

        if (sectionUsers && sectionUsers?.students.length > 0) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "DUPLICATED_USER",
          });
        }
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }

      try {
        await ctx.prisma.sections.update({
          where: {
            id: _sectionId,
          },
          data: {
            students: {
              connect: studentIds.map((id) => ({
                student_id: id,
              })),
            },
            history: {
              create: {
                action: "Add students to section",
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
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_USER",
              cause: "DUPLICATED_USER",
            });
          }

          if (err.code === "P2025") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "USER_NOT_FOUND",
              cause: "USER_NOT_FOUND",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
