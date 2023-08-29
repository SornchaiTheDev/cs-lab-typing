import React, { useEffect, useState } from "react";
import FrontLayout from "~/Layout/FrontLayout";
import TypingGame from "~/components/Typing";
import { useRouter } from "next/router";
import { useTypingStore } from "~/store";
import { trpc } from "~/helpers";
import Stats from "~/components/Typing/Stats";
import { getDuration } from "~/components/Typing/utils/getDuration";
import { calculateTypingSpeed } from "~/components/Typing/utils/calculateWPM";
import { calculateErrorPercentage } from "~/components/Typing/utils/calculateErrorPercentage";

function Tryout() {
  const router = useRouter();
  const { taskId } = router.query;
  const [setStatus, stats, reset] = useTypingStore((state) => [
    state.setStatus,
    state.stats,
    state.reset,
  ]);

  const [localStats, setLocalStats] = useState(stats);

  useEffect(() => {
    if (stats.endedAt) {
      setLocalStats(stats);
      reset();
    }
  }, [stats, reset]);

  const { errorChar, startedAt, endedAt, totalChars } = localStats;
  const duration = getDuration(startedAt as Date, endedAt as Date);
  const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
    totalChars,
    errorChar,
    duration.minutes
  );

  const errorPercentage = calculateErrorPercentage(totalChars, errorChar);

  const isEnded = localStats.endedAt !== null;

  const task = trpc.tasks.getTaskById.useQuery(
    { id: taskId as string },
    {
      enabled: !!taskId,
    }
  );
  const backPath = router.pathname
    .split("/")
    .slice(0, -2)
    .concat(taskId as string)
    .join("/");

  useEffect(() => {
    setStatus("NotStarted");
  }, [setStatus]);

  return (
    <FrontLayout
      title={task.data?.name ?? ""}
      isLoading={task.isLoading}
      customBackPath={backPath}
    >
      <div className="flex flex-1 flex-col mt-10">
        {isEnded && (
          <Stats {...{ adjustedSpeed, duration, errorPercentage, rawSpeed }} />
        )}
        <TypingGame text={task.data?.body ?? ""} />
      </div>
    </FrontLayout>
  );
}

export default Tryout;
