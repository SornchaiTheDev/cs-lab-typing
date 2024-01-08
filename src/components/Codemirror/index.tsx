import React from "react";
import Codemirror from "@uiw/react-codemirror";
import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";
import { EditorView, keymap } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import type { Extension } from "@codemirror/state";
import {
  indentWithTab,
  indentWithTabLess,
} from "~/components/Codemirror/extensions/indentWithTab";

const myTheme = createTheme({
  theme: "light",
  settings: {
    background: "#ffffff",
    foreground: "#75baff",
    caret: "#5d00ff",
    selection: "#036dd626",
    selectionMatch: "#036dd626",
    lineHighlight: "#8a91991a",
    gutterBackground: "#fff",
    gutterForeground: "#8a919966",
  },
  styles: [
    { tag: t.comment, color: "#787b8099" },
    { tag: t.variableName, color: "#0080ff" },
    { tag: [t.string, t.special(t.brace)], color: "#5c6166" },
    { tag: t.number, color: "#5c6166" },
    { tag: t.bool, color: "#5c6166" },
    { tag: t.null, color: "#5c6166" },
    { tag: t.keyword, color: "#5c6166" },
    { tag: t.operator, color: "#5c6166" },
    { tag: t.className, color: "#5c6166" },
    { tag: t.definition(t.typeName), color: "#5c6166" },
    { tag: t.typeName, color: "#5c6166" },
    { tag: t.angleBracket, color: "#5c6166" },
    { tag: t.tagName, color: "#5c6166" },
    { tag: t.attributeName, color: "#5c6166" },
  ],
});

const baseTheme = EditorView.baseTheme({
  "&": {
    height: "100%",
  },
  "&.cm-editor.cm-focused": {
    outline: "none",
  },
  "&.cm-scroller": {
    fontFamily: `Consolas, 'Bitstream Vera Sans Mono', 'Courier New', Courier,
      monospace`,
  },
});

interface Props {
  onChange?: (value: string, viewUpdate: unknown) => void;
  value?: string;
  height?: string;
  minHeight?: string;
  className?: string;
  syntaxHighlighting?: boolean;
  theme?: Extension;
  autoFocus?: boolean;
  placeHolder?: string;
}

function CodemirrorRoot({
  value,
  onChange,
  height = "100%",
  minHeight = "100px",
  className,
  syntaxHighlighting = true,
  theme,
  autoFocus = false,
  placeHolder,
}: Props) {
  return (
    <Codemirror
      className={className}
      minHeight={minHeight}
      placeholder={placeHolder ? placeHolder : undefined}
      height={height}
      value={value}
      onChange={onChange}
      theme={theme ? theme : syntaxHighlighting ? myTheme : "none"}
      indentWithTab={false}
      basicSetup={{
        syntaxHighlighting: syntaxHighlighting,
        autocompletion: false,
      }}
      autoFocus={autoFocus}
      extensions={[
        baseTheme,
        javascript(),
        keymap.of([
          { key: "Tab", run: indentWithTab },
          { key: "Shift-Tab", run: indentWithTabLess },
        ]),
      ]}
    />
  );
}

export default CodemirrorRoot;
