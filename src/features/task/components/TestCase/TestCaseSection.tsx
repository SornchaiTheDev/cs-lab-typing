import { Plus } from "lucide-react";
import TestCaseList from "./TestCaseList";
import useTestCase from "../../hooks/useTestCase";
import * as Collapse from "~/components/Common/Collapse";
import RunningButton from "./RunningButton";
import ExecuteStatus from "./ExecuteStatus";

function TestCaseSection() {
  const {
    isAllDone,
    isSourceCodeChanged,
    handleOnAddTestCase,
    handleOnInputChange,
    handleOnRunAllTestCase,
    handleOnRemoveTestCase,
  } = useTestCase();

  return (
    <div className="mb-2 mt-10">
      <Collapse.Root>
        <Collapse.Header>
          <div className="flex flex-1 items-center gap-4">
            <h4 className="text-2xl font-bold text-sand-12">Test Cases</h4>
            <RunningButton
              text="Run All"
              isRunning={!isAllDone}
              handleOnRun={handleOnRunAllTestCase}
            />
          </div>

          <ExecuteStatus isSourceCodeChanged={isSourceCodeChanged} />
        </Collapse.Header>
        <Collapse.Body>
          <TestCaseList
            handleOnInputChange={handleOnInputChange}
            handleOnRemoveTestCase={handleOnRemoveTestCase}
          />
          <button
            onClick={handleOnAddTestCase}
            className="mt-3 flex items-center gap-2 rounded-lg bg-sand-12 px-4 py-1 text-sm text-sand-1 shadow hover:bg-sand-11"
          >
            <Plus />
            Add Case
          </button>
        </Collapse.Body>
      </Collapse.Root>
    </div>
  );
}

export default TestCaseSection;
