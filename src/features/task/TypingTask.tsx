import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Button from "~/components/Common/Button";
import Skeleton from "~/components/Common/Skeleton";
import { callToast } from "~/services/callToast";
import { trpc } from "~/utils";

interface Props {
  taskId: string;
}

function TypingTask({ taskId }: Props) {
  const { data } = useSession();
  const [text, setText] = useState("");

  const saveTask = trpc.tasks.setTaskBody.useMutation();

  const task = trpc.tasks.getTaskById.useQuery(
    { id: taskId as string },
    {
      enabled: !!taskId,
    }
  );

  useEffect(() => {
    setText(task.data?.body ?? "");
  }, [task.data]);

  const isOwner = task.data?.owner.full_name === data?.user?.full_name;
  const isAlreadySave = task.data?.body === text;

  const handleOnSave = async () => {
    if (text.length === 0) {
      return void callToast({ msg: "Task cannot be empty!", type: "error" });
    }
    try {
      const sanitizedText = text
        .split("\n")
        .filter((line) => !["", " "].includes(line))
        .map((line) => line.replace(/\s+/g, " ").trim())
        .join(" ");

      await saveTask.mutateAsync({
        taskId: taskId as string,
        body: sanitizedText,
      });
      callToast({ msg: "Save task successfully", type: "success" });
      task.refetch();
      setText(sanitizedText);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };
  return (
    <div className="my-2 mt-4 flex-1">
      {task.isLoading ? (
        <Skeleton width={"50%"} height={"10rem"} />
      ) : (
        <textarea
          placeholder="Type here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!isOwner}
          className="monospace min-h-[20rem] w-full rounded-md border-2 border-dashed border-sand-6 bg-transparent p-2 text-sand-12 outline-none focus:border-sand-10 focus:ring-transparent"
        />
      )}
      {isOwner && (
        <Button
          isLoading={saveTask.isLoading}
          onClick={handleOnSave}
          disabled={isAlreadySave}
          className="mt-4 w-full rounded bg-sand-12 px-4 text-sm text-sand-1 active:bg-sand-11 md:w-fit"
          icon="solar:diskette-line-duotone"
        >
          Save
        </Button>
      )}
    </div>
  );
}

export default TypingTask;
