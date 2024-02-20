import React from "react";
import CodemirrorRoot from "~/components/Codemirror";
import useDragSection, { Direction } from "./hooks/useDragSection";

function CodeSection() {
  const { sectionRef, dragRef, style, onMouseDown, resetToInitialSize } =
    useDragSection({
      direction: Direction.VERTICAL,
      minSize: 300,
      initialSize: 500,
      maxSize: 1000,
    });
  return (
    <div className="flex flex-1 flex-col">
      <div
        style={style}
        ref={sectionRef}
        className="flex h-full flex-col overflow-hidden rounded-lg border border-sand-6 bg-white"
      >
        <CodemirrorRoot syntaxHighlighting className="flex-1" />
      </div>
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        onDoubleClick={resetToInitialSize}
        className="group flex h-10 w-full cursor-row-resize items-center justify-center"
      >
        <div className="h-1 w-10 rounded-lg bg-sand-12 transition-transform group-hover:scale-x-125"></div>
      </div>
      <div className="flex min-h-20 flex-1 flex-col overflow-hidden rounded-lg border border-sand-6 bg-white">
        <div className="flex items-center border-b border-sand-6">
          <button className="w-[100px] bg-sand-12 p-2 font-bold text-sand-1 shadow-lg shadow-sand-6/20">
            Input
          </button>
          <button className="w-[100px] bg-sand-3 p-2 text-sand-12 hover:bg-sand-6">
            Output
          </button>
        </div>
        <CodemirrorRoot syntaxHighlighting className="flex-1" />
      </div>
    </div>
  );
}

export default CodeSection;
