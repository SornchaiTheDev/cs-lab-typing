import { AddSectionSchema } from "~/schemas/SectionSchema";
import {
  router,
  taAboveAndRelatedToSectionProcedure,
  teacherAboveAndRelatedToSectionProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { isArrayUnique } from "~/helpers";

export const updateSectionsRouter = router({
  updateSection: teacherAboveAndRelatedToSectionProcedure
    .input(AddSectionSchema.and(z.object({ sectionId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const {
        sectionId,
        instructors,
        name,
        semester,
        note,
        active,
        type,
        closed_at,
      } = input;

      const [year, term] = semester.split("/");

      const requester = ctx.user.student_id;
      const _sectionid = parseInt(sectionId);
      try {
        const semester = await ctx.prisma.semesters.findFirst({
          where: {
            year,
            term,
            deleted_at: null,
          },
          take: 1,
        });

        if (!semester) throw new Error("SEMESTER_NOT_FOUND");

        const instructorsId = await ctx.prisma.users.findMany({
          where: {
            student_id: {
              in: instructors.map((instructor) => instructor.value as string),
            },
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        const _requester = await ctx.prisma.users.findFirst({
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
            id: _sectionid,
          },
          data: {
            active,
            name,
            type,
            note,
            closed_at: closed_at ? closed_at : null,
            semester: {
              connect: {
                id: semester.id,
              },
            },
            instructors: {
              set: instructorsId,
            },
            history: {
              create: {
                action: "Update section",
                user: {
                  connect: {
                    id: _requester?.id,
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
          message: "SAME_YEAR_AND_TERM",
        });
      }
      return "Success";
    }),
  addLab: taAboveAndRelatedToSectionProcedure
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
        const _requester = await ctx.prisma.users.findFirst({
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
                    id: _requester?.id,
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
  updateLabOrder: taAboveAndRelatedToSectionProcedure
    .input(
      z.object({
        sectionId: z.string(),
        order: z.array(z.number()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sectionId, order } = input;
      const _sectionId = parseInt(sectionId);
      const requester = ctx.user.student_id;

      try {
        const _requester = await ctx.prisma.users.findFirst({
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
            labs_order: {
              set: order,
            },
            history: {
              create: {
                action: "Re-order lab",
                user: {
                  connect: {
                    id: _requester?.id,
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
      return "Success";
    }),
  updateLabStatus: taAboveAndRelatedToSectionProcedure
    .input(
      z.object({
        sectionId: z.string(),
        labId: z.number(),
        status: z
          .literal("ACTIVE")
          .or(z.literal("READONLY"))
          .or(z.literal("DISABLED")),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { sectionId, labId, status } = input;

      const requester = ctx.user.student_id;
      const _sectionId = parseInt(sectionId);

      const lab = await ctx.prisma.labs.findUnique({
        where: {
          id: labId,
        },
      });

      const isLabClosed = lab?.active === false;

      if (isLabClosed) {
        throw new Error("LAB_CLOSED");
      }

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

        const _requester = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
            deleted_at: null,
          },
        });

        await ctx.prisma.sections.update({
          where: {
            id: _sectionId,
          },
          data: {
            history: {
              create: {
                action: "Update lab status",
                user: {
                  connect: {
                    id: _requester?.id,
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

          if (err.message === "LAB_CLOSED") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "LAB_CLOSED",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  addUsersToSection: teacherAboveAndRelatedToSectionProcedure
    .input(z.object({ studentIds: z.array(z.string()), sectionId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { studentIds, sectionId } = input;
      const requester = ctx.user.student_id;
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
          throw new Error("DUPLICATED_USER");
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "DUPLICATED_USER") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "ALREADY_IN_SECTION",
            });
          }
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }

      try {
        const _requester = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
            deleted_at: null,
          },
        });

        const _studentsId = await ctx.prisma.users.findMany({
          where: {
            student_id: {
              in: studentIds,
            },
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        if (_studentsId.length === 0) {
          throw new Error("USER_NOT_FOUND");
        }

        await ctx.prisma.sections.update({
          where: {
            id: _sectionId,
          },
          data: {
            students: {
              connect: _studentsId,
            },
            history: {
              create: {
                action: "Add students to section",
                user: {
                  connect: {
                    id: _requester?.id,
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
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "USER_NOT_FOUND",
          });
        }
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_USER",
              cause: "DUPLICATED_USER",
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
