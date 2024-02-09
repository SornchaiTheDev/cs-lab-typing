import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  codeBlockPlugin,
  tablePlugin,
  toolbarPlugin,
  imagePlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  UndoRedo,
  BoldItalicUnderlineToggles,
  CodeToggle,
  InsertImage,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin(),
        tablePlugin(),
        imagePlugin({
          imageUploadHandler: (file : File) => {
            console.log(file)
            return Promise.resolve("https://via.placeholder.com/400x300");
          },
        }),
        toolbarPlugin({
          toolbarContents: () => {
            return (
              <>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <InsertImage />
              </>
            );
          },
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
