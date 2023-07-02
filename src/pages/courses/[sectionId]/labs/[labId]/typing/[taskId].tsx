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
import { prisma } from "~/server/db";
import type { SectionType } from "@prisma/client";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";

interface Props {
  sectionType: SectionType;
  taskName: string;
  taskBody: string;
  courseName: string;
  labName: string;
  labStatus: string;
}

function TypingTask({
  sectionType,
  taskName,
  taskBody,
  courseName,
  labName,
  labStatus,
}: Props) {
  const router = useRouter();
  const { taskId, labId, sectionId } = router.query;
  // const taskIdInt = taskId as string;
  // const labIdInt = labId as string;
  // const sectionIdInt = sectionId as string;

  const [status, setStatus] = useTypingStore((state) => [
    state.status,
    state.setStatus,
  ]);

  useEffect(() => {
    setStatus("NotStarted");
  }, [setStatus]);

  // const task = trpc.front.getTaskById.useQuery(
  //   {
  //     taskId: taskIdInt,
  //     labId: labIdInt,
  //     sectionId: sectionIdInt,
  //   },
  //   {
  //     enabled: !!taskIdInt && !!labIdInt && !!sectionIdInt,
  //   }
  // );

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
            {isReadOnly ? (
              <History />
            ) : isTypingPhase ? (
              <TypingGame text={taskBody} />
            ) : isEndedPhase ? (
              <EndedGame {...{ sectionType }} />
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
    const { courseName, labName, labStatus, sectionType, taskName, taskBody } =
      await helper.front.getTaskById.fetch({
        labId: labId as string,
        sectionId: sectionId as string,
        taskId: taskId as string,
      });

    return {
      props: {
        courseName,
        labName,
        labStatus,
        sectionType,
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
