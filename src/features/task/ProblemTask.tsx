import Button from "~/components/Common/Button";
import MDXEditor from "~/components/Editor";
import useTask from "./hooks/useTask";
import { useRef } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";

interface Props {
  taskId: string;
}

function ProblemTask({ taskId }: Props) {
  const ref = useRef<MDXEditorMethods>(null);
  const {
    body,
    setBody,
    isOwner,
    isSaving,
    isAlreadySave,
    handleOnSaveProblem,
  } = useTask({
    taskId,
    onTaskLoad: (body) => {
      ref.current?.setMarkdown(body);
    },
  });

  return (
    <div className="mb-6 mt-6 flex flex-1 flex-col rounded-lg">
      <div className="flex-1 rounded-lg border border-sand-6">
        <MDXEditor
          ref={ref}
          autoFocus
          onChange={setBody}
          contentEditableClassName="p-4 prose max-w-none dark:text-ascent-1 before:prose-code:content-[''] after:prose-code:content-['']"
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
