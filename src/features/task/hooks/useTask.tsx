import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { callToast } from "~/services/callToast";
import { trpc } from "~/utils";

interface Props {
  taskId: string;
}
function useTask({ taskId }: Props) {
  const [body, setBody] = useState<string>("");
  const { data } = useSession();

  const task = trpc.tasks.getTaskById.useQuery(
    { id: taskId as string },
    {
      enabled: !!taskId,
    }
  );

  useEffect(() => {
    if (task.data) {
      setBody(task.data.body ?? "");
    }
  }, [task.data]);

  const isOwner = task.data?.owner.full_name === data?.user?.full_name;

  const saveTask = trpc.tasks.setTaskBody.useMutation();

  const handleOnSaveTyping = async () => {
    if (body.length === 0) {
      return void callToast({ msg: "Task cannot be empty!", type: "error" });
    }
    try {
      const sanitizedText = body
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
      setBody(sanitizedText);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };

  const handleOnSaveProblem = async () => {
    try {
      await saveTask.mutateAsync({
        taskId: taskId as string,
        body,
      });
      callToast({ msg: "Save task successfully", type: "success" });
      task.refetch();
    } catch (err) {}
  };

  const isAlreadySave = task.data?.body === body;

  return {
    isLoading: task.isLoading,
    isSaving: saveTask.isLoading,
    task: task.data,
    isOwner,
    handleOnSaveTyping,
    handleOnSaveProblem,
    isAlreadySave,
    body,
    setBody,
  };
}

export default useTask;
