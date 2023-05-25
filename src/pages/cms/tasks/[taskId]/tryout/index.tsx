import React, { useEffect } from "react";
import FrontLayout from "~/Layout/FrontLayout";
import TypingGame from "~/components/Typing";
import { useRouter } from "next/router";
import { useTypingStore } from "~/store";
import { trpc } from "~/helpers";
import Stats from "~/components/Typing/Stats";

function Tryout() {
  const router = useRouter();
  const taskId = parseInt(router.query.taskId as string);
  const [status, setStatus] = useTypingStore((state) => [
    state.status,
    state.setStatus,
  ]);
  const task = trpc.tasks.getTaskById.useQuery({ id: taskId });
  const backPath = router.pathname
    .split("/")
    .slice(0, -2)
    .concat(router.query.taskId as string)
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
      <div className="flex flex-1 flex-col">
        {status === "Ended" && <Stats />}
        <TypingGame text={task.data?.body ?? ""} />
      </div>
    </FrontLayout>
  );
}

export default Tryout;
