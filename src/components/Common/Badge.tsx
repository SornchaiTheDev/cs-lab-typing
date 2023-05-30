import type { ReactNode } from "react";
import clsx from "clsx";

interface Props {
  children: ReactNode;
  color?: string;
}

function Badge({ children, color }: Props) {
  return (
    <div
      className={clsx(
        "flex w-fit items-center rounded-md px-2 py-1 text-sm font-semibold text-white",
        color ? color : "bg-sand-12"
      )}
    >
      <h5>{children}</h5>
    </div>
  );
}

export default Badge;
