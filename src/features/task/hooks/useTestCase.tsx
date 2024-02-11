import { useState } from "react";

export interface TestCase {
  number: number;
  input: string;
  output: string;
}

function useTestCase() {
  const [testCases, setTestCases] = useState<TestCase[]>([]);

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

  return {
    testCases,
    handleOnAddTestCase,
    handleOnInputChange,
    handleOnRunTestCase,
    handleOnRunAllTestCase,
  };
}

export default useTestCase;
