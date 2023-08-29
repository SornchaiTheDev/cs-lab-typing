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
import type { TypingExamResultWithHashType } from "~/schemas/TypingResult";
import { useSession } from "next-auth/react";
import type { PaginationState } from "@tanstack/react-table";
import { evaluate } from "~/helpers/evaluateTypingScore";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";

function EndedGameExam() {
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

  const [stats, setStatus, reset] = useTypingStore((state) => [
    state.stats,
    state.setStatus,
    state.reset,
  ]);

  const { errorChar, startedAt, endedAt, totalChars } = stats;

  const examSubmitTyping = trpc.front.examSubmitTyping.useMutation();

  useEffect(() => {
    const saveTypingScore = async () => {
      if (!stats) return;
      try {
        const result: TypingExamResultWithHashType = {
          liame: session?.user?.email as string,
          dInoitces: sectionId as string,
          dIbal: labId as string,
          dIksat: taskId as string,
          srahClatot: totalChars,
          rahCrorre: errorChar,
          tAdetrats: startedAt as Date,
          tAdedne: endedAt as Date,
        };

        result.hsah = objectHash(result);
        await examSubmitTyping.mutateAsync(result);

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

  const score = evaluate(adjustedSpeed, errorPercentage);

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
      <Stats
        {...{ adjustedSpeed, duration, errorPercentage, rawSpeed, score }}
      />
      <div className="h-[10rem] w-full">
        <LineChart datas={typingHistories.data ?? []} />
      </div>
      <TypingTable
        type="Exam"
        isLoading={typingHistories.isLoading}
        datas={typingHistories.data ?? []}
        onPaginationChange={setPagination}
        {...{ pagination, highestSpeed }}
      />
    </div>
  );
}

export default EndedGameExam;
