import { useEffect } from "react";
import FrontLayout from "~/Layout/FrontLayout";
import TypingGame from "~/components/Typing";
import EndedGame from "~/components/Typing/EndedGame";
import { useTypingStore } from "~/store";
import { useRouter } from "next/router";
import { replaceSlugwithQueryPath, trpc } from "~/helpers";
import Button from "~/components/Common/Button";
import Skeleton from "~/components/Common/Skeleton";
import History from "~/components/Typing/History";

function TypingTask() {
  const router = useRouter();
  const { taskId, labId, sectionId } = router.query;
  const taskIdInt = taskId as string;
  const labIdInt = labId as string;
  const sectionIdInt = sectionId as string;

  const [status, setStatus] = useTypingStore((state) => [
    state.status,
    state.setStatus,
  ]);

  useEffect(() => {
    setStatus("NotStarted");
  }, [setStatus]);

  const task = trpc.front.getTaskById.useQuery(
    {
      taskId: taskIdInt,
      labId: labIdInt,
      sectionId: sectionIdInt,
    },
    {
      enabled: !!taskIdInt && !!labIdInt && !!sectionIdInt,
    }
  );

  const isTypingPhase = status === "NotStarted" || status === "Started";
  const isEndedPhase = status === "Ended";
  const isHistoryPhase = status === "History";
  const isReadOnly = task.data?.labStatus === "READONLY";

  return (
    <>
      <FrontLayout
        title={task.data?.task?.name ?? ""}
        customBackPath={`/courses/${replaceSlugwithQueryPath(
          "[sectionId]",
          router.query
        )}/labs/${replaceSlugwithQueryPath("[labId]", router.query)}`}
        breadcrumbs={[
          { label: "My Course", path: "/" },
          {
            label: task.data?.section?.course.name ?? "",
            path: `/courses/${replaceSlugwithQueryPath(
              "[sectionId]",
              router.query
            )}`,
            isLoading: task.isLoading,
          },
          {
            label: task.data?.lab?.name ?? "",
            path: `/courses/${replaceSlugwithQueryPath(
              "[sectionId]",
              router.query
            )}/labs/${replaceSlugwithQueryPath("[labId]", router.query)}`,
            isLoading: task.isLoading,
          },
        ]}
      >
        <div className="flex flex-col flex-1">
          {!isReadOnly && (
            <Button
              icon={
                isTypingPhase
                  ? "solar:history-line-duotone"
                  : "solar:keyboard-line-duotone"
              }
              className="self-center border w-fit border-sand-9 hover:bg-sand-6"
              onClick={() =>
                setStatus(isTypingPhase ? "History" : "NotStarted")
              }
            >
              {isTypingPhase ? "History" : "Back to Typing"}
            </Button>
          )}
          <div className="flex flex-col flex-1 mt-12">
            {task.isLoading ? (
              <div className="flex flex-col gap-4 mt-4">
                <Skeleton width="100%" height="3rem" />
                <Skeleton width="100%" height="3rem" />
                <Skeleton width="100%" height="3rem" />
                <Skeleton width="20%" height="3rem" />
              </div>
            ) : isReadOnly ? (
              <History />
            ) : isTypingPhase ? (
              <TypingGame text={task.data?.task?.body ?? ""} />
            ) : isEndedPhase ? (
              <EndedGame />
            ) : (
              isHistoryPhase && <History />
            )}
          </div>
        </div>
      </FrontLayout>
    </>
  );
}

export default TypingTask;
