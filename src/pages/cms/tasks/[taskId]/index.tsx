import InsideTaskLayout from "~/Layout/InsideTaskLayout";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import Button from "~/components/Common/Button";
import Skeleton from "~/components/Common/Skeleton";
import Badge from "~/components/Common/Badge";
import { callToast } from "~/services/callToast";
import { TRPCClientError } from "@trpc/client";

function TypingTask() {
  const [text, setText] = useState("");

  const router = useRouter();

  const taskId = parseInt(router.query.taskId as string);

  const task = trpc.tasks.getTaskById.useQuery({ id: taskId });
  const saveTask = trpc.tasks.setTaskBody.useMutation();

  const handleOnSave = async () => {
    try {
      await saveTask.mutateAsync({ id: taskId, body: text });
      callToast({ msg: "Save task successfully", type: "success" });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };

  const handleTryOut = async () => {
    await router.push({
      pathname: router.pathname + "/tryout",
      query: router.query,
    });
  };

  return (
    <InsideTaskLayout title="Typing Task" isLoading={task.isLoading}>
      <h4 className="mt-4 text-2xl">Task Information</h4>
      <h5 className="mb-2 mt-4 font-bold">Course Name</h5>
      {task.isLoading ? (
        <Skeleton width={"10rem"} height={"1.5rem"} />
      ) : (
        <h4 className="text-lg">{task.data?.name as string}</h4>
      )}
      <h5 className="mb-2 mt-4 font-bold">Note</h5>
      {task.isLoading ? (
        <Skeleton width={"10rem"} height={"1.5rem"} />
      ) : (
        <h4 className="text-lg">
          {(task.data?.note as string) === "" ? "-" : task.data?.note}
        </h4>
      )}
      <h5 className="mb-2 mt-4 font-bold">Author (s)</h5>
      <div className="flex flex-wrap gap-2">
        {task.isLoading ? (
          <Skeleton width={"10rem"} height={"1.5rem"} />
        ) : (
          <Badge>{task.data?.owner.full_name}</Badge>
        )}
      </div>
      <div className="my-2 flex-1">
        <textarea
          placeholder="Type here..."
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mt-4 min-h-[10rem] w-full rounded-md border-2 border-dashed border-sand-6 bg-transparent text-sand-12 outline-none focus:border-sand-10 focus:ring-transparent"
        />
        <div className="mt-4 flex gap-2">
          <Button
            onClick={handleTryOut}
            className="rounded bg-sand-12 text-sand-1 active:bg-sand-11"
            icon="solar:circle-bottom-up-line-duotone"
          >
            Try it out
          </Button>
          <Button
            isLoading={saveTask.isLoading}
            onClick={handleOnSave}
            className="rounded bg-sand-12 text-sand-1 active:bg-sand-11"
            icon="solar:diskette-line-duotone"
          >
            Save
          </Button>
        </div>
      </div>
    </InsideTaskLayout>
  );
}

export default TypingTask;
