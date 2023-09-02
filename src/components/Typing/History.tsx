import React, { useMemo, useState } from "react";
import TypingTable from "./Datas/Table";
import LineChart from "./Datas/LineChart";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";
import type { PaginationState } from "@tanstack/react-table";
import type { SectionType } from "@prisma/client";

interface Props {
  type?: SectionType;
}
function History({ type = "Lesson" }: Props) {
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

  const highestSpeedAndScore = useMemo(() => {
    if (typingHistories.data === undefined) return null;
    const cloneDatas = [...typingHistories.data];

    const highestSpeedAndScore = cloneDatas.sort(
      (prev, current) =>
        current.adjusted_speed +
        current.score -
        (prev.adjusted_speed + prev.score)
    );
    if (highestSpeedAndScore[0] !== undefined) {
      return highestSpeedAndScore[0].id;
    }

    return null;
  }, [typingHistories.data]);

  return (
    <div className="container mx-auto mb-2 flex max-w-2xl flex-1 flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-[10rem] w-full">
          <LineChart datas={typingHistories.data ?? []} />
        </div>
        <TypingTable
          type={type}
          isLoading={typingHistories.isLoading}
          datas={typingHistories.data ?? []}
          onPaginationChange={setPagination}
          {...{ pagination, highestSpeedAndScore }}
        />
      </div>
    </div>
  );
}

export default History;
