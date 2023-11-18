import { Prisma } from "@prisma/client";

type CourseWhereCondition = Prisma.coursesWhereInput;

export const adminCondition = (search?: string): CourseWhereCondition => ({
  deleted_at: null,
  OR: [
    {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
    {
      number: {
        contains: search,
        mode: "insensitive",
      },
    },
  ],
});

export const teacherCondition = (
  student_id: string,
  search?: string
): CourseWhereCondition => ({
  deleted_at: null,
  AND: [
    {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          number: {
            contains: search,
            mode: "insensitive",
          },
        },
      ],
    },
    {
      OR: [
        {
          authors: {
            some: {
              student_id,
            },
          },
        },
        {
          sections: {
            some: {
              deleted_at: null,
              instructors: {
                some: {
                  student_id,
                  deleted_at: null,
                },
              },
            },
          },
        },
      ],
    },
  ],
});
