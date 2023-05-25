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
  // useEffect(() => {
  //   setText(

  //   );
  // }, [setText]);
  return (
    <FrontLayout
      title="Task A"
      customBackPath={`/courses/${replaceSlugwithQueryPath(
        "[courseId]",
        router.query
      )}/labs/`}
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
        {status !== "Ended" ? (
          <TypingGame text="Her error is a sign that this thing or that has upset her. Does she care? Is it a hard part? She has to get used to the letters that she has to print. Is this order upset? Is she tired? Then she needs a short rest. Is it the rate? She need not raise her rate too high. Has she a good touch?" />
        ) : (
          <EndedGame />
        )}
      </div>
    </FrontLayout>
  );
}

export default TypingTask;
