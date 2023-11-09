import type { LabLogger } from "@prisma/client";
import { twMerge } from "tailwind-merge";

const TypeBadge = ({ type }: { type: LabLogger | null }) => {
  if (type === null) return null;
  return (
    <div
      className={twMerge(
        "w-fit rounded-md px-2 text-sm font-medium",
        type === "ACCESS" && "bg-lime-3 text-lime-9",
        type === "SUBMIT" && "bg-amber-3 text-amber-9"
      )}
    >
      {type}
    </div>
  );
};

export default TypeBadge