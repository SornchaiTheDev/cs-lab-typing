import { useEffect } from "react";
import FrontLayout from "~/Layout/FrontLayout";
import TypingGame from "~/components/Typing";
import EndedGame from "~/components/Typing/EndedGame";
import { useTypingStore } from "~/store";
import { useRouter } from "next/router";
import { replaceSlugwithQueryPath } from "~/helpers";

function TypingTask() {
  const router = useRouter();
  const [setText, status] = useTypingStore((state) => [
    state.setText,
    state.status,
  ]);
  useEffect(() => {
    setText(
      "This offer is only for fancy fresh fruit to be used as gifts. Try these and candy to suit the young lady. They are dandy. You can feel safe. Sales are easy and final. They go fast. After at least four days you can order daily or on Friday."
    );
  }, [setText]);
  return (
    <FrontLayout
      title="Task A"
      customBackPath="/"
      breadcrumbs={[
        { label: "My Course", path: "/" },
        {
          label: "Typing Test",
          path: `/courses/${replaceSlugwithQueryPath(
            "[courseId]",
            router.query
          )}`,
        },
        {
          label: "Lab001",
          path: `/courses/${replaceSlugwithQueryPath(
            "[courseId]",
            router.query
          )}/labs/`,
        },
      ]}
    >
      <div className="flex flex-1 flex-col">
        {status !== "Ended" ? <TypingGame /> : <EndedGame />}
      </div>
    </FrontLayout>
  );
}

export default TypingTask;
