import { Icon } from "@iconify/react";
import { useState, useContext } from "react";
import { type ReactNode, createContext } from "react";
import { cn } from "~/lib/utils";

interface CollapseContext {
  isCollapse: boolean;
  setIsCollapse: (value: boolean) => void;
}

const Collapse = createContext<CollapseContext | undefined>(undefined);

interface Children {
  initialCollpase?: boolean;
  children?: ReactNode;
  className?: string;
}

export const Root = ({
  initialCollpase = true,
  children,
  className,
}: Children) => {
  const [isCollapse, setIsCollapse] = useState(initialCollpase);

  return (
    <Collapse.Provider value={{ isCollapse, setIsCollapse }}>
      <div
        className={cn(
          "rounded-md border border-sand-6 bg-sand-1 p-4 text-sand-12",
          className
        )}
      >
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

export const Header = ({ children, className }: Children) => {
  const { isCollapse, setIsCollapse } = useCollapseContext();

  return (
    <div className={cn("flex items-center justify-between", className)}>
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
