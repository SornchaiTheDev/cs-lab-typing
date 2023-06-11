import { Icon } from "@iconify/react";
import type { ReactNode } from "react";

interface Props {
  isOpen: boolean;
  onClick: () => void;
  title: string;
  titleBtn?: ReactNode;
  children?: ReactNode;
}

function Collapse({ isOpen, title, onClick, children, titleBtn }: Props) {
  return (
    <div className="my-4 rounded-md border border-sand-6 bg-white p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4 className="text-xl font-semibold">{title}</h4>
          {isOpen && titleBtn}
        </div>

        <button className="rounded-full p-2 hover:bg-sand-4" onClick={onClick}>
          <Icon
            icon={
              isOpen
                ? "solar:alt-arrow-up-line-duotone"
                : "solar:alt-arrow-down-line-duotone"
            }
          />
        </button>
      </div>
      {isOpen && <div className="mt-4">{children}</div>}
    </div>
  );
}

export default Collapse;
