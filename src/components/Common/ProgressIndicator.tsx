import type { submission_type } from "@prisma/client";
import { twMerge } from "tailwind-merge";

interface Props {
  tasksStatus: submission_type[];
  className?: string;
}
function ProgressIndicator({ tasksStatus, className }: Props) {
  const taskLength = tasksStatus.length;
  
  return (
    <div className="w-full md:w-fit overflow-x-auto">
    <div className={twMerge("grid gap-1 grid-flow-row", className)}  style={{gridTemplateColumns : `repeat(${Math.ceil(taskLength/2)},10px)`}}>
      {tasksStatus.map((status, i) => (
        <div
          key={i}
          data-test={i}
          className={twMerge(
            "aspect-square rounded-sm",
            status === "PASSED" && "bg-lime-9",
            status === "FAILED" && "bg-red-9",
            status === "NOT_SUBMITTED" && "bg-sand-9"
          )}
        ></div>
      ))}
      </div>
    </div>
  );
}

export default ProgressIndicator;
