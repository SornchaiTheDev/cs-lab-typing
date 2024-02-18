import { Loader, Play } from "lucide-react";
import React from "react";
import { cn } from "~/lib/utils";

interface Props {
  text: string;
  isRunning: boolean;
  handleOnRun: () => void;
}
function RunningButton({ text, isRunning, handleOnRun }: Props) {
  const statusText = isRunning ? "Running..." : text;
  const statusIcon = isRunning ? (
    <Loader className="animate-spin" size="0.9rem" />
  ) : (
    <Play size="0.9rem" />
  );
  const statusColor = isRunning ? "bg-yellow-9" : "bg-lime-10";
  return (
    <button
      onClick={handleOnRun}
      className={cn(
        "flex items-center gap-2 rounded-lg px-2 py-1 text-sm",
        statusColor
      )}
    >
      {statusIcon}
      {statusText}
    </button>
  );
}

export default RunningButton;
