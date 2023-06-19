import {
  adminProcedure,
  teacherAboveProcedure,
  router,
} from "~/server/api/trpc";
import { z } from "zod";
import type { Relation } from "~/types/Relation";
import { TRPCError } from "@trpc/server";
export const getSemesterRouter = router({
  getSemesters: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;
      try {
        const semesters = await ctx.prisma.semesters.findMany({
          where: {
            deleted_at: null,
          },
          skip: (page - 1) * limit,
          take: limit,
        });
        if (!semesters) {
          return [];
        }
        return semesters;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getSemesterByYearAndTerm: adminProcedure
    .input(
      z.object({
        yearAndTerm: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { yearAndTerm } = input;
      const year = yearAndTerm.split("/")[0] ?? "";
      const term = yearAndTerm.split("/")[1] ?? "";
      try {
        const semester = await ctx.prisma.semesters.findUnique({
          where: {
            year_term: {
              year,
              term,
            },
          },
        });
        return semester;
      } catch (err) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "SOMETHING_WENT_WRONG",
        });
      }
    }),
  getSemesterObjectRelation: adminProcedure
    .input(z.object({ yearAndTerm: z.string() }))
    .query(async ({ ctx, input }) => {
      const { yearAndTerm } = input;
      const year = yearAndTerm.split("/")[0] ?? "";
      const term = yearAndTerm.split("/")[1] ?? "";
      try {
        const semester = await ctx.prisma.semesters.findUnique({
          where: {
            year_term: {
              year,
              term,
            },
          },
          include: {
            sections: {
              include: {
                labs: {
                  include: {
                    submissions: true,
                  },
                },
              },
            },
          },
        });

        const relation: Relation = {
          summary: [
            { name: "Semester", amount: 1 },
            { name: "Sections", amount: semester?.sections.length ?? 0 },
            {
              name: "Lab in sections",
              amount:
                semester?.sections.reduce(
                  (prev, curr) => prev + curr.labs.length,
                  0
                ) ?? 0,
            },
            {
              name: "Submissions",
              amount:
                semester?.sections.reduce(
                  (prev, curr) =>
                    prev +
                    curr.labs.reduce(
                      (prev, curr) => prev + curr.submissions.length,
                      0
                    ),
                  0
                ) ?? 0,
            },
          ],
          object: [
            {
              name: "Semester",
              data: [{ name: `${semester?.year}/${semester?.term}`, data: [] }],
            },
            {
              name: "Section",
              data:
                semester?.sections.map(({ name, labs }) => ({
                  name,
                  data: [
                    {
                      name: "Lab in section",
                      data: labs.map(({ name, submissions }) => ({
                        name,
                        data: submissions.map(
                          ({ created_at, user_id, section_id }) => ({
                            name: `Submitted at ${created_at} by user-id:${user_id} sec-id:${section_id}`,
                            data: [],
                          })
                        ),
                      })),
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
  getAllSemesters: teacherAboveProcedure.query(async ({ ctx }) => {
    try {
      const semesters = await ctx.prisma.semesters.findMany({
        where: {
          deleted_at: null,
        },
        orderBy: {
          year: "desc",
        },
      });
      return semesters.map((semester) => `${semester.year}/${semester.term}`);
    } catch (err) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "SOMETHING_WENT_WRONG",
      });
    }
  }),
});
