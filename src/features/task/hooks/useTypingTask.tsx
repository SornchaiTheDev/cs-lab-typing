import { TRPCClientError } from "@trpc/client";
import { useState } from "react";
import { callToast } from "~/services/callToast";
import { trpc } from "~/utils";
import useTask from "./useTask";

interface Props {
  taskId: string;
}

function useTypingTask({ taskId }: Props) {
  const { task } = useTask({ taskId });
  const [body, setBody] = useState<string>("");
  const saveTypingTask = trpc.tasks.setTaskBody.useMutation();

  const isAlreadySave = task?.body === body;

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

      await saveTypingTask.mutateAsync({
        taskId: taskId as string,
        body: sanitizedText,
      });
      callToast({ msg: "Save task successfully", type: "success" });
      setBody(sanitizedText);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };

  return {
    body,
    setBody,
    isAlreadySave,
    handleOnSaveTyping,
  };
}

export default useTypingTask;
