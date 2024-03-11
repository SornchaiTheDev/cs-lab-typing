import { useEffect } from "react";
import FrontLayout from "~/layouts/FrontLayout";
import TypingGame from "~/components/Typing";
import EndedGame from "~/components/Typing/EndedGame";
import { useTypingStore } from "~/store";
import { useRouter } from "next/router";
import { replaceSlugwithQueryPath } from "~/utils";
import Button from "~/components/Common/Button";
import History from "~/components/Typing/History";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { createTrpcHelper } from "~/utils/createTrpcHelper";
import ProblemList from "~/components/Typing/ProblemList";
import dayjs from "dayjs";

interface Props {
  taskName: string;
  taskBody: string;
  courseName: string;
  labName: string;
  labStatus: string;
  sectionType: "Lesson" | "Exam";
}

function TypingTask({
  taskName,
  taskBody,
  courseName,
  labName,
  labStatus,
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
    };
  }, [reset]);

  const isTypingPhase = status === "NotStarted" || status === "Started";
  const isEndedPhase = status === "Ended";
  const isHistoryPhase = status === "History";
  const isReadOnly = labStatus === "READONLY";

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
        <div className="mx-24 flex flex-1 flex-col">
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
              <History type={sectionType} />
            ) : isTypingPhase ? (
              <TypingGame text={taskBody} />
            ) : isEndedPhase ? (
              <>
                <ProblemList />
                <EndedGame {...{ sectionType }} />
              </>
            ) : (
              isHistoryPhase && <History type={sectionType} />
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
    const {
      courseName,
      labName,
      labStatus,
      taskName,
      taskBody,
      closed_at,
      sectionType,
    } = await helper.front.getTaskById.fetch({
      labId: labId as string,
      sectionId: sectionId as string,
      taskId: taskId as string,
    });

    let _labStatus = labStatus;
    const now = dayjs();

    if (dayjs(closed_at).diff(now, "second") <= 0) {
      _labStatus = "READONLY";
    }

    if (taskBody === null) {
      return {
        notFound: true,
      };
    }

    return {
      props: {
        courseName,
        labName,
        labStatus: _labStatus,
        taskName,
        taskBody,
        sectionType,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
