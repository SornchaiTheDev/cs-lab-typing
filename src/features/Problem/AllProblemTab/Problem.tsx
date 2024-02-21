import type { submission_type, task_type } from "@prisma/client";
import { useRouter } from "next/router";
import { cn } from "~/lib/utils";

interface Props {
  order: number;
  id: number;
  name: string;
  type: task_type;
  status: submission_type;
}
const Problem = ({ order, id, name, type, status }: Props) => {
  const isPassed = status === "PASSED";
  const isFailed = status === "FAILED";
  const isNotStarted = status === "NOT_SUBMITTED";
  const router = useRouter();

  const handleOnClickTask = () => {
    switch (type) {
      case "Problem":
        router.push({
          pathname: "/courses/[sectionId]/labs/[labId]/problem/[taskId]",
          query: { ...router.query, taskId: id },
        });
        break;
      case "Typing":
        router.push({
          pathname: "/courses/[sectionId]/labs/[labId]/typing/[taskId]",
          query: { ...router.query, taskId: id },
        });
        break;
      case "Lesson":
        router.push({
          pathname: "/courses/[sectionId]/labs/[labId]/lesson/[taskId]",
          query: { ...router.query, taskId: id },
        });
        break;
    }
  };

  return (
    <button
      onClick={handleOnClickTask}
      className="rounded-lg text-start border border-sand-4 bg-sand-2 bg-gradient-to-r from-sand-2 to-sand-4 p-4 shadow"
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            isPassed && "bg-green-9",
            isFailed && "bg-red-9",
            isNotStarted && "bg-sand-9"
          )}
        ></div>
        <h5 className="font-medium">
          {order}. {name}
        </h5>
      </div>
    </button>
  );
};

export default Problem;
