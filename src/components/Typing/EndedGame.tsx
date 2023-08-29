import { useEffect, useMemo, useState } from "react";
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
import objectHash from "object-hash";
import type { TypingResultWithHashType } from "~/schemas/TypingResult";
import { useSession } from "next-auth/react";
import type { PaginationState } from "@tanstack/react-table";
import { callToast } from "~/services/callToast";
import { TRPCClientError } from "@trpc/client";

function EndedGame() {
  const router = useRouter();
  const { data: session } = useSession();

  const { sectionId, labId, taskId } = router.query;

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

  const [stats, setStatus,reset] = useTypingStore((state) => [
    state.stats,
    state.setStatus,
    state.reset
  ]);

  const { errorChar, startedAt, endedAt, totalChars } = stats;

  const submitTyping = trpc.front.submitTyping.useMutation();

  useEffect(() => {
    const saveTypingScore = async () => {
      if (!stats) return;
      try {
        const result: TypingResultWithHashType = {
          email: session?.user?.email as string,
          sectionId: sectionId as string,
          labId: labId as string,
          taskId: taskId as string,
          totalChars,
          errorChar,
          startedAt: startedAt as Date,
          endedAt: endedAt as Date,
        };

        result.hash = objectHash(result);
        await submitTyping.mutateAsync(result);

        await typingHistories.refetch();
      } catch (err) {
        if (err instanceof TRPCClientError) {
          callToast({ type: "error", msg: err.message });
        }
      }
    };

    saveTypingScore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const duration = getDuration(startedAt as Date, endedAt as Date);
  const { rawSpeed, adjustedSpeed } = calculateTypingSpeed(
    totalChars,
    errorChar,
    duration.minutes
  );

  const errorPercentage = calculateErrorPercentage(totalChars, errorChar);

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
    <div className="container mx-auto mb-2 flex max-w-2xl flex-1 flex-col items-center gap-4">
      <button
        onClick={() => setStatus("NotStarted")}
        className="flex w-fit flex-col items-center rounded-md p-2 text-sand-12 outline-none ring-sand-6 ring-offset-2 hover:bg-sand-3 focus:ring-2"
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
        onPaginationChange={setPagination}
        {...{ pagination, highestSpeed }}
      />
    </div>
  );
}

export default EndedGame;
