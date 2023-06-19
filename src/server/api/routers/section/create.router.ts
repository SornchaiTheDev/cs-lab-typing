import { AddSectionSchema } from "~/forms/SectionSchema";
import { isArrayUnique, isAllUserHaveValidStudentId } from "~/helpers";
import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createSectionsRouter = router({
  createSection: teacherAboveProcedure
    .input(AddSectionSchema.and(z.object({ courseId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { instructors, name, semester, note, courseId, active } = input;
      const year = semester.split("/")[0] ?? "";
      const term = semester.split("/")[1] ?? "";
      const requester = ctx.user.full_name;
      const _courseId = parseInt(courseId);

      let section;
      try {
        section = await ctx.prisma.sections.create({
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
              connect: instructors.map((instructor) => ({
                full_name: instructor,
              })),
            },
            course: {
              connect: {
                id: _courseId,
              },
            },
            created_by: {
              connect: {
                full_name: requester,
              },
            },
            history: {
              create: {
                action: "Create a section",
                user: {
                  connect: {
                    full_name: requester,
                  },
                },
              },
            },
          },
        });
      } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
          if (e.code === "P2002") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_SECTION",
              cause: "DUPLICATED_SECTION",
            });
          }
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "SOMETHING_WENT_WRONG",
          });
        }
      }
      return section;
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

      if (isAllUserHaveValidStudentId(studentIds)) {
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
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INVALID_INPUT",
        });
      }
    }),
});
