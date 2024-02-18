import { Trash2 } from "lucide-react";
import React from "react";
import CodemirrorRoot from "~/components/Codemirror";
import type { TestCaseStatus } from "~/store/editorTestCase";

interface Props {
  number: number;
  input: string;
  output: string;
  status: TestCaseStatus;
  onChangeInput: (value: string) => void;
  handleOnRemoveTestCase: () => void;
}

function TestCaseItem({
  number,
  input,
  output,
  onChangeInput,
  handleOnRemoveTestCase,
}: Props) {
  return (
    <>
      <div className="mt-4 flex items-center gap-4">
        <h6 className="text-xl text-sand-12">Case {number}</h6>
        <button
          onClick={handleOnRemoveTestCase}
          className="flex items-center gap-2 rounded-lg bg-red-9 px-2 py-1 text-sm text-white hover:bg-red-10"
        >
          <Trash2 size="0.9rem" />
          Remove
        </button>
      </div>
      <div className="mt-2 flex flex-col flex-wrap gap-8 md:flex-row">
        <div className="flex-1 overflow-hidden rounded-lg border border-sand-6 bg-sand-2">
          <div className="mb-2 flex w-full items-center justify-between p-2">
            <h6 className="font-medium text-sand-12">Input</h6>
          </div>
          <CodemirrorRoot
            value={input}
            className="h-full"
            onChange={onChangeInput}
          />
        </div>
        <div className="flex-1 overflow-hidden rounded-lg border border-sand-6 bg-sand-2">
          <p className="mb-2 p-2 font-medium text-sand-12">Output</p>
          <CodemirrorRoot readOnly className="h-full" value={output} />
        </div>
      </div>
    </>
  );
}

export default TestCaseItem;
