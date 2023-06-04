import { Icon } from "@iconify/react";
import type { typing_histories } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { getDuration } from "../utils/getDuration";
import Table from "~/components/Common/Table";

interface Props {
  datas: typing_histories[];
  isLoading: boolean;
}

function TypingTable({ datas, isLoading }: Props) {
  const columnHelper = createColumnHelper<typing_histories>();

  const highestSpeed = useMemo(() => {
    const cloneDatas = [...datas];
    const highestSpeed = cloneDatas.sort(
      (prev, current) => current.adjusted_speed - prev.adjusted_speed
    );
    if (highestSpeed[0] !== undefined) {
      return highestSpeed[0].adjusted_speed;
    }

    return 0;
  }, [datas]);

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "round",
        size: 10,
        cell: (props) => {
          if (props.row.original.adjusted_speed === highestSpeed)
            return (
              <div className="w-fit rounded-full bg-yellow-3 p-2 text-xl text-yellow-10">
                <Icon icon="ph:trophy-duotone" />
              </div>
            );
          return null;
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
  return <Table isLoading={isLoading} data={datas} columns={columns} />;
}

export default TypingTable;
