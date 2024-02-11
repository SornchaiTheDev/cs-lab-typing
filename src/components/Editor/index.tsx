import type { MDXEditorMethods, MDXEditorProps } from "@mdxeditor/editor";
import dynamic from "next/dynamic";
import { forwardRef } from "react";

interface EditorProps {
  diffMarkdown?: string;
}

export type AllEditorProps = EditorProps & MDXEditorProps;

const Editor = dynamic(() => import("~/components/Editor/Config"), {
  ssr: false,
});

// This is what is imported by other components. Pre-initialized with plugins, and ready
// to accept other props, including a ref.
const ForwardRefEditor = forwardRef<MDXEditorMethods, AllEditorProps>(
  (props, ref) => <Editor {...props} editorRef={ref} />
);

// TS complains without the following line
ForwardRefEditor.displayName = "ForwardRefEditor";

export default ForwardRefEditor;
