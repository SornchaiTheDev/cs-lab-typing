import { Play, Plus } from "lucide-react";
import TestCaseList from "./TestCaseList";
import useTestCase, { type TestCase } from "../../hooks/useTestCase";
import type { Dispatch, SetStateAction } from "react";

interface Props {
  languageId: number;
  sourceCode: string;
  testCases: TestCase[];
  setTestCases: Dispatch<SetStateAction<TestCase[]>>;
}

function TestCaseSection({
  languageId,
  sourceCode,
  testCases,
  setTestCases,
}: Props) {
  const {
    handleOnAddTestCase,
    handleOnInputChange,
    handleOnRunTestCase,
    handleOnRunAllTestCase,
    handleOnRemoveTestCase,
  } = useTestCase({ languageId, sourceCode, testCases, setTestCases });

  return (
    <div className="mb-2 mt-10">
      <div className="flex items-center gap-4">
        <h4 className="text-3xl font-bold text-sand-12">Test Cases</h4>
        <button
          onClick={handleOnRunAllTestCase}
          className="flex items-center gap-2 rounded-lg bg-lime-9 px-2 py-1 text-sm hover:bg-lime-10"
        >
          <Play size="0.9rem" />
          Run All
        </button>
      </div>
      <button
        onClick={handleOnAddTestCase}
        className="mt-3 flex items-center gap-2 rounded-lg bg-sand-12 px-4 py-1 text-sm text-sand-1 shadow hover:bg-sand-11"
      >
        <Plus />
        Add Case
      </button>
      <TestCaseList
        handleOnRunTestCase={handleOnRunTestCase}
        handleOnInputChange={handleOnInputChange}
        handleOnRemoveTestCase={handleOnRemoveTestCase}
        {...{ testCases }}
      />
    </div>
  );
}

export default TestCaseSection;
