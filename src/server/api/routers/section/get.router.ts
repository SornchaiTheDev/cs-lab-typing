import { generatePerson, getHighestRole } from "~/helpers";
import {
  adminProcedure,
  authedProcedure,
  router,
  teacherProcedure,
} from "~/server/api/trpc";
import { z } from "zod";
import { getAllSections } from "./roles/getAllSections";
import { getTeacherRelatedSections } from "./roles/getTeacherRelatedSections";
import type { Prisma, labs } from "@prisma/client";
import { getStudentRelatedSections } from "./roles/getStudentRelatedSections";

type sectionsIncludedStudentLength = Prisma.sectionsGetPayload<{
  include: {
    _count: {
      select: {
        students: true;
      };
    };
  };
}>;

export const getSectionsRouter = router({
  getSectionById: authedProcedure
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
          labs: true,
          history: {
            include: {
              user: true,
            },
          },
        },
      });
      if (section) {
        const sortedLabOrder = section.labs_order.map((id) => {
          const lab = section?.labs.find((lab) => lab.id === id) as labs;
          return lab;
        });

        return { ...section, labs: sortedLabOrder };
      }
      return section;
    }),
  getSectionPagination: teacherProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        courseId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, courseId } = input;
      const role = getHighestRole(
        (ctx.user.roles.split(",") as string[]) ?? []
      );
      const full_name = ctx.user.full_name;
      let sections: sectionsIncludedStudentLength[] = [];
      if (role === "ADMIN") {
        sections = await getAllSections(ctx.prisma, courseId, page, limit);
      } else if (role === "TEACHER") {
        sections = await getTeacherRelatedSections(
          ctx.prisma,
          courseId,
          page,
          limit,
          full_name
        );
      } else {
        sections = await getStudentRelatedSections(
          ctx.prisma,
          courseId,
          page,
          limit,
          full_name
        );
      }

      if (!sections) {
        return [];
      }
      return sections;
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
