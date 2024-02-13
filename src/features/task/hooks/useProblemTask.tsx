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
} from "~/store/problemTask";

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

  const { description, testCases, sourceCode } = problemTaskStore;

  const handleOnTaskLoad = (task: TaskExtendedWithProblem) => {
    const problem = task?.problem;
    if (problem === null) return;

    const { description, source_code, testcases } = problem;
    const testCasesWithStatus = testcases.map((testcase) => ({
      ...testcase,
      status: TestCaseStatus.IDLE,
    }));

    setInitialProblemTask({
      description,
      sourceCode: source_code,
      testCases: testCasesWithStatus,
      languageId: task.language_id,
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
      });
      callToast({ msg: "Save task successfully", type: "success" });
      utils.tasks.invalidate();
    } catch (err) {
    } finally {
      setIsSaving(false);
    }
  };

  const isAlreadySave = useAtomValue(isAlreadySaveAtom);

  return {
    ...useTaskReturned,
    diffTaskBody,
    handleOnSaveProblem,
    isSaving,
    isAlreadySave,
  };
}

export default useProblemTask;
