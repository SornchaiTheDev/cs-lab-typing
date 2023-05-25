import React from "react";
import FrontLayout from "~/Layout/FrontLayout";
import TypingGame from "~/components/Typing";
import { useRouter } from "next/router";
import { useTypingStore } from "~/store";
import EndedGame from "~/components/Typing/EndedGame";
import { trpc } from "~/helpers";

function Tryout() {
  const router = useRouter();
  const taskId = parseInt(router.query.taskId as string);
  const [status] = useTypingStore((state) => [state.status]);
  const task = trpc.tasks.getTaskById.useQuery({ id: taskId });
  return (
    <FrontLayout title="Task A" customBackPath="/">
      <div className="flex flex-1 flex-col">
        {status !== "Ended" ? (
          <TypingGame text={task.data?.body ?? ""} />
        ) : (
          <EndedGame />
        )}
      </div>
    </FrontLayout>
  );
}

export default Tryout;
