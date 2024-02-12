import type { Dispatch, SetStateAction } from "react";

export interface TestCase {
  number: number;
  input: string;
  output: string;
}

interface Props {
  testCases: TestCase[];
  setTestCases: Dispatch<SetStateAction<TestCase[]>>;
}

function useTestCase({ testCases, setTestCases }: Props) {
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

  const handleOnRunTestCase = (number: number) => {
    const testCase = testCases.find((testCase) => testCase.number === number);
    if (testCase) {
      testCase.output = "Running...";
      setTestCases([...testCases]);
    }
  };

  const handleOnRunAllTestCase = () => {
    testCases.forEach((testCase) => {
      testCase.output = "Running...";
    });
    setTestCases([...testCases]);
  };

  const handleOnRemoveTestCase = (number: number) => {
    setTestCases((prev) =>
      prev.filter((testCase) => testCase.number !== number)
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
