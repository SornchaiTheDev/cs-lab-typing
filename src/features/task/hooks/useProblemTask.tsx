import { useState } from "react";
import { trpc } from "~/utils";
import { callToast } from "~/services/callToast";
import useTask, { type TaskExtendedWithProblem } from "./useTask";
import { TestCaseStatus } from "~/store/editorTestCase";
import { useAtomValue, useSetAtom } from "jotai";
import {
  problemTaskAtom,
  setInitialProblemTaskAtom,
  isAlreadySaveAtom,
  isSourceCodeChangedAtom,
  type RuntimeConfig,
  resetRuntimeConfigAtom,
  updateConfigAtom,
} from "~/store/problemTask";
import { runtimeConfig } from "~/constants/runtime_config";

interface Props {
  taskId: string;
  onDescriptionLoad: (description: string) => void;
}

function useProblemTask({ taskId, onDescriptionLoad }: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [diffTaskBody, setDiffTaskBody] = useState<string>("");
  const utils = trpc.useUtils();
  const problemTaskStore = useAtomValue(problemTaskAtom);
  const setInitialProblemTask = useSetAtom(setInitialProblemTaskAtom);
  const isAlreadySave = useAtomValue(isAlreadySaveAtom);
  const isSourceCodeChanged = useAtomValue(isSourceCodeChangedAtom);

  const { description, testCases, sourceCode, config } = problemTaskStore;

  const handleOnTaskLoad = (task: TaskExtendedWithProblem) => {
    const problem = task?.problem;
    if (problem === null) return;

    const { description, source_code, testcases, runtime_config } = problem;
    const testCasesWithStatus = testcases.map((testcase) => ({
      ...testcase,
      status: TestCaseStatus.IDLE,
    }));

    setInitialProblemTask({
      description,
      sourceCode: source_code,
      testCases: testCasesWithStatus,
      languageId: task.language_id,
      config: runtime_config,
    });

    setDiffTaskBody(description);

    onDescriptionLoad(description);
  };

  const useTaskReturned = useTask({ taskId, onTaskLoad: handleOnTaskLoad });

  const saveProblemTask = trpc.tasks.setTaskProblem.useMutation();

  const handleOnSaveProblem = async () => {
    try {
      setIsSaving(true);
      await saveProblemTask.mutateAsync({
        taskId: taskId as string,
        description,
        sourceCode,
        testcases: testCases,
        runtimeConfig: config as RuntimeConfig,
      });
      callToast({ msg: "Save task successfully", type: "success" });
      utils.tasks.invalidate();
    } catch (err) {
    } finally {
      setIsSaving(false);
    }
  };

  const updateRuntimeConfigWhereKey = useSetAtom(updateConfigAtom);
  const resetRunTimeConfig = useSetAtom(resetRuntimeConfigAtom);

  const isAlreadyDefaultRuntimeConfig =
    JSON.stringify(config) === JSON.stringify(runtimeConfig);

  return {
    ...useTaskReturned,
    diffTaskBody,
    handleOnSaveProblem,
    isSaving,
    isAlreadySave,
    isSourceCodeChanged,
    config,
    updateRuntimeConfigWhereKey,
    resetRunTimeConfig,
    isAlreadyDefaultRuntimeConfig,
  };
}

export default useProblemTask;
