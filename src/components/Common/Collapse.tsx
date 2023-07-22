import { Icon } from "@iconify/react";
import { useState, type ReactNode } from "react";

interface Props {
  title: string;
  titleBtn?: ReactNode;
  children?: ReactNode;
}

function Collapse({ title, children, titleBtn }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="my-4 rounded-md border border-sand-6 bg-sand-3 text-sand-12 p-4 shadow">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-xl font-semibold">{title}</h4>
          {isOpen && titleBtn}
        </div>

        <button
          className="rounded-full p-2 hover:bg-sand-4"
          onClick={() => setIsOpen(!isOpen)}
        >
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
