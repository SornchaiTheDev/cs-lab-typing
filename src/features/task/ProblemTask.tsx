import Button from "~/components/Common/Button";
import MDXEditor from "~/components/Editor";
import useTask from "./hooks/useTask";
import { useEffect, useRef } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";

interface Props {
  taskId: string;
}
function ProblemTask({ taskId }: Props) {
  const {
    body,
    setBody,
    isOwner,
    isSaving,
    isAlreadySave,
    handleOnSaveProblem,
  } = useTask({
    taskId,
  });

  const ref = useRef<MDXEditorMethods>(null);

  useEffect(() => {
    if (body != "") {
      ref.current?.setMarkdown(body);
    }
  }, [body]);

  return (
    <div className="mb-6 mt-6 flex flex-1 flex-col rounded-lg ">
      <div className="max-h-[60vh] flex-1 overflow-y-auto rounded-lg border border-sand-6">
        <MDXEditor
          ref={ref}
          autoFocus
          onChange={setBody}
          className="prose max-w-none dark:prose-headings:text-ascent-1 dark:text-ascent-1 dark:prose-code:text-ascent-1 dark:prose-strong:text-ascent-1 min-w-full"
          markdown={body}
        />
      </div>

      {isOwner && (
        <Button
          isLoading={isSaving}
          onClick={handleOnSaveProblem}
          disabled={isAlreadySave}
          className="mt-4 w-full rounded bg-sand-12 px-4 text-sm text-sand-1 active:bg-sand-11 md:w-fit"
          icon="solar:diskette-line-duotone"
        >
          Save
        </Button>
      )}
    </div>
  );
}

export default ProblemTask;
