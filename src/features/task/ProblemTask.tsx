import { BookOpenText, Code } from "lucide-react";
import React, { useState } from "react";
import MDXEditor from "~/components/Editor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface Props {
  taskId: string;
}
function ProblemTask({ taskId }: Props) {
  const [mode, setMode] = useState<"preview" | "edit">("edit");
  const [description, setDescription] = useState(`Hello World`);

  return (
    <div className="mt-8 flex flex-1 flex-col">
      <div className="flex justify-end gap-2 rounded-lg">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setMode("edit")}
                className={cn(
                  "rounded-lg  p-2",
                  mode === "edit" && "bg-sand-12 text-white hover:bg-sand-12/90"
                )}
              >
                <Code />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>View As Markdown</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setMode("preview")}
                className={cn(
                  "rounded-lg  p-2",
                  mode === "preview" &&
                    "bg-sand-12 text-white hover:bg-sand-12/90"
                )}
              >
                <BookOpenText />
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>View As Preview</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <MDXEditor
        onChange={setDescription}
        className="prose flex-1"
        markdown={description}
      />
    </div>
  );
}

export default ProblemTask;
