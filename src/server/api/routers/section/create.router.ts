import { AddSectionSchema } from "~/forms/SectionSchema";
import { isArrayUnique, isAllUserHaveValidEmail } from "~/helpers";
import { teacherProcedure, router } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createSectionsRouter = router({
  createSection: teacherProcedure
    .input(AddSectionSchema.and(z.object({ courseId: z.number() })))
    .mutation(async ({ ctx, input }) => {
      const { instructors, name, semester, note, tas, courseId, active } =
        input;
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
            tas: {
              connect: tas ? tas.map((ta) => ({ full_name: ta })) : [],
            },
            course: {
              connect: {
                id: courseId,
              },
            },
            created_by: {
              connect: {
                full_name: ctx.user.full_name,
              },
            },
            history: {
              create: {
                action: "Create a section",
                user: {
                  connect: {
                    full_name: ctx.user.full_name,
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
    .input(z.object({ emails: z.array(z.string()), sectionId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const { emails, sectionId } = input;
      const requester = ctx.user.full_name;

      if (!isArrayUnique(emails)) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "DUPLICATED_USER",
        });
      }

      if (isAllUserHaveValidEmail(emails)) {
        try {
          await ctx.prisma.sections.update({
            where: {
              id: sectionId,
            },
            data: {
              students: {
                connect: emails.map((email) => ({
                  email,
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
