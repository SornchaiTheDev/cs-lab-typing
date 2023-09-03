import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

export type BadgeType = "success" | "info" | "warning" | "danger" | "default";

interface Props {
  children: ReactNode;
  className?: string;
  type?: BadgeType;
}

function Badge({ children, type = "default", className }: Props) {
  let color;
  switch (type) {
    case "info":
      color = "text-sand-1 bg-blue-10";
      break;
    case "success":
      color = "text-sand-12 bg-lime-10";
      break;
    case "warning":
      color = "text-sand-12 bg-yellow-10";
      break;
    case "danger":
      color = "text-sand-4 bg-red-10";
      break;
    default:
      color = "text-sand-4 bg-sand-12";
  }
  return (
    <div
      className={twMerge(
        "flex w-fit items-center rounded-md px-2 py-1 text-sm font-semibold truncate",
        color,
        className
      )}
    >
      <h5>{children}</h5>
    </div>
  );
}

export default Badge;
