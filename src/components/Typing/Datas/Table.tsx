import { Icon } from "@iconify/react";
import type { SectionType, typing_histories } from "@prisma/client";
import {
  type OnChangeFn,
  type PaginationState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { getDuration } from "../utils/getDuration";
import Table from "~/components/Common/Table";
import { twMerge } from "tailwind-merge";

interface Props {
  datas: typing_histories[];
  isLoading: boolean;
  pagination: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState> | undefined;
  highestSpeedAndScore: string | null;
  type?: SectionType;
}

function TypingTable({
  datas,
  isLoading,
  pagination,
  onPaginationChange,
  highestSpeedAndScore,
  type = "Lesson",
}: Props) {
  const columnHelper = createColumnHelper<typing_histories>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "round",
        size: 10,
        cell: (props) => {
          const isHighestSpeed = props.row.original.id === highestSpeedAndScore;
          return (
            <div
              className={twMerge(
                "w-fit rounded-full bg-yellow-3 p-2 text-xl text-yellow-10",
                !isHighestSpeed && "opacity-0"
              )}
            >
              <Icon icon="ph:trophy-duotone" />
            </div>
          );
        },
      }),
      {
        header: "Raw Speed",
        accessorKey: "raw_speed",
      },
      {
        header: "Adjusted Speed",
        accessorKey: "adjusted_speed",
      },
      columnHelper.display({
        id: "duration",
        header: "Duration",
        cell: (props) => {
          const { minutes, seconds } = getDuration(
            props.row.original.started_at,
            props.row.original.ended_at
          );

          if (seconds > 60) return minutes.toFixed(2) + "m";
          return seconds.toFixed(2) + "s";
        },
      }),
      {
        header: "% Error",
        accessorKey: "percent_error",
        cell: (props) => props.getValue() + "%",
      },
      columnHelper.display({
        id: "score",
        header: "Score",
        cell: (props) => {
          return props.row.original.score;
        },
      }),
    ],
    [columnHelper, highestSpeedAndScore]
  );

  const { pageIndex, pageSize } = pagination;

  const PAGE = pageIndex * pageSize;
  const LIMIT = PAGE + pageSize;

  return (
    <Table
      isLoading={isLoading}
      data={datas?.slice(PAGE, LIMIT)}
      columns={type === "Lesson" ? columns.slice(0, -1) : columns}
      {...{
        pagination,
        onPaginationChange,
        pageCount: Math.ceil(datas.length / pageSize),
      }}
    />
  );
}

export default TypingTable;
