import { Play, Trash2 } from "lucide-react";
import React from "react";
import CodemirrorRoot from "~/components/Codemirror";

interface Props {
  number: number;
  input: string;
  output: string;
  onChangeInput: (value: string) => void;
  handleOnRunTestCase: () => void;
  handleOnRemoveTestCase: () => void;
}

function TestCaseItem({
  number,
  input,
  output,
  onChangeInput,
  handleOnRunTestCase,
  handleOnRemoveTestCase,
}: Props) {
  return (
    <>
      <div className="mt-4 flex items-center gap-4">
        <h6 className="text-xl text-sand-12">Case {number}</h6>
        <button
          onClick={handleOnRemoveTestCase}
          className="flex items-center gap-2 rounded-lg bg-red-9 text-white px-2 py-1 text-sm hover:bg-red-10"
        >
          <Trash2 size="0.9rem" />
          Remove
        </button>
      </div>
      <div className="mt-2 flex flex-col flex-wrap gap-8 md:flex-row">
        <div className="boder-sand-6 flex-1 overflow-hidden rounded-lg border bg-white">
          <div className="mb-2 flex w-full items-center justify-between p-2">
            <h6 className="font-medium">Input</h6>
            <button
              onClick={handleOnRunTestCase}
              className="flex items-center gap-2 rounded-lg bg-lime-9 px-2 py-1 text-sm hover:bg-lime-10"
            >
              <Play size="0.9rem" />
              Run
            </button>
          </div>
          <CodemirrorRoot
            value={input}
            className="h-full"
            onChange={onChangeInput}
          />
        </div>
        <div className="boder-sand-6 flex-1 overflow-hidden rounded-lg border bg-white">
          <p className="mb-2 p-2 font-medium">Output</p>
          <CodemirrorRoot readOnly className="h-full" value={output} />
        </div>
      </div>
    </>
  );
}

export default TestCaseItem;
