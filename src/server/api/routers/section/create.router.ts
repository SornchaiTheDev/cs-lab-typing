import { AddSectionSchema } from "~/schemas/SectionSchema";
import { teacherAboveProcedure, router } from "~/server/api/trpc";
import { Prisma, type SectionType } from "@prisma/client";
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
      const requester = ctx.user.full_name;
      const _courseId = parseInt(courseId);
      const typeUppercase = type.toUpperCase() as SectionType;
      let section;
      try {
        const semester = await ctx.prisma.semesters.findMany({
          where: {
            year,
            term,
            deleted_at: null,
          },
          take: 1,
        });

        section = await ctx.prisma.sections.create({
          data: {
            active,
            name,
            type: typeUppercase,
            note,
            semester: {
              connect: {
                id: semester[0]?.id,
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
});
