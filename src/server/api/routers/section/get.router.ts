import { getHighestRole } from "~/helpers";
import { TaAboveProcedure, router, teacherProcedure } from "~/server/api/trpc";
import { z } from "zod";
import { getAllSections } from "./roles/getAllSections";
import { getTeacherRelatedSections } from "./roles/getTeacherRelatedSections";
import type { Prisma, labs, labs_status } from "@prisma/client";
import { getStudentRelatedSections } from "./roles/getStudentRelatedSections";
import type { Relation } from "~/types/Relation";

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
  getSectionById: TaAboveProcedure.input(
    z.object({
      id: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const { id } = input;
    const _id = parseInt(id);
    const section = await ctx.prisma.sections.findUnique({
      where: {
        id: _id,
      },
      include: {
        semester: true,
        instructors: true,
        students: true,
        labs: true,
        history: {
          include: {
            user: true,
          },
        },
        labs_status: true,
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

  getLabSet: TaAboveProcedure.input(
    z.object({
      id: z.string(),
    })
  ).query(async ({ ctx, input }) => {
    const { id } = input;
    const _id = parseInt(id);
    const section = await ctx.prisma.sections.findUnique({
      where: {
        id: _id,
      },
      include: {
        semester: true,
        instructors: true,
        students: true,
        labs: true,
        history: {
          include: {
            user: true,
          },
        },
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
  }),
  getSectionPagination: teacherProcedure
    .input(
      z.object({
        page: z.number().default(1),
        limit: z.number().default(10),
        courseId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, courseId } = input;

      const _courseId = parseInt(courseId);
      const role = getHighestRole(ctx.user.roles);
      const full_name = ctx.user.full_name;
      let sections: sectionsIncludedStudentLength[] = [];

      if (role === "ADMIN") {
        sections = await getAllSections(ctx.prisma, _courseId, page, limit);
      } else if (role === "TEACHER") {
        sections = await getTeacherRelatedSections(
          ctx.prisma,
          _courseId,
          page,
          limit,
          full_name
        );
      } else {
        sections = await getStudentRelatedSections(
          ctx.prisma,
          _courseId,
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
  getSectionObjectRelation: teacherProcedure
    .input(z.object({ name: z.string() }))
    .query(async ({ ctx, input }) => {
      const { name } = input;

      const section = await ctx.prisma.sections.findUnique({
        where: {
          name,
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
    }),
});
