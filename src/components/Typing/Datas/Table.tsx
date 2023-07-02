import { Icon } from "@iconify/react";
import type { typing_histories } from "@prisma/client";
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
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState> | undefined;
  highestSpeed: number;
}

function TypingTable({
  datas,
  isLoading,
  pageCount,
  pagination,
  onPaginationChange,
  highestSpeed,
}: Props) {
  const columnHelper = createColumnHelper<typing_histories>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "round",
        size: 10,
        cell: (props) => {
          const isHighestSpeed =
            props.row.original.adjusted_speed === highestSpeed;
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

          if (seconds > 60) return minutes + "m";
          return seconds + "s";
        },
      }),
      {
        header: "% Error",
        accessorKey: "percent_error",
        cell: (props) => props.getValue() + "%",
      },
    ],
    [columnHelper, highestSpeed]
  );
  return (
    <Table
      isLoading={isLoading}
      data={datas}
      columns={columns}
      {...{ pagination, onPaginationChange, pageCount }}
    />
  );
}

export default TypingTable;
