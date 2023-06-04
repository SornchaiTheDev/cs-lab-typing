import { useEffect } from "react";
import { useTypingStore } from "~/store";
import { getDuration } from "./utils/getDuration";
import { calculateTypingSpeed } from "./utils/calculateWPM";
import { calculateErrorPercentage } from "./utils/calculateErrorPercentage";
import { Icon } from "@iconify/react";
import Stats from "./Stats";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import LineChart from "./Datas/LineChart";
import TypingTable from "./Datas/Table";

function EndedGame() {
  const router = useRouter();
  const { sectionId, labId, taskId } = router.query;

  const sectionIdInt = parseInt(sectionId as string);
  const labIdInt = parseInt(labId as string);
  const taskIdInt = parseInt(taskId as string);

  const typingHistories = trpc.front.getTypingHistory.useQuery({
    sectionId: sectionIdInt,
    taskId: taskIdInt,
  });

  const [stats, setStatus] = useTypingStore((state) => [
    state.stats,
    state.setStatus,
  ]);
  const submitTyping = trpc.front.submitTyping.useMutation();

  useEffect(() => {
    const saveTypingScore = async () => {
      if (!stats) return;
      if (!labIdInt) return;
      if (!sectionIdInt) return;
      if (!taskIdInt) return;

      const { errorChar, startedAt, endedAt, totalChars } = stats;
      const { minutes } = getDuration(startedAt as Date, endedAt as Date);
      const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
        totalChars,
        errorChar,
        minutes
      );
      const percentError = calculateErrorPercentage(totalChars, errorChar);
      await submitTyping.mutateAsync({
        sectionId: sectionIdInt,
        labId: labIdInt,
        taskId: taskIdInt,
        rawSpeed,
        adjustedSpeed,
        percentError,
        startedAt: startedAt as Date,
        endedAt: endedAt as Date,
      });
      await typingHistories.refetch();
    };
    saveTypingScore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto mb-2 flex max-w-2xl flex-1 flex-col items-center gap-4">
      <button
        onClick={() => setStatus("NotStarted")}
        className="flex w-fit flex-col items-center rounded-md p-2 outline-none ring-sand-6 ring-offset-2 hover:bg-sand-3 focus:ring-2"
      >
        <Icon icon="solar:restart-line-duotone" fontSize="2rem" />
        <h6>Restart the test</h6>
      </button>
      <Stats />
      <div className="h-[10rem] w-full">
        <LineChart datas={typingHistories.data ?? []} />
      </div>
      <TypingTable
        isLoading={typingHistories.isLoading}
        datas={typingHistories.data ?? []}
      />
    </div>
  );
}

export default EndedGame;
