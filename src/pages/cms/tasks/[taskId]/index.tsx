import InsideTaskLayout from "~/layouts/InsideTaskLayout";
import { trpc } from "~/utils";
import { useRouter } from "next/router";
import Button from "~/components/Common/Button";
import Skeleton from "~/components/Common/Skeleton";
import Badge from "~/components/Common/Badge";
import { callToast } from "~/services/callToast";
import { TRPCClientError } from "@trpc/client";
import { useSession } from "next-auth/react";

function TypingTask() {
  const { data: session } = useSession();

  const router = useRouter();

  const { taskId } = router.query;

  const task = trpc.tasks.getTaskById.useQuery(
    { id: taskId as string },
    {
      enabled: !!taskId,
    }
  );

  const isProblemType = task.data?.type === "Problem" || task.isLoading;

  const isAdmin = session?.user?.roles.includes("ADMIN") ?? false;
  const isTeacher = session?.user?.roles.includes("TEACHER") ?? false;
  const isOwner = task.data?.owner.full_name === session?.user?.full_name;
  const isNotStudent = isAdmin || isTeacher || isOwner;

  const handleTryOut = async () => {
    await router.push({
      pathname: router.pathname + "/tryout",
      query: router.query,
    });
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

  return (
    <InsideTaskLayout
      title={task.data?.name ?? ""}
      isLoading={task.isLoading}
      canAccessToSettings={isOwner || isAdmin}
      canAccessToHistory={isNotStudent}
    >
      <div className="mt-4 flex flex-col justify-between gap-4 text-sand-12 md:flex-row">
        <div>
          <h4 className="mt-4 text-2xl">Task Information</h4>
          <h5 className="mb-2 mt-4 font-bold">Task type</h5>
          {task.isLoading ? (
            <Skeleton width={"10rem"} height={"1.5rem"} />
          ) : (
            <h4 className="text-lg">{task.data?.type as string}</h4>
          )}

          {isProblemType ? (
            <>
              <h5 className="mb-2 mt-4 font-bold">Language</h5>
              {task.isLoading ? (
                <Skeleton width={"10rem"} height={"1.5rem"} />
              ) : (
                <h4 className="text-lg">{task.data?.language as string}</h4>
              )}
            </>
          ) : null}
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
          {isNotStudent && (
            <Button
              onClick={handleCloneTask}
              isLoading={cloneTask.isLoading}
              className="h-fit w-fit rounded bg-sand-12 px-4 text-sm text-sand-1 active:bg-sand-11"
              icon="solar:clipboard-check-line-duotone"
            >
              Clone
            </Button>
          )}
        </div>
      </div>
    </InsideTaskLayout>
  );
}

export default TypingTask;
