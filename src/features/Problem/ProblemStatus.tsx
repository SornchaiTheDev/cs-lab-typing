import { Check, X } from "lucide-react";
import { cn } from "~/lib/utils";

interface Props {
  status: "Passed" | "Failed";
}

const ProblemStatus = ({ status }: Props) => {
  const isPassed = status === "Passed";
  const isFailed = status === "Failed";
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 rounded-lg px-2 py-1",
        isPassed && "bg-green-4 text-green-9",
        isFailed && "bg-red-4 text-red-9"
      )}
    >
      {isPassed && <Check size="1rem" />}
      {isFailed && <X size="1rem" />}
      <p>{status}</p>
    </div>
  );
};

export default ProblemStatus;
