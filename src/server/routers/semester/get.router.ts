import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";
export const getSemestersRouter = router({
  getSemesters: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;

      const semesters = await ctx.prisma.semester.findMany({
        skip: (page - 1) * limit,
        take: limit,
      });
      if (!semesters) {
        return [];
      }
      return semesters;
    }),
  getSemesterByYearAndTerm: adminProcedure
    .input(
      z.object({
        yearAndTerm: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { yearAndTerm } = input;
      const year = yearAndTerm.split("/")[0];
      const term = yearAndTerm.split("/")[1];
      const semester = await ctx.prisma.semester.findUnique({
        where: {
          year_term: {
            year,
            term,
          },
        },
      });
      return semester;
    }),
  getSemesterObjectRelation: adminProcedure
    .input(z.object({ yearAndTerm: z.string() }))
    .query(async ({ ctx, input }) => {
      const { yearAndTerm } = input;
      const year = yearAndTerm.split("/")[0];
      const term = yearAndTerm.split("/")[1];

      const semester = await ctx.prisma.semester.findUnique({
        where: {
          year_term: {
            year,
            term,
          },
        },
      });

      const relation = {
        summary: [{ name: "Semester", amount: 1 }],
        object: [
          {
            name: "Semester",
            data: [`${semester?.year}/${semester?.term}`],
          },
        ],
      };

      return relation;
    }),
});