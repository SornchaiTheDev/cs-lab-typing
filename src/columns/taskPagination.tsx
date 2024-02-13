import type { Prisma } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import type { NextRouter } from "next/router";
import { convertToCompact } from "~/utils";

type TaskPaginationFields = Prisma.tasksGetPayload<{
  include: {
    tags: {
      select: {
        name: true;
      };
    };
    owner: {
      select: {
        full_name: true;
      };
    };
    language: {
      select: {
        name: true;
      };
    };
  };
}>;

const columnHelper = createColumnHelper<TaskPaginationFields>();

export const taskPaginationColumns = (router: NextRouter) => [
  columnHelper.accessor((row) => row.name, {
    id: "name",
    header: "Name",
    cell: (data) => {
      return (
        <Link
          href={{
            pathname: router.pathname + "/[taskId]",
            query: { ...router.query, taskId: data.row.original.id },
          }}
          className="font-bold"
        >
          {data.getValue()}
        </Link>
      );
    },
  }),
  columnHelper.accessor((row) => row.type, {
    id: "type",
    header: "Type",
  }),
  columnHelper.accessor((row) => row.tags, {
    id: "tags",
    header: "Tags",
    cell: (data) => {
      const tags = data.getValue();
      if (tags === undefined) return;
      const isEmpty = tags.length === 0;
      return isEmpty ? "-" : tags.map(({ name }) => name).join(",");
    },
  }),
  columnHelper.accessor((row) => row.language, {
    id: "language",
    header: "Language",
    cell: (data) => {
      const language = data.getValue();
      if (language === undefined) return;
      const isNotAProblem = language === null;
      return isNotAProblem ? "-" : language.name;
    },
  }),
  columnHelper.accessor((row) => row.submission_count, {
    id: "submission_count",
    header: "Submission Count",
    cell: (data) => convertToCompact(data.getValue()),
  }),
  columnHelper.accessor((row) => row.owner, {
    id: "owner",
    header: "Owner",
    cell: (data) => data.getValue()?.full_name,
  }),
];
