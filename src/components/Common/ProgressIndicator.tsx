import type { submission_type } from "@prisma/client";
import { twMerge } from "tailwind-merge";

interface Props {
  tasksStatus: submission_type[];
  className?: string;
}
function ProgressIndicator({ tasksStatus, className }: Props) {
  return (
    <div className={twMerge("grid w-full grid-cols-12 gap-1", className)}>
      {tasksStatus.map((status, i) => (
        <div
          key={i}
          className={twMerge(
            "col-span-2 h-2 rounded-sm",
            status === "PASSED" && "bg-lime-9",
            status === "FAILED" && "bg-red-9",
            status === "NOT_SUBMITTED" && "bg-sand-9"
          )}
        ></div>
      ))}
    </div>
  );
}

export default ProgressIndicator;
