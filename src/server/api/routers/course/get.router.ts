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
import { isUserInThisCourse } from "~/server/utils/checkUser";

export const getCourseRouter = router({
  getCoursePagination: teacherAboveProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        cursor: z.number().nullish(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, cursor, search } = input;

      const role = getHighestRole(ctx.user.roles);
      const student_id = ctx.user.student_id;
      let courses = null;
      try {
        if (role === "ADMIN") {
          courses = await getAdminCourses(ctx.prisma, limit, cursor, search);
        } else if (role === "TEACHER") {
          courses = await getTeacherCourses(
            ctx.prisma,
            limit,
            student_id,
            cursor,
            search
          );
        }
        if (courses === null) {
          throw new Error("NOT_FOUND");
        }

        let nextCursor: typeof cursor | undefined = undefined;
        if (courses.length > limit) {
          const nextItem = courses.pop();
          nextCursor = nextItem?.id;
        }
        return { courses, nextCursor };
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getCourseById: TaAboveProcedure.input(z.object({ id: z.string() })).query(
    async ({ ctx, input }) => {
      const { id } = input;
      const _id = parseInt(id);
      try {
        await isUserInThisCourse(ctx.user.student_id, _id);
        const course = await ctx.prisma.courses.findFirst({
          where: {
            id: _id,
            deleted_at: null,
          },
          include: {
            authors: true,
            sections: {
              where: {
                deleted_at: null,
              },
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
          throw new Error("NOT_FOUND");
        }
        return course;
      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "NOT_FOUND") {
            throw new TRPCError({
              code: "INTERNAL_SERVER_ERROR",
              message: "NOT_FOUND",
            });
          }
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
    }
  ),
  getCourseObjectRelation: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        const course = await ctx.prisma.courses.findUnique({
          where: {
            id,
          },
          include: {
            labs: {
              where: {
                deleted_at: null,
              },
            },
            sections: {
              where: {
                deleted_at: null,
              },
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

        if (!course) {
          throw new Error("NOT_FOUND");
        }
        const labs = course.labs;
        const sections = course.sections;
        const sectionsLength = sections?.length ?? 0;

        const labInCourseLength = labs.length;
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
            { name: "Courses", data: [{ name: course.name, data: [] }] },
            {
              name: "Lab in course",
              data:
                labs?.map(({ name }) => ({
                  name: name,
                  data: [],
                })) ?? [],
            },
            {
              name: "Lab in sections",
              data:
                sections
                  .filter(({ labs }) => labs.length > 0)
                  ?.map(({ name, labs }) => ({
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
