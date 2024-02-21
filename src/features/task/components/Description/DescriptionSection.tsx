import type { MDXEditorMethods } from "@mdxeditor/editor";
import React, { useEffect, useState } from "react";
import MDXEditor from "~/components/Editor";
import useTheme from "~/hooks/useTheme";

interface Props {
  description: string;
  onChange: (description: string) => void;
  diffTaskBody: string;
}

function DescriptionSection({ diffTaskBody, description, onChange }: Props) {
  const [isAlreadySetDescription, setIsAlreadySetDescription] = useState(false);
  const { theme } = useTheme();

  const ref = React.useRef<MDXEditorMethods>(null);
  useEffect(() => {
    if (isAlreadySetDescription) return;

    ref.current?.setMarkdown(description);
    setIsAlreadySetDescription(true);
  }, [description, setIsAlreadySetDescription, isAlreadySetDescription]);

  return (
    <>
      <h4 className="mb-4 text-3xl font-bold text-sand-12 ">Description</h4>
      <div className="-z-0 min-h-[300px] overflow-hidden rounded-lg border border-sand-6 text-sand-12 dark:bg-sand-2">
        <MDXEditor
          autoFocus
          ref={ref}
          onChange={onChange}
          diffMarkdown={diffTaskBody}
          className={theme === "light" ? "light-theme" : "dark-theme"}
          contentEditableClassName="p-4 prose-sand max-w-none prose before:prose-code:content-[''] after:prose-code:content-['']"
          markdown={description}
        />
      </div>
    </>
  );
}

export default DescriptionSection;
