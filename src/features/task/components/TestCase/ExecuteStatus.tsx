import { AlertCircle, CheckCircle2 } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";

interface Props {
  isSourceCodeChanged: boolean;
}

function ExecuteStatus({ isSourceCodeChanged }: Props) {
  const icon = isSourceCodeChanged ? (
    <AlertCircle size="1rem" />
  ) : (
    <CheckCircle2 size="1rem" />
  );

  const text = isSourceCodeChanged
    ? "Test Cases are outdated and need to re-run all test cases"
    : "Test Cases are up to date";

  return (
    <div
      className={cn(
        "mr-2 flex items-center gap-2 rounded-full  px-2 py-1",
        isSourceCodeChanged
          ? "bg-red-5 text-red-10"
          : "bg-green-5 text-green-10"
      )}
    >
      {icon}
      <h6 className="text-sm">{text}</h6>
    </div>
  );
}

export default ExecuteStatus;
