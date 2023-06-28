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
import { useSession } from "next-auth/react";
import axios from "axios";

interface Props {
  csrfToken: string;
}
function EndedGame({ csrfToken }: Props) {
  const router = useRouter();
  const { update } = useSession();
  const { sectionId, labId, taskId } = router.query;

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

  const [stats, setStatus] = useTypingStore((state) => [
    state.stats,
    state.setStatus,
  ]);

  const { errorChar, startedAt, endedAt, totalChars } = stats;
  const duration = getDuration(startedAt as Date, endedAt as Date);
  const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
    totalChars,
    errorChar,
    duration.minutes
  );

  const errorPercentage = calculateErrorPercentage(totalChars, errorChar);

  useEffect(() => {
    const saveTypingScore = async () => {
      if (!stats) return;
      await axios.post("/api/submitTyping", {
        sectionId: sectionId as string,
        labId: labId as string,
        taskId: taskId as string,
        rawSpeed,
        adjustedSpeed,
        percentError: errorPercentage,
        startedAt: startedAt as Date,
        endedAt: endedAt as Date,
        csrf_token: csrfToken,
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
      <Stats {...{ adjustedSpeed, duration, errorPercentage, rawSpeed }} />
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
