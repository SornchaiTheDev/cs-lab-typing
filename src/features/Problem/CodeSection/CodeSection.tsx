import { githubLight } from "@uiw/codemirror-theme-github";
import { Play } from "lucide-react";
import { useEffect, useState } from "react";
import CodemirrorRoot from "~/components/Codemirror";
import useDragSection, { Direction } from "../hooks/useDragSection";
import InputOutput from "./InputOutput";
import SaveStatus from "./SaveStatus";
import { useAtom } from "jotai";
import { Status, saveStatusAtom } from "~/store/frontProblemTask";

function CodeSection() {
  const [sourceCode, setSourceCode] = useState("");
  const [status, setStatus] = useAtom(saveStatusAtom);
  const { sectionRef, dragRef, style, onMouseDown, resetToInitialSize } =
    useDragSection({
      direction: Direction.VERTICAL,
      minSize: 200,
      initialSize: 500,
      maxSize: 700,
    });

  useEffect(() => {
    setTimeout(() => {
      setStatus(Status.SAVING);
      setTimeout(() => {
        setStatus(Status.SAVED);
      }, 1000);
    }, 1000);
  }, [sourceCode, setStatus]);

  return (
    <div className="flex flex-1 flex-col">
      <div
        style={style}
        ref={sectionRef}
        className="flex h-full flex-col overflow-hidden rounded-lg border border-sand-6 bg-sand-1"
      >
        <div className="flex justify-between px-4 py-2">
          <SaveStatus />
          <div className="flex gap-2">
            <button className="flex items-center gap-1 rounded-lg border border-sand-10 px-4 py-2 font-bold text-sand-12 hover:bg-sand-2 active:bg-sand-4">
              <Play size="1rem" />
              Run
            </button>
            <button className="flex items-center gap-1 rounded-lg bg-sand-12 px-4 py-2 font-bold text-sand-1 hover:bg-sand-12/90 active:bg-sand-12">
              <Play size="1rem" />
              Submit
            </button>
          </div>
        </div>
        <CodemirrorRoot
          value={sourceCode}
          onChange={setSourceCode}
          theme={githubLight}
          syntaxHighlighting
          className="flex-1 overflow-y-auto"
        />
      </div>
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        onDoubleClick={resetToInitialSize}
        className="group flex h-10 w-full cursor-row-resize items-center justify-center"
      >
        <div className="h-1 w-10 rounded-lg bg-sand-12 transition-transform group-hover:scale-x-125"></div>
      </div>
      <InputOutput />
    </div>
  );
}

export default CodeSection;
