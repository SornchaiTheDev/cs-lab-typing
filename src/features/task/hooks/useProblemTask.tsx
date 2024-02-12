import { useState } from "react";
import type { TestCase } from "./useTestCase";
import { trpc } from "~/utils";
import { callToast } from "~/services/callToast";
import useTask, { type TaskExtendedWithProblem } from "./useTask";
import { isFieldDiff } from "~/utils/isFieldDiff";

interface Props {
  taskId: string;
  onDescriptionLoad: (description: string) => void;
}

function useProblemTask({ taskId, onDescriptionLoad }: Props) {
  const [description, setDescription] = useState<string>("");
  const [sourceCode, setSourceCode] = useState<string>("");
  const [testCases, setTestCases] = useState<TestCase[]>([]);
  const [diffTaskBody, setDiffTaskBody] = useState<string>("");
  const [allFieldsInitialValues, setInitialValues] = useState<string>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const utils = trpc.useUtils();

  const handleOnTaskLoad = (task: TaskExtendedWithProblem) => {
    const problem = task?.problem;
    if (problem === null) return;
    const { description, source_code, testcases } = problem;
    setDescription(description);
    setSourceCode(source_code);
    setTestCases(testcases);
    setDiffTaskBody(description);
    setInitialValues(
      [description, source_code, testcases.toString()].toString()
    );
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

  const allFieldCurrentValues = [
    description,
    sourceCode,
    testCases.toString(),
  ].toString();

  const isAlreadySave = !isFieldDiff(
    allFieldCurrentValues,
    allFieldsInitialValues
  );
  return {
    ...useTaskReturned,
    description,
    setDescription,
    sourceCode,
    setSourceCode,
    testCases,
    setTestCases,
    handleOnSaveProblem,
    isSaving,
    isAlreadySave,
    diffTaskBody,
  };
}

export default useProblemTask;
