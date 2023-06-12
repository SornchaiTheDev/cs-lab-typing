import type { submission_type } from "@prisma/client";
import clsx from "clsx";

interface Props {
  tasksStatus: submission_type[];
  className?: string;
}
function ProgressIndicator({ tasksStatus, className }: Props) {
  return (
    <div
      className={clsx(
        "flex w-full max-w-md flex-wrap gap-1",
        className
      )}
    >
      {tasksStatus.map((status, i) => (
        <div
          key={i}
          className={clsx(
            "h-2 w-[4rem] rounded-sm",
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
