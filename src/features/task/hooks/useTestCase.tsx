import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { TestCaseStatus } from "~/store/editorTestCase";
import {
  addNewTestCaseAtom,
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

  const handleOnInputChange = (number: number) => (value: string) => {
    const testCase = testCases.find((testCase) => testCase.number === number);
    if (testCase) {
      testCase.input = value;
      setTestCases([...testCases]);
    }
  };

  const submitCode = trpc.judge.cmsSubmitCode.useMutation();

  const handleOnRunTestCase = async (number: number) => {
    if (!languageId) return;
    const testCase = testCases.find((testCase) => testCase.number === number);
    if (testCase) {
      try {
        testCase.status = TestCaseStatus.RUNNING;
        setTestCases([...testCases]);
        const result = await submitCode.mutateAsync({
          language_id: languageId,
          source_code: sourceCode,
          stdin: testCase.input,
        });
        testCase.output = result.stdout;
        testCase.status = TestCaseStatus.IDLE;
        setTestCases([...testCases]);
      } catch (err) {}
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
        testCases[index]!.output = res.stdout;
      });
      setIsAllDone(true);
    } catch (err) {}
    setTestCases([...testCases]);
  };

  return {
    testCases,
    isAllDone,
    handleOnAddTestCase,
    handleOnInputChange,
    handleOnRunTestCase,
    handleOnRunAllTestCase,
    handleOnRemoveTestCase,
  };
}

export default useTestCase;
