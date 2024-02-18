import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import {
  addNewTestCaseAtom,
  isSourceCodeChangedAtom,
  problemTaskAtom,
  removeTestCaseAtom,
  testCasesAtom,
} from "~/store/problemTask";
import { trpc } from "~/utils";

function useTestCase() {
  const { sourceCode, languageId } = useAtomValue(problemTaskAtom);
  const [testCases, setTestCases] = useAtom(testCasesAtom);
  const handleOnAddTestCase = useSetAtom(addNewTestCaseAtom);
  const handleOnRemoveTestCase = useSetAtom(removeTestCaseAtom);
  const [isSourceCodeChanged, updateTmpSourceCode] = useAtom(
    isSourceCodeChangedAtom
  );

  const handleOnInputChange = (number: number) => (value: string) => {
    const testCase = testCases.find((testCase) => testCase.number === number);
    if (testCase) {
      testCase.input = value;
      setTestCases([...testCases]);
    }
  };

  const [isAllDone, setIsAllDone] = useState(true);
  const cmsSubmitCodeBatch = trpc.judge.cmsSubmitCodeBatch.useMutation();

  const handleOnRunAllTestCase = async () => {
    if (!languageId) return;
    const submissions = testCases.map(({ input }) => {
      return {
        language_id: languageId,
        source_code: sourceCode,
        stdin: input,
      };
    });
    try {
      setIsAllDone(false);
      const result = await cmsSubmitCodeBatch.mutateAsync(submissions);

      result.forEach((res, index) => {
        testCases[index]!.output = res.stdout ?? res.stderr ?? res.message;
      });
      setIsAllDone(true);
      updateTmpSourceCode(sourceCode);
    } catch (err) {}
    setTestCases([...testCases]);
  };

  return {
    testCases,
    isAllDone,
    isSourceCodeChanged,
    handleOnAddTestCase,
    handleOnInputChange,
    handleOnRunAllTestCase,
    handleOnRemoveTestCase,
  };
}

export default useTestCase;
