import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { callToast } from "~/services/callToast";
import { trpc } from "~/utils";
import useTask, { type TaskExtendedWithProblem } from "./useTask";

interface Props {
  taskId: string;
}

function useTypingTask({ taskId }: Props) {
  const { task } = useTask({ taskId });
  const [body, setBody] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const saveTypingTask = trpc.tasks.setTaskBody.useMutation();
  const isDBTaskBodyEmpty = task?.body === null;
  const isAlreadySave = isDBTaskBodyEmpty
    ? body.length === 0
    : task?.body === body;

  const utils = trpc.useUtils();

  const handleOnTaskLoad = (task: TaskExtendedWithProblem) => {
    if (task === null) return;
    const { body } = task;
    setBody(body ?? "");
  };

  const useTaskReturned = useTask({ taskId, onTaskLoad: handleOnTaskLoad });

  const handleOnSaveTyping = async () => {
    if (body.length === 0) {
      return void callToast({ msg: "Task cannot be empty!", type: "error" });
    }
    try {
      setIsSaving(true);
      const sanitizedText = body
        .split("\n")
        .filter((line) => !["", " "].includes(line))
        .map((line) => line.replace(/\s+/g, " ").trim())
        .join(" ");

      await saveTypingTask.mutateAsync({
        taskId: taskId as string,
        body: sanitizedText,
      });
      callToast({ msg: "Save task successfully", type: "success" });
      setBody(sanitizedText);
      utils.tasks.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    } finally {
      setIsSaving(false);
    }
  };

  return {
    ...useTaskReturned,
    body,
    setBody,
    isSaving,
    isAlreadySave,
    handleOnSaveTyping,
  };
}

export default useTypingTask;
