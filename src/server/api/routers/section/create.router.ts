import { AddSectionSchema } from "~/schemas/SectionSchema";
import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
// import { isUserInThisCourse } from "~/server/utils/isRelationWithThisCourse";

export const createSectionsRouter = router({
  createSection: teacherAboveProcedure
    .input(AddSectionSchema.and(z.object({ courseId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const {
        instructors,
        name,
        type,
        semester,
        note,
        courseId,
        active,
        closed_at,
      } = input;
      const [term, year] = semester.split(" ");
      const requester = ctx.user.student_id;
      const _courseId = parseInt(courseId);

      let section;
      try {
        // await isUserInThisCourse(requester, _courseId);
        const _requester = await ctx.prisma.users.findFirst({
          where: {
            student_id: requester,
            deleted_at: null,
          },
        });

        const semester = await ctx.prisma.semesters.findMany({
          where: {
            year,
            term,
            deleted_at: null,
          },
          take: 1,
        });

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

        const existSection = await ctx.prisma.sections.findFirst({
          where: {
            name,
            type,
            semester_id: semester[0]?.id,
            course_id: _courseId,
            deleted_at: null,
          },
        });

        if (existSection) {
          throw new Error("DUPLICATED_SECTION");
        }

        section = await ctx.prisma.sections.create({
          data: {
            active,
            name,
            type,
            note,
            closed_at,
            semester: {
              connect: {
                id: semester[0]?.id,
              },
            },
            instructors: {
              connect: instructorsId,
            },
            course: {
              connect: {
                id: _courseId,
              },
            },
            created_by: {
              connect: {
                id: _requester?.id,
              },
            },
            history: {
              create: {
                action: "Create a section",
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
          if (err.message === "DUPLICATED_SECTION") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "DUPLICATED_SECTION",
              cause: "DUPLICATED_SECTION",
            });
          }

          if (err.message === "UNAUTHORIZED") {
            throw new TRPCError({
              code: "UNAUTHORIZED",
              message: "UNAUTHORIZED",
            });
          }
        }
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === "P2002") {
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
});
