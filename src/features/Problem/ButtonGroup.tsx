import React, { Fragment } from "react";
import type { Tab } from "./Sidebar";

interface Props {
  activeTab: Tab;
  onClick: (tab: Tab) => void;
}

interface Button {
  name: string;
  onClick: () => void;
}

const ActiveButton = ({ name, onClick }: Button) => {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-lg text-sm bg-sand-12 p-2 font-bold text-sand-1 shadow-lg shadow-sand-6/20"
    >
      {name}
    </button>
  );
};

const InactiveButton = ({ name, onClick }: Button) => {
  return (
    <button
      onClick={onClick}
      className="flex-1 rounded-lg text-sm p-2 text-sand-12 hover:bg-sand-6"
    >
      {name}
    </button>
  );
};
function ButtonGroup({ activeTab, onClick }: Props) {
  const buttons = ["All Problems", "Description", "Submissions"];
  return (
    <div className="flex items-center gap-2 border-b border-sand-6 p-2">
      {buttons.map((button) => (
        <Fragment key={button}>
          {activeTab === button ? (
            <ActiveButton
              name={button}
              onClick={() => onClick(button as Tab)}
            />
          ) : (
            <InactiveButton
              name={button}
              onClick={() => onClick(button as Tab)}
            />
          )}
        </Fragment>
      ))}
    </div>
  );
}

export default ButtonGroup;
