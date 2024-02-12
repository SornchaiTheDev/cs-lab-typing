import type { Dispatch, SetStateAction } from "react";
import { trpc } from "~/utils";

export interface TestCase {
  number: number;
  input: string;
  output: string;
}

interface Props {
  languageId: number;
  sourceCode: string;
  testCases: TestCase[];
  setTestCases: Dispatch<SetStateAction<TestCase[]>>;
}

function useTestCase({
  languageId,
  sourceCode,
  testCases,
  setTestCases,
}: Props) {
  const handleOnAddTestCase = () => {
    setTestCases((prev) => [
      ...prev,
      {
        number: prev.length + 1,
        input: "",
        output: "",
      },
    ]);
  };

  const handleOnInputChange = (number: number) => (value: string) => {
    const testCase = testCases.find((testCase) => testCase.number === number);
    if (testCase) {
      testCase.input = value;
      setTestCases([...testCases]);
    }
  };

  const submitCode = trpc.judge.cmsSubmitCode.useMutation();

  const handleOnRunTestCase = async (number: number) => {
    const testCase = testCases.find((testCase) => testCase.number === number);
    if (testCase) {
      try {
        const result = await submitCode.mutateAsync({
          language_id: languageId,
          source_code: sourceCode,
          stdin: testCase.input,
        });
        testCase.output = result.stdout;
        setTestCases([...testCases]);
      } catch (err) {}
    }
  };

  const cmsSubmitCodeBatch = trpc.judge.cmsSubmitCodeBatch.useMutation();

  const handleOnRunAllTestCase = async () => {
    const submissions = testCases.map(({ input }) => {
      return {
        language_id: languageId,
        source_code: sourceCode,
        stdin: input,
      };
    });
    try {
      const result = await cmsSubmitCodeBatch.mutateAsync(submissions);
      result.forEach((res, index) => {
        testCases[index]!.output = res.token;
      });
    } catch (err) {}
    setTestCases([...testCases]);
  };

  const handleOnRemoveTestCase = (number: number) => {
    setTestCases((prev) =>
      prev
        .filter((testCase) => testCase.number !== number)
        .map(({ input, output }, index) => ({
          number: index + 1,
          input,
          output,
        }))
    );
  };

  return {
    testCases,
    handleOnAddTestCase,
    handleOnInputChange,
    handleOnRunTestCase,
    handleOnRunAllTestCase,
    handleOnRemoveTestCase,
  };
}

export default useTestCase;
