import { getHighestRole } from "~/helpers";
import {
  TaAboveProcedure,
  router,
  teacherAboveProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { getAllSections } from "./roles/getAllSections";
import { getTeacherRelatedSections } from "./roles/getTeacherRelatedSections";
import type { Prisma, labs, labs_status } from "@prisma/client";
import type { Relation } from "~/types/Relation";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import {
  isUserInThisCourse,
  isUserInThisSection,
} from "~/server/utils/checkUser";

type sectionsIncludedStudentLength = Prisma.sectionsGetPayload<{
  include: {
    semester: true;
    _count: {
      select: {
        students: true;
      };
    };
  };
}>;

export const getSectionsRouter = router({
  getSectionById: TaAboveProcedure.input(
    z.object({
      id: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const { id } = input;

    if (/^\d+$/.test(id) === false) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
    const _sectionId = parseInt(id);

    try {
      await isUserInThisSection(ctx.user.student_id, _sectionId);

      const section = await ctx.prisma.sections.findFirst({
        where: {
          id: _sectionId,
          deleted_at: null,
        },
        include: {
          semester: true,
          instructors: true,
          labs: true,
          history: {
            include: {
              user: true,
            },
          },
          labs_status: true,
        },
      });
      if (!section) {
        throw new Error("NOT_FOUND");
      }
      const sortedLabOrder = section.labs_order.map((id) => {
        const lab = section?.labs.find((lab) => lab.id === id) as labs;

        return lab;
      });

      const isSectionClosed = section.closed_at
        ? dayjs().isAfter(section.closed_at)
        : false;

      if (isSectionClosed) {
        await ctx.prisma.sections.update({
          where: {
            id: _sectionId,
          },
          data: {
            active: false,
          },
        });
      }

      return {
        ...section,
        active: section.active,
        labs: sortedLabOrder,
      };
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

  getStudentsBySectionId: TaAboveProcedure.input(
    z.object({
      sectionId: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const { sectionId } = input;
    const _sectionId = parseInt(sectionId);
    try {
      await isUserInThisSection(ctx.user.student_id, _sectionId);

      const section = await ctx.prisma.sections.findUnique({
        where: {
          id: _sectionId,
        },
        select: {
          _count: {
            select: {
              students: true,
            },
          },
        },
      });

      return section?._count.students;
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

  getStudentPagination: teacherAboveProcedure
    .input(
      z.object({
        sectionId: z.string(),
        page: z.number().default(1),
        limit: z.number().default(10),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sectionId, search } = input;
      const _sectionId = parseInt(sectionId);
      try {
        await isUserInThisSection(ctx.user.student_id, _sectionId);

        const [pagination, allStudentAmount, allStudents] =
          await ctx.prisma.$transaction([
            ctx.prisma.sections.findUnique({
              where: {
                id: _sectionId,
              },
              select: {
                students: {
                  where: {
                    OR: [
                      {
                        student_id: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                      {
                        full_name: {
                          contains: search,
                          mode: "insensitive",
                        },
                      },
                    ],
                  },
                  orderBy: {
                    student_id: "asc",
                  },
                  take: limit,
                  skip: page * limit,
                },
              },
            }),
            ctx.prisma.sections.findUnique({
              where: {
                id: _sectionId,
              },
              select: {
                _count: {
                  select: {
                    students: true,
                  },
                },
              },
            }),
            ctx.prisma.sections.findUnique({
              where: {
                id: _sectionId,
              },
              select: {
                students: true,
              },
            }),
          ]);

        const students = pagination?.students ?? [];
        const studentAmount = allStudentAmount?._count.students ?? 0;

        return {
          students,
          allStudents: allStudents?.students ?? [],
          pageCount: Math.ceil(studentAmount / limit),
        };
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

  getLabSet: TaAboveProcedure.input(
    z.object({
      id: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const { id } = input;
    const _sectionId = parseInt(id);
    try {
      await isUserInThisSection(ctx.user.student_id, _sectionId);

      const section = await ctx.prisma.sections.findUnique({
        where: {
          id: _sectionId,
        },
        include: {
          semester: true,
          instructors: true,
          students: true,
          labs: true,
          labs_status: true,
        },
      });

      if (section && section.labs.length > 0) {
        const sortedLabOrder = section.labs_order.map((id) => {
          const lab = section?.labs.find((lab) => lab.id === id) as labs;
          const { status } = section?.labs_status.find(
            (lab) => lab.labId === id
          ) as labs_status;

          return { ...lab, status };
        });

        return { ...section, labs: sortedLabOrder };
      }
      return section;
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
  getSectionPagination: teacherAboveProcedure
    .input(
      z.object({
        limit: z.number().default(10),
        courseId: z.string(),
        cursor: z.number().nullish(),
        search: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { limit, courseId, cursor, search } = input;

      const _courseId = parseInt(courseId);
      const role = getHighestRole(ctx.user.roles);
      const student_id = ctx.user.student_id;
      let sections: sectionsIncludedStudentLength[] = [];
      try {
        await isUserInThisCourse(student_id, _courseId);
        if (role === "ADMIN") {
          sections = await getAllSections(
            ctx.prisma,
            _courseId,
            limit,
            cursor,
            search
          );
        } else if (role === "TEACHER") {
          sections = await getTeacherRelatedSections(
            ctx.prisma,
            _courseId,
            limit,
            student_id,
            cursor,
            search
          );
        }

        let nextCursor: typeof cursor | undefined = undefined;
        if (sections.length > limit) {
          const nextItem = sections.pop();
          nextCursor = nextItem?.id;
        }
        return { sections, nextCursor };
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

  getSectionHistoryPagination: teacherAboveProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        sectionId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, sectionId } = input;

      const _sectionId = parseInt(sectionId);

      try {
        await isUserInThisSection(ctx.user.student_id, _sectionId);

        const [sectionHistory, amount] = await ctx.prisma.$transaction([
          ctx.prisma.section_histories.findMany({
            where: {
              sectionId: _sectionId,
            },
            skip: page * limit,
            take: limit,
            orderBy: {
              created_at: "desc",
            },
            include: {
              user: true,
            },
          }),
          ctx.prisma.section_histories.count({
            where: {
              sectionId: _sectionId,
            },
          }),
        ]);

        return { sectionHistory, pageCount: Math.ceil(amount / limit) };
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

  getSectionObjectRelation: teacherAboveProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      try {
        await isUserInThisSection(ctx.user.student_id, id);

        const section = await ctx.prisma.sections.findUnique({
          where: {
            id,
          },
          include: {
            labs: true,
            submissions: true,
          },
        });

        const labLength = section?.labs.length as number;
        const submissionsLength = section?.submissions.length as number;
        const relation: Relation = {
          summary: [
            { name: "Section", amount: 1 },
            { name: "Lab in section", amount: labLength },
            { name: "Submissions", amount: submissionsLength },
          ],
          object: [
            {
              name: "Section",
              data: [{ name: section?.name as string, data: [] }],
            },

            {
              name: "Lab in section",
              data: section?.labs.map(({ name }) => ({ name, data: [] })) ?? [],
            },
            {
              name: "Submissions",
              data:
                section?.submissions.map(
                  ({ created_at, user_id, section_id }) => ({
                    name: `Submitted at ${created_at} by user-id:${user_id} sec-id:${section_id}`,
                    data: [],
                  })
                ) ?? [],
            },
          ],
        };

        return relation;
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
});
