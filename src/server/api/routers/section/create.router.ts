import { AddSectionSchema } from "~/forms/SectionSchema";
import { isArrayUnique, isAllUserHaveValidStudentId } from "~/helpers";
import { teacherProcedure, router } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createSectionsRouter = router({
  createSection: teacherProcedure
    .input(AddSectionSchema.and(z.object({ courseId: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { instructors, name, semester, note, courseId, active } = input;
      const year = semester.split("/")[0] ?? "";
      const term = semester.split("/")[1] ?? "";
      const requester = ctx.user.full_name;

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
                id: courseId,
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
        }
      }
      return section;
    }),
  addUsersToSection: teacherProcedure
    .input(z.object({ studentIds: z.array(z.string()), sectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { studentIds, sectionId } = input;
      const requester = ctx.user.full_name;

      if (!isArrayUnique(studentIds)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DUPLICATED_USER",
        });
      }

      const sectionUsers = await ctx.prisma.sections.findUnique({
        where: {
          id: sectionId,
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

      if (isAllUserHaveValidStudentId(studentIds)) {
        try {
          await ctx.prisma.sections.update({
            where: {
              id: sectionId,
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
        }
      } else {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "INVALID_INPUT",
        });
      }
    }),
});
