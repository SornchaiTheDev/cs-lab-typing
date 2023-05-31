import { useEffect } from "react";
import FrontLayout from "~/Layout/FrontLayout";
import TypingGame from "~/components/Typing";
import EndedGame from "~/components/Typing/EndedGame";
import { useTypingStore } from "~/store";
import { useRouter } from "next/router";
import { replaceSlugwithQueryPath, trpc } from "~/helpers";

function TypingTask() {
  const router = useRouter();
  const { taskId, labId, sectionId } = router.query;
  const taskIdInt = parseInt(taskId as string);
  const labIdInt = parseInt(labId as string);
  const sectionIdInt = parseInt(sectionId as string);
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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  return (
    <FrontLayout
      title={task.data?.task?.name ?? ""}
      customBackPath={`/courses/${replaceSlugwithQueryPath(
        "[courseId]",
        router.query
      )}/labs/`}
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
      <div className="flex flex-1 flex-col">
        {status !== "Ended" ? (
          <TypingGame text={task.data?.task?.body ?? ""} />
        ) : (
          <EndedGame />
        )}
      </div>
    </FrontLayout>
  );
}

export default TypingTask;
