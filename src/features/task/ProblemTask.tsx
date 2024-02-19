import Button from "~/components/Common/Button";
import { useRef } from "react";
import type { MDXEditorMethods } from "@mdxeditor/editor";
import Skeleton from "~/components/Common/Skeleton";
import TestCaseSection from "./components/TestCase/TestCaseSection";
import useProblemTask from "./hooks/useProblemTask";
import SourceCodeSection from "./components/SourceCode/SourceCodeSection";
import DescriptionSection from "./components/Description/DescriptionSection";
import RuntimeConfigSection from "./components/RuntimeConf/RuntimeConfigSection";
import type { RuntimeConfig } from "~/store/problemTask";

interface Props {
  taskId: string;
}

function ProblemTask({ taskId }: Props) {
  const ref = useRef<MDXEditorMethods>(null);
  const {
    isLoading,
    isSaving,
    isAlreadySave,
    isSourceCodeChanged,
    isOwner,
    diffTaskBody,
    handleOnSaveProblem,
    config,
    updateRuntimeConfigWhereKey,
    resetRunTimeConfig,
    isAlreadyDefaultRuntimeConfig,
  } = useProblemTask({
    taskId,
    onDescriptionLoad: (description) => {
      ref.current?.setMarkdown(description);
    },
  });

  return (
    <div className="mb-6 mt-6 flex flex-1 flex-col rounded-lg">
      {isLoading ? (
        <Skeleton width="100%" className="flex-1" />
      ) : (
        <>
          <DescriptionSection mdxRef={ref} diffTaskBody={diffTaskBody} />

          <SourceCodeSection />

          <TestCaseSection />

          <RuntimeConfigSection
            isAlreadyDefaultRuntimeConfig={isAlreadyDefaultRuntimeConfig}
            config={config as RuntimeConfig}
            onUpdate={updateRuntimeConfigWhereKey}
            onReset={resetRunTimeConfig}
          />

          {isOwner && (
            <Button
              isLoading={isSaving}
              onClick={handleOnSaveProblem}
              disabled={isAlreadySave || isSourceCodeChanged}
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
