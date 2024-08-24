import { useAtom, useSetAtom } from "jotai";
import { useState } from "react";
import {
  addNewTestCaseAtom,
  isSourceCodeChangedAtom,
  removeTestCaseAtom,
  testCasesAtom,
} from "~/store/problemTask";

function useTestCase() {
  // const { sourceCode } = useAtomValue(problemTaskAtom);
  const [testCases, setTestCases] = useAtom(testCasesAtom);
  const handleOnAddTestCase = useSetAtom(addNewTestCaseAtom);
  const handleOnRemoveTestCase = useSetAtom(removeTestCaseAtom);
  const [isSourceCodeChanged] = useAtom(isSourceCodeChangedAtom);

  const handleOnInputChange = (number: number) => (value: string) => {
    const testCase = testCases.find((testCase) => testCase.number === number);
    if (testCase) {
      testCase.input = value;
      setTestCases([...testCases]);
    }
  };

  const [isAllDone] = useState(true);
  // const cmsSubmitCodeBatch = trpc.judge.cmsSubmitCodeBatch.useMutation();

  const handleOnRunAllTestCase = async () => {
    // try {
    //   setIsAllDone(false);
    //   const result = await cmsSubmitCodeBatch.mutateAsync(submissions);
    //
    //   result.forEach((res, index) => {
    //     testCases[index]!.output = res.stdout ?? res.stderr ?? res.message;
    //   });
    //   setIsAllDone(true);
    //   updateTmpSourceCode(sourceCode);
    // } catch (err) {}
    // setTestCases([...testCases]);
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
