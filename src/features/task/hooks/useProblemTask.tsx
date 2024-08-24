import { useState } from "react";
import { trpc } from "~/utils";
import { callToast } from "~/services/callToast";
import useTask, { type TaskExtendedWithProblem } from "./useTask";
import { TestCaseStatus } from "~/store/editorTestCase";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  problemTaskAtom,
  setInitialProblemTaskAtom,
  isAlreadySaveAtom,
  isSourceCodeChangedAtom,
  type RuntimeConfig,
  resetRuntimeConfigAtom,
  updateConfigAtom,
  descriptionAtom,
  sourceCodeAtom,
} from "~/store/problemTask";
import { runtimeConfig } from "~/constants/runtime_config";

interface Props {
  taskId: string;
}

function useProblemTask({ taskId }: Props) {
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const utils = trpc.useUtils();
  const problemTaskStore = useAtomValue(problemTaskAtom);
  const setInitialProblemTask = useSetAtom(setInitialProblemTaskAtom);
  const isAlreadySave = useAtomValue(isAlreadySaveAtom);
  const isSourceCodeChanged = useAtomValue(isSourceCodeChangedAtom);

  const { testCases, diffTaskBody, config } = problemTaskStore;

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
      diffTaskBody: description,
      sourceCode: source_code,
      testCases: testCasesWithStatus,
      config: runtime_config,
    });
  };

  const [description, setDescription] = useAtom(descriptionAtom);
  const [sourceCode, setSourceCode] = useAtom(sourceCodeAtom);

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
    description,
    setDescription,
    sourceCode,
    setSourceCode,
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
