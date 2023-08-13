import { AddSectionSchema } from "~/schemas/SectionSchema";
import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { Prisma } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const createSectionsRouter = router({
  createSection: teacherAboveProcedure
    .input(AddSectionSchema.and(z.object({ courseId: z.string() })))
    .mutation(async ({ ctx, input }) => {
      const { instructors, name, type, semester, note, courseId, active } =
        input;
      const year = semester.split("/")[0] ?? "";
      const term = semester.split("/")[1] ?? "";
      const requester = ctx.user.student_id;
      const _courseId = parseInt(courseId);

      let section;
      try {
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
        
        // FIX THIS (cannot use full_name to find users use student_id instead)
        const instructorsId = await ctx.prisma.users.findMany({
          where: {
            full_name: {
              in: instructors,
            },
            deleted_at: null,
          },
          select: {
            id: true,
          },
        });

        section = await ctx.prisma.sections.create({
          data: {
            active,
            name,
            type,
            note,
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
});
