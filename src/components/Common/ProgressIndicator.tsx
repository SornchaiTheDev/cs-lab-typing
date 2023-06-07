import type { submission_type } from "@prisma/client";
import clsx from "clsx";

interface Props {
  tasksStatus: submission_type[];
}
function ProgressIndicator({ tasksStatus }: Props) {
  return (
    <div className="grid w-full max-w-md grid-cols-12 gap-1">
      {tasksStatus.map((status, i) => (
        <div
          key={i}
          className={clsx(
            "col-span-1 h-2 rounded-sm",
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
