import type { ReactNode } from "react";
import clsx from "clsx";

export type BadgeType = "success" | "info" | "warning" | "danger" | "default";

interface Props {
  children: ReactNode;
  type?: BadgeType;
}

function Badge({ children, type = "default" }: Props) {
  let color;
  switch (type) {
    case "info":
      color = "bg-blue-10";
      break;
    case "success":
      color = "bg-lime-10";
      break;
    case "warning":
      color = "bg-yellow-10";
      break;
    case "danger":
      color = "bg-red-10";
      break;
    default:
      color = "bg-sand-12";
  }
  return (
    <div
      className={clsx(
        "flex w-fit items-center rounded-md px-2 py-1 text-sm font-semibold text-white",
        color
      )}
    >
      <h5>{children}</h5>
    </div>
  );
}

export default Badge;
