import InsideTaskLayout from "~/Layout/InsideTaskLayout";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";

function TypingTask() {
  const [text, setText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const router = useRouter();
  const taskId = parseInt(router.query.taskId as string);

  const task = trpc.tasks.getTaskById.useQuery({ id: taskId });

  return (
    <InsideTaskLayout title={task.data?.name as string} isLoading={task.isLoading}>
      <div className="flex-1 p-4">
        <h4 className="text-2xl font-medium">Typing Task</h4>

        {/* <h4 className="mt-4 text-lg">Source</h4>

        <textarea
          placeholder="Type here..."
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className="min-h-[20rem] w-full rounded-md border-2 border-dashed border-sand-6 bg-transparent text-3xl text-sand-12 outline-none focus:border-sand-10 focus:ring-transparent"
        /> */}
      </div>
    </InsideTaskLayout>
  );
}

export default TypingTask;
