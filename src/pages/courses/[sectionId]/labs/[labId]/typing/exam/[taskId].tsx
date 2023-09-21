import { useEffect } from "react";
import FrontLayout from "~/Layout/FrontLayout";
import TypingGame from "~/components/Typing";
import { useTypingStore } from "~/store";
import { useRouter } from "next/router";
import { replaceSlugwithQueryPath } from "~/helpers";
import Button from "~/components/Common/Button";
import History from "~/components/Typing/History";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import EndedGameExam from "~/components/Typing/EndedGameExam";
import dayjs from "dayjs";
import superjson from "superjson";
import ProblemList from "~/components/Typing/ProblemList";
import { taskWithStatus } from "~/types";

interface Props {
  taskName: string;
  taskBody: string;
  courseName: string;
  labName: string;
  labStatus: string;
}

function TypingTask({
  taskName,
  taskBody,
  courseName,
  labName,
  labStatus,
}: Props) {
  const router = useRouter();

  const [status, setStatus, reset] = useTypingStore((state) => [
    state.status,
    state.setStatus,
    state.reset,
  ]);

  const isTypingPhase = status === "NotStarted" || status === "Started";
  const isEndedPhase = status === "Ended";
  const isHistoryPhase = status === "History";
  const isReadOnly = labStatus === "READONLY";

  useEffect(() => {
    return () => {
      reset();
      setStatus("NotStarted");
    };
  }, [reset, setStatus]);

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
          {!isReadOnly && (
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
          <div className="mt-12 flex flex-1 flex-col">
            {isReadOnly || isHistoryPhase ? (
              <History type="Exam" />
            ) : isTypingPhase ? (
              <TypingGame text={taskBody} />
            ) : isEndedPhase ? (
              <>
                <ProblemList />
                <EndedGameExam />
              </>
            ) : null}
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
    const { courseName, labName, labStatus, taskName, taskBody, closed_at } =
      await helper.front.getTaskById.fetch({
        labId: labId as string,
        sectionId: sectionId as string,
        taskId: taskId as string,
      });
    let _labStatus = labStatus;
    const now = dayjs();

    if (dayjs(closed_at).diff(now, "second") <= 0) {
      _labStatus = "READONLY";
    }

    return {
      props: {
        courseName,
        labName,
        labStatus: _labStatus,
        taskName,
        taskBody,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
