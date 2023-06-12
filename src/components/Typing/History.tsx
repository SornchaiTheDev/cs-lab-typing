import React from "react";
import TypingTable from "./Datas/Table";
import LineChart from "./Datas/LineChart";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";

function History() {
  const router = useRouter();
  const { sectionId, taskId, labId } = router.query;
  const sectionIdInt = parseInt(sectionId as string);
  const taskIdInt = parseInt(taskId as string);
  const labIdInt = parseInt(labId as string);

  const typingHistories = trpc.front.getTypingHistory.useQuery({
    sectionId: sectionIdInt,
    taskId: taskIdInt,
    labId: labIdInt,
  });

  const datas = typingHistories.data ?? [];

  return (
    <div className="container mx-auto mb-2 flex max-w-2xl flex-1 flex-col gap-4">
      <div className="flex flex-col items-center gap-4">
        <div className="h-[10rem] w-full">
          <LineChart datas={typingHistories.data ?? []} />
        </div>
        <TypingTable isLoading={typingHistories.isLoading} datas={datas} />
      </div>
    </div>
  );
}

export default History;
