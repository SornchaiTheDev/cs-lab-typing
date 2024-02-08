import React from "react";
import TypingTask from "~/features/task/TypingTask";
import InsideTaskLayout from "~/layouts/InsideTaskLayout";
import { useRouter } from "next/router";

function Editor() {
  const router = useRouter();
  const { taskId } = router.query;
  return (
    <InsideTaskLayout title="Editor" canAccessToHistory canAccessToSettings>
      <TypingTask taskId={taskId as string} />
    </InsideTaskLayout>
  );
}

export default Editor;
