import React, { useMemo, useState } from "react";
import TypingTable from "./Datas/Table";
import LineChart from "./Datas/LineChart";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";
import type { PaginationState } from "@tanstack/react-table";

function History() {
  const router = useRouter();
  const { sectionId, taskId, labId } = router.query;

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 6,
  });

  const typingHistories = trpc.front.getTypingHistory.useQuery(
    {
      sectionId: sectionId as string,
      taskId: taskId as string,
      labId: labId as string,
    },
    {
      enabled: !!sectionId && !!taskId && !!labId,
    }
  );

  const highestSpeed = useMemo(() => {
    if (typingHistories.data === undefined) return -1;
    const cloneDatas = [...typingHistories.data];

    const highestSpeed = cloneDatas.sort(
      (prev, current) => current.adjusted_speed - prev.adjusted_speed
    );
    if (highestSpeed[0] !== undefined) {
      return highestSpeed[0].adjusted_speed;
    }

    return -1;
  }, [typingHistories.data]);

  return (
    <div className="container mx-auto mb-2 flex max-w-2xl flex-1 flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-[10rem] w-full">
          <LineChart datas={typingHistories.data ?? []} />
        </div>
        <TypingTable
          isLoading={typingHistories.isLoading}
          datas={typingHistories.data ?? []}
          onPaginationChange={setPagination}
          {...{ pagination, highestSpeed }}
        />
      </div>
    </div>
  );
}

export default History;
