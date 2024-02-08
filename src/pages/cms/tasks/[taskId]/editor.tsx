import React from "react";
import TypingTask from "~/features/task/TypingTask";
import InsideTaskLayout from "~/layouts/InsideTaskLayout";
import { useRouter } from "next/router";
import { createTrpcHelper } from "~/utils/createTrpcHelper";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import ProblemTask from "~/features/task/ProblemTask";

interface Props {
  taskType: "Lesson" | "Problem" | "Typing";
}

function Editor({ taskType }: Props) {
  const router = useRouter();
  const { taskId } = router.query;

  const isTypingTask = taskType === "Typing";
  const isProblemTask = taskType === "Problem";

  return (
    <InsideTaskLayout title="Editor" canAccessToHistory canAccessToSettings>
      {isTypingTask && <TypingTask taskId={taskId as string} />}
      {isProblemTask && <ProblemTask taskId={taskId as string} />}
    </InsideTaskLayout>
  );
}

export default Editor;

export const getServerSideProps: GetServerSideProps<Props> = async (
  ctx: GetServerSidePropsContext
) => {
  const { req, res } = ctx;
  const { helper } = await createTrpcHelper({ req, res });

  const task = await helper.tasks.getTaskById.fetch({
    id: ctx.query.taskId as string,
  });
  if (!task) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      taskType: task.type,
    },
  };
};
