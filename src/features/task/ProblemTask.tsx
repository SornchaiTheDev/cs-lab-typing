import Button from "~/components/Common/Button";
import MDXEditor from "~/components/Editor";
import useTask from "./hooks/useTask";
import { useRef, useState } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import Skeleton from "~/components/Common/Skeleton";
import CodemirrorRoot from "~/components/Codemirror";
import TestCaseSection from "./components/TestCase/TestCaseSection";

interface Props {
  taskId: string;
}

function ProblemTask({ taskId }: Props) {
  const ref = useRef<MDXEditorMethods>(null);
  const {
    diffTaskBody,
    body,
    setBody,
    isOwner,
    isLoading,
    isSaving,
    isAlreadySave,
    handleOnSaveProblem,
  } = useTask({
    taskId,
    onTaskLoad: (body) => {
      ref.current?.setMarkdown(body);
    },
  });

  const [sourceCode, setSourceCode] = useState<string>("");

  return (
    <div className="mb-6 mt-6 flex flex-1 flex-col rounded-lg">
      {isLoading ? (
        <Skeleton width="100%" className="flex-1" />
      ) : (
        <>
          <h4 className="mb-4 text-3xl font-bold text-sand-12 ">Description</h4>
          <div className="-z-0 min-h-[300px] overflow-hidden rounded-lg border border-sand-6 bg-white text-sand-12 dark:bg-sand-2 ">
            <MDXEditor
              ref={ref}
              autoFocus
              onChange={setBody}
              diffMarkdown={diffTaskBody}
              contentEditableClassName="p-4 prose prose-sand max-w-none prose before:prose-code:content-[''] after:prose-code:content-['']"
              markdown={body}
            />
          </div>

          <div className="mb-2 mt-10">
            <h4 className="text-3xl font-bold text-sand-12">Source Code</h4>
            <div className="mt-4 overflow-hidden rounded-lg border border-sand-6">
              <CodemirrorRoot syntaxHighlighting value={sourceCode} onChange={setSourceCode} minHeight="300px" />
            </div>
          </div>

          <TestCaseSection />

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
        </>
      )}
    </div>
  );
}

export default ProblemTask;
