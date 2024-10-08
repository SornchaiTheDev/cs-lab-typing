import React, { useState } from "react";
import TypingTable from "./Datas/Table";
import LineChart from "./Datas/LineChart";
import { useRouter } from "next/router";
import { trpc } from "~/utils";
import type { PaginationState } from "@tanstack/react-table";
import type { Prisma, SectionType } from "@prisma/client";

interface Props {
  type?: SectionType;
}

export type typing_histories = Prisma.typing_historiesGetPayload<{
  select: {
    id: true;
    raw_speed: true;
    adjusted_speed: true;
    percent_error: true;
    score: true;
    started_at: true;
    ended_at: true;
    created_at: true;
  };
}>;

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

  return (
    <div className="container mx-auto mb-2 flex max-w-2xl flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-[10rem] w-full">
          <LineChart datas={typingHistories.data?.histories ?? []} />
        </div>
        <TypingTable
          type={type}
          isLoading={typingHistories.isLoading}
          datas={typingHistories.data?.histories ?? []}
          highestScore={typingHistories.data?.highestScore ?? null}
          onPaginationChange={setPagination}
          {...{ pagination }}
        />
      </div>
    </div>
  );
}

export default History;
