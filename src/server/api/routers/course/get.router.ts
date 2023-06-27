import {
  TaAboveProcedure,
  adminProcedure,
  router,
  teacherAboveProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { getHighestRole } from "~/helpers";
import { getAdminCourses } from "./roles/getAdminCourses";
import { getTeacherCourses } from "./roles/getTeacherCourses";
import type { Relation } from "~/types/Relation";
import { TRPCError } from "@trpc/server";

export const getCourseRouter = router({
  getCoursePagination: teacherAboveProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;

      const role = getHighestRole(ctx.user.roles);
      const full_name = ctx.user.full_name;
      let courses = null;
      try {
        if (role === "ADMIN") {
          courses = await getAdminCourses(ctx.prisma, page, limit);
        } else if (role === "TEACHER") {
          courses = await getTeacherCourses(ctx.prisma, page, limit, full_name);
        }
        if (!courses) {
          return [];
        }

        return courses;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getCourseById: TaAboveProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const _id = parseInt(id);
      try {
        const course = await ctx.prisma.courses.findFirst({
          where: {
            id: _id,
            deleted_at: null,
          },
          include: {
            authors: true,
            sections: {
              select: {
                _count: {
                  select: {
                    students: true,
                  },
                },
              },
            },
          },
        });
        if (!course) {
          throw new Error("UNAUTHORIZED");
        }
        return course;
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
  getCourseObjectRelation: adminProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;
      try {
        const course = await ctx.prisma.courses.findUnique({
          where: {
            name,
          },
          include: {
            sections: {
              include: {
                students: true,
                instructors: true,
                semester: true,
                labs: true,
                submissions: true,
              },
            },
            authors: true,
          },
        });

        const sections = course?.sections;
        const sectionsLength = sections?.length ?? 0;

        const labInCourse = sections?.map(({ labs }) => labs.length) ?? [];
        const labInCourseLength = labInCourse.length;
        const labInSectionsLength =
          sections
            ?.map(({ labs }) => labs.length)
            .reduce((prev, curr) => prev + curr, 0) ?? 0;

        const submissionsLength =
          sections
            ?.map(({ submissions }) => submissions.length)
            .reduce((prev, curr) => prev + curr, 0) ?? 0;

        const relation: Relation = {
          summary: [
            { name: "Courses", amount: 1 },
            { name: "Sections", amount: sectionsLength },
            { name: "Lab in course", amount: labInCourseLength },
            { name: "Lab in sections", amount: labInSectionsLength },
            { name: "Submissions", amount: submissionsLength },
          ],
          object: [
            { name: "Courses", data: [{ name, data: [] }] },
            {
              name: "Lab in course",
              data:
                sections?.map((section) => ({
                  name: section.name,
                  data: [],
                })) ?? [],
            },
            {
              name: "Lab in sections",
              data:
                sections?.map(({ name, labs }) => ({
                  name,
                  data: labs.map(({ name }) => ({ name, data: [] })),
                })) ?? [],
            },
            {
              name: "Sections",
              data:
                sections?.map(({ name, submissions }) => ({
                  name,
                  data: [
                    {
                      name: "Submissions",
                      data: submissions.map(
                        ({ created_at, user_id, section_id }) => ({
                          name: `Submitted at ${created_at} by user-id:${user_id} sec-id:${section_id}`,
                          data: [],
                        })
                      ),
                    },
                  ],
                })) ?? [],
            },
          ],
        };

        return relation;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
});
