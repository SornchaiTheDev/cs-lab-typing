import { generatePerson } from "~/helpers";
import { adminProcedure, router } from "~/server/api/trpc";
import { z } from "zod";

export const getSectionsRouter = router({
  getSectionById: adminProcedure
    .input(
      z.object({
        id: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const section = await ctx.prisma.sections.findUnique({
        where: {
          id,
        },
        include: {
          semester: true,
          tas: true,
          instructors: true,
          students: true,
        },
      });
      return section;
    }),
  getSectionPagination: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;

      const semesters = await ctx.prisma.sections.findMany({
        where: {
          deleted_at: null,
        },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          students: true,
        },
      });
      if (!semesters) {
        return [];
      }
      return semesters;
    }),
  getSectionObjectRelation: adminProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;

      const section = await ctx.prisma.sections.findUnique({
        where: {
          name,
        },
        include: {
          instructors: true,
          semester: true,
          students: true,
          tas: true,
          course: true,
        },
      });

      const studentAmount = section?.students.length ?? 0;
      const TAAmount = section?.tas.length ?? 0;
      const instructorAmount = section?.instructors.length ?? 0;

      const userAmount = studentAmount + TAAmount + instructorAmount;

      const allAffectUsers = [
        ...(section?.students ?? []),
        ...(section?.tas ?? []),
        ...(section?.instructors ?? []),
      ];

      const relation = {
        summary: [
          { name: "Course", amount: 1 },
          { name: "Section", amount: 1 },
          { name: "Users", amount: userAmount },
          { name: "Lab in section", amount: 10 },
          { name: "Submissions", amount: 100 },
        ],
        object: [
          {
            name: "Courses",
            data: [section?.course.name],
          },
          { name: "Section", data: [section?.name] },
          { name: "Users", data: allAffectUsers.map((user) => user.full_name) },
          { name: "Lab in section", data: generatePerson(10) },
          { name: "Submissions", data: generatePerson(100) },
        ],
      };

      return relation;
    }),
});
