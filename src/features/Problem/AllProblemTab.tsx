import { cn } from "~/lib/utils";

interface Props {
  status: "Passed" | "Failed" | "NotStarted";
}
const Problem = ({ status }: Props) => {
  const isPassed = status === "Passed";
  const isFailed = status === "Failed";
  const isNotStarted = status === "NotStarted";

  return (
    <button className="rounded-lg border border-sand-4 bg-sand-2 bg-gradient-to-r from-sand-2 to-sand-4 p-4 shadow">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            isPassed && "bg-green-9",
            isFailed && "bg-red-9",
            isNotStarted && "bg-sand-9"
          )}
        ></div>
        <h5 className="text-lg font-medium">Hello World</h5>
      </div>
    </button>
  );
};
function AllProblemTab() {
  return (
    <div className="flex flex-col gap-4">
      {new Array(10).fill(0).map((_, i) => (
        <Problem status="Passed" key={i} />
      ))}
    </div>
  );
}

export default AllProblemTab;
