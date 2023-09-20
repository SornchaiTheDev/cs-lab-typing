import { useEffect } from "react";
import FrontLayout from "~/Layout/FrontLayout";
import TypingGame from "~/components/Typing";
import EndedGame from "~/components/Typing/EndedGame";
import { useTypingStore } from "~/store";
import { useRouter } from "next/router";
import { replaceSlugwithQueryPath } from "~/helpers";
import Button from "~/components/Common/Button";
import History from "~/components/Typing/History";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import ProblemList from "~/components/ProblemList";
import superjson from "superjson";
import type { taskWithStatus } from "~/types";

interface Props {
  taskName: string;
  taskBody: string;
  courseName: string;
  labName: string;
  labStatus: string;
  tasks: string | null;
  sectionType: string | null;
}

function TypingTask({
  taskName,
  taskBody,
  courseName,
  labName,
  labStatus,
  tasks: stringifyTasks,
  sectionType,
}: Props) {
  const router = useRouter();

  const [status, setStatus, reset] = useTypingStore((state) => [
    state.status,
    state.setStatus,
    state.reset,
  ]);

  useEffect(() => {
    return () => {
      reset();
      setStatus("NotStarted");
    };
  }, [reset, setStatus]);

  const isTypingPhase = status === "NotStarted" || status === "Started";
  const isEndedPhase = status === "Ended";
  const isHistoryPhase = status === "History";
  const isReadOnly = labStatus === "READONLY";

  const tasks: taskWithStatus[] = !!stringifyTasks
    ? superjson.parse(stringifyTasks)
    : [];

  return (
    <>
      <FrontLayout
        title={taskName}
        customBackPath={`/courses/${replaceSlugwithQueryPath(
          "[sectionId]",
          router.query
        )}/labs/${replaceSlugwithQueryPath("[labId]", router.query)}`}
        breadcrumbs={[
          { label: "My Course", path: "/" },
          {
            label: courseName ?? "",
            path: `/courses/${replaceSlugwithQueryPath(
              "[sectionId]",
              router.query
            )}`,
          },
          {
            label: labName ?? "",
            path: `/courses/${replaceSlugwithQueryPath(
              "[sectionId]",
              router.query
            )}/labs/${replaceSlugwithQueryPath("[labId]", router.query)}`,
          },
        ]}
      >
        <div className="flex flex-1 flex-col">
          {!isReadOnly && !isEndedPhase && (
            <Button
              icon={
                isTypingPhase
                  ? "solar:history-line-duotone"
                  : "solar:keyboard-line-duotone"
              }
              className="w-fit self-center border border-sand-9 text-sand-12 hover:bg-sand-6"
              onClick={() =>
                setStatus(isTypingPhase ? "History" : "NotStarted")
              }
            >
              {isTypingPhase ? "History" : "Back to Typing"}
            </Button>
          )}

          <div className="mt-12 flex-1">
            {isReadOnly ? (
              <History />
            ) : isTypingPhase ? (
              <TypingGame text={taskBody} />
            ) : isEndedPhase ? (
              <>
                <ProblemList {...{ tasks, sectionType }} />
                <EndedGame />
              </>
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

export const getServerSideProps: GetServerSideProps<Props> = async (
  ctx: GetServerSidePropsContext
) => {
  const { req, res } = ctx;
  const { helper } = await createTrpcHelper({ req, res });
  const { labId, sectionId, taskId } = ctx.query;
  try {
    const { courseName, labName, labStatus, taskName, taskBody } =
      await helper.front.getTaskById.fetch({
        labId: labId as string,
        sectionId: sectionId as string,
        taskId: taskId as string,
      });

    const lab = await helper.front.getTasks.fetch({
      labId: labId as string,
      sectionId: sectionId as string,
    });

    let tasks = null;
    let sectionType = null;
    if (lab) {
      tasks = superjson.stringify(lab.tasks);
      sectionType = lab.sectionType;
    }

    return {
      props: {
        courseName,
        labName,
        labStatus,
        taskName,
        taskBody,
        tasks,
        sectionType,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
