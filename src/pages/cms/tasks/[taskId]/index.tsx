import InsideTaskLayout from "~/Layout/InsideTaskLayout";
import { useEffect, useState } from "react";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import Button from "~/components/Common/Button";
import Skeleton from "~/components/Common/Skeleton";
import Badge from "~/components/Common/Badge";
import { callToast } from "~/services/callToast";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";

function TypingTask() {
  const { data: session } = useSession();
  const [text, setText] = useState("");

  const router = useRouter();

  const taskId = parseInt(router.query.taskId as string);

  const task = trpc.tasks.getTaskById.useQuery({ id: taskId });
  const saveTask = trpc.tasks.setTaskBody.useMutation();

  const isAdmin = session?.user?.roles.includes("ADMIN") ?? false;
  const isOwner = task.data?.owner.full_name === session?.user?.full_name;

  const isAlreadySave = task.data?.body === text;

  const handleOnSave = async () => {
    try {
      await saveTask.mutateAsync({ id: taskId, body: text });
      callToast({ msg: "Save task successfully", type: "success" });
      task.refetch();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };

  const handleTryOut = async () => {
    if (text.length === 0) {
      return void callToast({ msg: "Task cannot be empty!", type: "error" });
    }
    if (text != task.data?.body) {
      callToast({
        msg: "Please save you work before. Try it out!",
        type: "error",
      });
    } else {
      await router.push({
        pathname: router.pathname + "/tryout",
        query: router.query,
      });
    }
  };

  const cloneTask = trpc.tasks.cloneTask.useMutation();
  const handleCloneTask = async () => {
    try {
      if (task.data) {
        const _task = await cloneTask.mutateAsync({
          id: task.data.id,
        });
        if (_task) {
          await router.push({
            pathname: "/cms/tasks/[taskId]",
            query: { taskId: _task.id },
          });
        }
      }

      callToast({ msg: "Clonned task successfully", type: "success" });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  useEffect(() => {
    if (task.data?.body) {
      setText(task.data?.body);
    }
  }, [task.data?.body]);

  return (
    <InsideTaskLayout
      title={task.data?.name ?? ""}
      isLoading={task.isLoading}
      canAccessToSettings={isOwner || isAdmin}
    >
      <div className="mt-4 flex justify-between">
        <div>
          <h4 className="mt-4 text-2xl">Task Information</h4>
          <h5 className="mb-2 mt-4 font-bold">Task type</h5>
          {task.isLoading ? (
            <Skeleton width={"10rem"} height={"1.5rem"} />
          ) : (
            <h4 className="text-lg">{task.data?.type as string}</h4>
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
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleTryOut}
            className="h-fit rounded bg-sand-12 px-4 text-sm text-sand-1 active:bg-sand-11"
            icon="solar:circle-bottom-up-line-duotone"
          >
            Try it out
          </Button>
          <Button
            onClick={handleCloneTask}
            isLoading={cloneTask.isLoading}
            className="h-fit w-fit rounded bg-sand-12 px-4 text-sm text-sand-1 active:bg-sand-11"
            icon="solar:clipboard-check-line-duotone"
          >
            Clone
          </Button>
        </div>
      </div>

      <div className="my-2 mt-4 flex-1">
        {task.isLoading ? (
          <Skeleton width={"50%"} height={"10rem"} />
        ) : (
          <textarea
            placeholder="Type here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={!isOwner}
            className="min-h-[10rem] w-1/2 rounded-md border-2 border-dashed border-sand-6 bg-transparent text-sand-12 outline-none focus:border-sand-10 focus:ring-transparent"
          />
        )}
        {isOwner && (
          <Button
            isLoading={saveTask.isLoading}
            onClick={handleOnSave}
            disabled={isAlreadySave}
            className="rounded bg-sand-12 px-4 text-sm text-sand-1 active:bg-sand-11"
            icon="solar:diskette-line-duotone"
          >
            Save
          </Button>
        )}
      </div>
    </InsideTaskLayout>
  );
}

export default TypingTask;
