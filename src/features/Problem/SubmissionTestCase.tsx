import { Check, GanttChart, Loader, X } from "lucide-react";
import { useMemo } from "react";
import { cn } from "~/lib/utils";

interface Props {
  order: number;
  status: "Passed" | "Failed" | "Pending" | "Spacing";
}

const SubmissionTestCase = ({ order, status }: Props) => {
  const isPassed = status === "Passed";
  const isFailed = status === "Failed";
  const isPending = status === "Pending";
  const isSpacing = status === "Spacing";

  const title = useMemo(() => {
    switch (status) {
      case "Passed":
        return "Passed";
      case "Failed":
        return "Failed";
      case "Pending":
        return "Pending";
      case "Spacing":
        return "Spacing";
    }
  }, [status]);

  return (
    <div className="flex items-center justify-between">
      <h6 className="text-sm font-medium text-black">Case #{order}</h6>
      <div
        title={title}
        className={cn(
          isPassed && "text-green-9",
          isPending && "text-sand-9",
          isFailed && "text-red-9",
          isSpacing && "text-orange-9"
        )}
      >
        {isPending && <Loader size="1.25rem" className="animate-spin" />}
        {isPassed && <Check size="1.25rem" />}
        {isFailed && <X size="1.25rem" />}
        {isSpacing && <GanttChart size="1.25rem" />}
      </div>
    </div>
  );
};

export default SubmissionTestCase;
