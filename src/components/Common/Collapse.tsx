import { Icon } from "@iconify/react";
import { useState, useContext } from "react";
import { type ReactNode, createContext } from "react";

interface CollapseContext {
  isCollapse: boolean;
  setIsCollapse: (value: boolean) => void;
}

const Collapse = createContext<CollapseContext | undefined>(undefined);

interface Children {
  children?: ReactNode;
}

export const Root = ({ children }: Children) => {
  const [isCollapse, setIsCollapse] = useState(true);

  return (
    <Collapse.Provider value={{ isCollapse, setIsCollapse }}>
      <div className="my-4 rounded-md border border-sand-6 bg-sand-1 p-4 text-sand-12">
        {children}
      </div>
    </Collapse.Provider>
  );
};

export const Body = ({ children }: Children) => {
  const { isCollapse } = useCollapseContext();
  if (isCollapse) return null;

  return children as ReactNode;
};

const useCollapseContext = () => {
  const context = useContext(Collapse);
  if (!context) {
    throw new Error("useCollapseContext must be used within CollapseProvider");
  }
  return context;
};

export const Header = ({ children }: Children) => {
  const { isCollapse, setIsCollapse } = useCollapseContext();

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      <button
        className="rounded-full p-2 hover:bg-sand-4"
        onClick={() => setIsCollapse(!isCollapse)}
      >
        <Icon
          icon={
            isCollapse
              ? "solar:alt-arrow-down-line-duotone"
              : "solar:alt-arrow-up-line-duotone"
          }
        />
      </button>
    </div>
  );
};
