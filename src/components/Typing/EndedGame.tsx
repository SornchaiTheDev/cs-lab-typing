import { useEffect, useState } from "react";
import { useTypingStore } from "~/store";
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

  const [stats, setStatus] = useTypingStore((state) => [
    state.stats,
    state.setStatus,
  ]);

  const submitTyping = trpc.front.submitTyping.useMutation();
  const ctx = trpc.useContext();

  useEffect(() => {
    const saveTypingScore = async () => {
      if (!stats) return;
      const { errorChar, startedAt, endedAt, totalChars } = stats;
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
        await ctx.front.getTasks.refetch();
      } catch (err) {
        if (err instanceof TRPCClientError) {
          router.push("/");
          callToast({ type: "error", msg: err.message });
        }
      }
    };

    saveTypingScore();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mx-auto mb-2 flex max-w-2xl flex-1 flex-col items-center gap-4">
      <button
        onClick={() => setStatus("NotStarted")}
        className="flex w-fit flex-col items-center rounded-md p-2 text-sand-12 outline-none ring-sand-6 ring-offset-2 hover:bg-sand-3 focus:ring-2"
      >
        <Icon icon="solar:restart-line-duotone" fontSize="2rem" />
        <h6>Restart the test</h6>
      </button>
      <Stats />
      <div className="h-[10rem] w-full">
        <LineChart datas={typingHistories.data?.histories ?? []} />
      </div>
      <TypingTable
        isLoading={typingHistories.isLoading}
        datas={typingHistories.data?.histories ?? []}
        onPaginationChange={setPagination}
        highestScore={typingHistories.data?.highestScore ?? null}
        {...{ pagination }}
      />
    </div>
  );
}

export default EndedGame;
