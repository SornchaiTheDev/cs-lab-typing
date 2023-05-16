import { adminProcedure, router } from "@/server/trpc";
import { z } from "zod";

export const getCourseRouter = router({
  getCoursePagination: adminProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit } = input;

      const semesters = await ctx.prisma.courses.findMany({
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
    }),
  getCourseById: adminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const course = await ctx.prisma.courses.findFirst({
        where: {
          id,
        },
        include: {
          authors: true,
        },
      });
      if (!course) {
        return null;
      }
      return course;
    }),
  getCourseObjectRelation: adminProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;

      const course = await ctx.prisma.courses.findUnique({
        where: {
          name,
        },
        include: {
          sections: {
            include: {
              students: true,
              instructors: true,
              tas: true,
              semester: true,
            },
          },
          authors: true,
        },
      });

      const usersInSections =
        course?.sections
          .map((section) => {
            return [
              ...section.instructors.map((instructor) => instructor.full_name),
              ...section.students.map((student) => student.full_name),
              ...section.tas.map((ta) => ta.full_name),
            ];
          })
          .flat() ?? [];

      const semestersInSections =
        course?.sections.map(
          (section) => `${section.semester.year}/${section.semester.term}`
        ) ?? [];

      const arrayOfSemesters = Array.from(new Set(semestersInSections));

      const usersInAuthors =
        course?.authors.map((author) => author.full_name) ?? [];

      const mergeAllUsers = Array.from(
        new Set([...usersInSections, ...usersInAuthors])
      );

      const sections = course?.sections;

      const relation = {
        summary: [
          { name: "Courses", amount: 1 },
          { name: "Semesters", amount: arrayOfSemesters.length },
          { name: "Users", amount: mergeAllUsers.length },
          { name: "Sections", amount: sections?.length },
          { name: "Lab in this course", amount: sections?.length },
          { name: "Submissions", amount: sections?.length },
        ],
        object: [
          { name: "Courses", data: [name] },
          {
            name: "Semesters",
            data: arrayOfSemesters,
          },
          {
            name: "Users",
            data: mergeAllUsers,
          },
          {
            name: "Sections",
            data: sections?.map((section) => section.name) ?? [],
          },
          {
            name: "Lab in this course",
            data: sections?.map((section) => section.name) ?? [],
          },
          {
            name: "Submissions",
            data: sections?.map((section) => section.name) ?? [],
          },
        ],
      };

      return relation;
    }),
});
