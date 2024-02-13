import MDXEditor from "~/components/Editor";
import React from "react";
import { useAtom } from "jotai";
import { descriptionAtom } from "~/store/problemTask";

interface Props {
  mdxRef: React.MutableRefObject<any>;
  diffTaskBody: string;
}

function DescriptionSection({ mdxRef, diffTaskBody }: Props) {
  const [description, setDescription] = useAtom(descriptionAtom);
  return (
    <>
      <h4 className="mb-4 text-3xl font-bold text-sand-12 ">Description</h4>
      <div className="-z-0 min-h-[300px] overflow-hidden rounded-lg border border-sand-6 bg-white text-sand-12 dark:bg-sand-2 ">
        <MDXEditor
          ref={mdxRef}
          autoFocus
          onChange={setDescription}
          diffMarkdown={diffTaskBody}
          contentEditableClassName="p-4 prose prose-sand max-w-none prose before:prose-code:content-[''] after:prose-code:content-['']"
          markdown={description}
        />
      </div>
    </>
  );
}

export default DescriptionSection;
