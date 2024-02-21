import React from "react";
import CodemirrorRoot from "~/components/Codemirror";
import useDragSection, { Direction } from "./hooks/useDragSection";
import { Cloud, Play } from "lucide-react";

function CodeSection() {
  const { sectionRef, dragRef, style, onMouseDown, resetToInitialSize } =
    useDragSection({
      direction: Direction.VERTICAL,
      minSize: 300,
      initialSize: 300,
      maxSize: 700,
    });
  return (
    <div className="flex flex-1 flex-col">
      <div
        style={style}
        ref={sectionRef}
        className="flex h-full flex-col overflow-hidden rounded-lg border border-sand-6 bg-sand-1"
      >
        <div className="flex justify-between px-4 py-2">
          <div className="flex items-center gap-2 text-sand-12">
            <Cloud size="1rem" />
            <h2 className="text-sm">Saved</h2>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1 rounded-lg border hover:bg-sand-2 active:bg-sand-4 border-sand-10 px-4 py-2 font-bold text-sand-12">
              <Play size="1rem" />
              Run
            </button>
            <button className="flex items-center gap-1 rounded-lg bg-sand-12 hover:bg-sand-12/90 px-4 py-2 font-bold text-sand-1 active:bg-sand-12">
              <Play size="1rem" />
              Submit
            </button>
          </div>
        </div>
        <CodemirrorRoot syntaxHighlighting className="flex-1 overflow-y-auto" />
      </div>
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        onDoubleClick={resetToInitialSize}
        className="group flex h-10 w-full cursor-row-resize items-center justify-center"
      >
        <div className="h-1 w-10 rounded-lg bg-sand-12 transition-transform group-hover:scale-x-125"></div>
      </div>
      <div className="flex min-h-20 flex-1 flex-col overflow-hidden rounded-lg border border-sand-6 bg-sand-1">
        <div className="flex items-center border-b border-sand-6">
          <button className="w-[100px] bg-sand-12 hover:bg-sand-12/90 active:bg-sand-12 p-2 font-bold text-sand-1 text-sm shadow-lg shadow-sand-6/20">
            Input
          </button>
          <button className="w-[100px] hover:bg-sand-3/90 active:bg-sand-5 p-2 text-sand-12 hover:bg-sand-6 text-sm">
            Output
          </button>
        </div>
        <CodemirrorRoot syntaxHighlighting className="flex-1" />
      </div>
    </div>
  );
}

export default CodeSection;
