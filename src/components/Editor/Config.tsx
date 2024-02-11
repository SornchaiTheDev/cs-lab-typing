import type { ForwardedRef } from "react";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  tablePlugin,
  toolbarPlugin,
  imagePlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  UndoRedo,
  BoldItalicUnderlineToggles,
  InsertTable,
  CodeToggle,
  DiffSourceToggleWrapper,
  InsertImage,
  InsertCodeBlock,
  diffSourcePlugin,
  ChangeCodeMirrorLanguage,
  codeMirrorPlugin,
  ConditionalContents,
  codeBlockPlugin,
} from "@mdxeditor/editor";
import type { AllEditorProps } from ".";

// Only import this to the next file
export default function InitializedMDXEditor({
  editorRef,
  ...props
}: { editorRef: ForwardedRef<MDXEditorMethods> | null } & MDXEditorProps &
  AllEditorProps) {
  return (
    <MDXEditor
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),
        markdownShortcutPlugin(),
        codeBlockPlugin({ defaultCodeBlockLanguage: "python" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            python: "Python",
            c: "C",
            cpp: "C++",
            java: "Java",
          },
          theme: "light",
        }),
        tablePlugin(),
        diffSourcePlugin({
          viewMode: "rich-text",
          diffMarkdown: props.diffMarkdown,
        }),
        imagePlugin({
          imageUploadHandler: (file: File) => {
            console.log(file);
            return Promise.resolve("https://via.placeholder.com/400x300");
          },
        }),
        toolbarPlugin({
          toolbarContents: () => {
            return (
              <DiffSourceToggleWrapper>
                <UndoRedo />
                <BoldItalicUnderlineToggles />
                <CodeToggle />
                <InsertImage />
                <InsertTable />
                <ConditionalContents
                  options={[
                    {
                      when: (editor) => editor?.editorType === "codeblock",
                      contents: () => <ChangeCodeMirrorLanguage />,
                    },
                    { fallback: () => <InsertCodeBlock /> },
                  ]}
                />
              </DiffSourceToggleWrapper>
            );
          },
        }),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
