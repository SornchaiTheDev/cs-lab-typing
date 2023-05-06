import InsideTaskLayout from "@/Layout/InsideTaskLayout";
import { Icon } from "@iconify/react";
import { useState } from "react";

function TypingTask() {
  const [text, setText] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  console.log(text);
  return (
    <InsideTaskLayout title="Q KEY">
      <div className="flex-1 p-4">
        <h4 className="text-2xl font-medium">Typing Task</h4>

        <h4 className="mt-4 text-lg">Source</h4>

        <textarea
          placeholder="Type here..."
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setIsEditing(false)}
          className="w-full min-h-[20rem] text-3xl bg-transparent border-2 border-dashed rounded-md outline-none text-sand-12 focus:border-sand-10 focus:ring-transparent border-sand-6"
        />
      </div>
    </InsideTaskLayout>
  );
}

export default TypingTask;
