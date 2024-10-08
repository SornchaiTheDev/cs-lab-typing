import { useRef, useState } from "react";
import useDragSection, { Direction } from "./hooks/useDragSection";
import ButtonGroup from "./ButtonGroup";
import ProblemDescriptionTab from "./ProblemTab";
import AllProblemTab from "./AllProblemTab";
import SubmissionsTab from "./SubmissionsTab";

export enum Tab {
  AllProblems = "All Problems",
  Description = "Description",
  Submissions = "Submissions",
}

function Sidebar() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Description);

  const { sectionRef, dragRef, style, onMouseDown, resetToInitialSize } =
    useDragSection({
      direction: Direction.HORIZONTAL,
      minSize: 300,
      initialSize: 600,
      maxSize: 1000,
    });

  const scrollSectionRef = useRef<HTMLDivElement>(null);

  const ActiveTab = () => {
    scrollSectionRef.current?.scrollTo(0, 0);
    switch (activeTab) {
      case Tab.AllProblems:
        return <AllProblemTab />;
      case Tab.Description:
        return (
          <ProblemDescriptionTab
            onBackToAllProblem={() => setActiveTab(Tab.AllProblems)}
          />
        );
      case Tab.Submissions:
        return <SubmissionsTab />;
    }
  };

  return (
    <>
      <div
        ref={sectionRef}
        className="flex flex-col overflow-hidden rounded-lg border border-sand-6 bg-sand-1"
        style={style}
      >
        <ButtonGroup activeTab={activeTab} onClick={setActiveTab} />
        <div ref={scrollSectionRef} className="overflow-y-auto p-4">
          <ActiveTab />
        </div>
      </div>
      <div
        ref={dragRef}
        onMouseDown={onMouseDown}
        onDoubleClick={resetToInitialSize}
        className="group flex h-full w-10 cursor-col-resize flex-col items-center justify-center"
      >
        <div className="h-10 w-1 rounded-lg bg-sand-12 transition-transform group-hover:scale-y-125"></div>
      </div>
    </>
  );
}

export default Sidebar;
