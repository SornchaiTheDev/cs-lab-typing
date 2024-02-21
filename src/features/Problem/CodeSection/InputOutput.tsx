import { useAtom } from "jotai";
import { type ReactNode, useState } from "react";
import CodemirrorRoot from "~/components/Codemirror";
import { cn } from "~/lib/utils";
import { inputOutputAtom } from "~/store/frontProblemTask";

enum Tab {
  Input,
  Output,
}

interface Props {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}

const ActiveButton = ({ active, onClick, children }: Props) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-[100px] p-2 text-sm text-sand-12 hover:bg-sand-4",
        active &&
          "bg-sand-12 font-bold text-sand-1 hover:bg-sand-12/90 active:bg-sand-12"
      )}
    >
      {children}
    </button>
  );
};

function InputOutput() {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Input);
  const [values, setValues] = useAtom(inputOutputAtom);

  const { input, output } = values;

  const codeMirrorValue = activeTab === Tab.Input ? input : output;

  const handleOnClickTab = (type: Tab) => {
    setActiveTab(type);
  };

  const handleOnCodeMirrorChange = (value: string) => {
    if (activeTab === Tab.Input)
      setValues((prev) => ({ ...prev, input: value }));
    if (activeTab === Tab.Output)
      setValues((prev) => ({ ...prev, output: value }));
  };

  return (
    <div className="flex min-h-20 flex-1 flex-col overflow-hidden rounded-lg border border-sand-6 bg-sand-1">
      <div className="flex items-center border-b border-sand-6">
        <ActiveButton
          active={activeTab === Tab.Input}
          onClick={() => handleOnClickTab(Tab.Input)}
        >
          Input
        </ActiveButton>
        <ActiveButton
          active={activeTab === Tab.Output}
          onClick={() => handleOnClickTab(Tab.Output)}
        >
          Output
        </ActiveButton>
      </div>
      <CodemirrorRoot
        value={codeMirrorValue}
        onChange={handleOnCodeMirrorChange}
        syntaxHighlighting
        className="flex-1"
        readOnly={activeTab === Tab.Output}
      />
    </div>
  );
}

export default InputOutput;
