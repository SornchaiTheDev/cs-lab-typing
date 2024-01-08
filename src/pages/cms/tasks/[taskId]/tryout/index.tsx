import React, { useEffect } from "react";
import FrontLayout from "~/layouts/FrontLayout";
import TypingGame from "~/components/Typing";
import { useRouter } from "next/router";
import { useTypingStore } from "~/store";
import { trpc } from "~/utils";
import Stats from "~/components/Typing/Stats";

function Tryout() {
  const router = useRouter();
  const { taskId } = router.query;
  const [setStatus, stats, reset] = useTypingStore((state) => [
    state.setStatus,
    state.stats,
    state.reset,
  ]);

  const isEnded = stats.endedAt !== null;

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
    return () => {
      reset();
      setStatus("NotStarted");
    };
  }, [setStatus, reset]);

  return (
    <FrontLayout
      title={task.data?.name ?? ""}
      isLoading={task.isLoading}
      customBackPath={backPath}
    >
      <div className="mt-10 flex flex-1 flex-col">
        {isEnded && <Stats />}
        <TypingGame text={task.data?.body ?? ""} />
      </div>
    </FrontLayout>
  );
}

export default Tryout;
