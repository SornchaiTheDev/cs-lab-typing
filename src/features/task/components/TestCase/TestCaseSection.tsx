import { Play, Plus } from "lucide-react";
import TestCaseList from "./TestCaseList";
import useTestCase from "../../hooks/useTestCase";

function TestCaseSection() {
  const {
    testCases,
    handleOnAddTestCase,
    handleOnInputChange,
    handleOnRunTestCase,
    handleOnRunAllTestCase,
  } = useTestCase();

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
        {...{ testCases }}
      />
    </div>
  );
}

export default TestCaseSection;
