import * as Collapse from "~/components/Common/Collapse";
import { formatDate } from "~/utils/formatDate";
import SubmissionTestCase from "./SubmissionTestCase";
import { cn } from "~/lib/utils";
import { CalendarDays, Clock } from "lucide-react";

interface Props {
  active?: boolean;
  order: number;
}
function Submission({ order, active = false }: Props) {
  const randomStatus = new Array(10)
    .fill(0)
    .map(() => "Passed")
    .map((status) => (Math.random() < 0.1 ? "Failed" : status))
    // .map((status) => (Math.random() > 0.5 ? "Spacing" : status))
    .map((status) => (Math.random() < 0.1 ? "Pending" : status));
  const isPending = randomStatus.some((status) => ["Pending"].includes(status));
  const isSuccess = randomStatus.every((status) => ["Passed"].includes(status));
  const isFailed = !isSuccess && !isPending;

  return (
    <Collapse.Root
      className={cn(
        "mb-4 py-2",
        isPending && "border-sand-9 bg-sand-2",
        isSuccess && "border-green-9 bg-green-4",
        isFailed && "border-red-9 bg-red-4"
      )}
      initialCollpase={!active}
    >
      <Collapse.Header>
        <div className="flex flex-col">
          <h4 className="text-lg font-bold"> Attempted #{order}</h4>
          <div className="mt-1 flex gap-2">
            <div className="flex items-center gap-1">
              <CalendarDays size="0.8rem" />
              <h6 className="text-sm">
                {formatDate(new Date(), "DD/MM/YYYY")}
              </h6>
            </div>
            <div className="flex items-center gap-1">
              <Clock size="0.8rem" />
              <h6 className="text-sm">{formatDate(new Date(), "HH:mm:ss")}</h6>
            </div>
          </div>
        </div>
      </Collapse.Header>
      <Collapse.Body>
        <div className="mt-4 flex flex-col gap-4">
          {randomStatus.map((status, index) => (
            <SubmissionTestCase
              key={index}
              order={index + 1}
              status={status as "Passed" | "Failed" | "Spacing" | "Pending"}
            />
          ))}
        </div>
      </Collapse.Body>
    </Collapse.Root>
  );
}

export default Submission;
