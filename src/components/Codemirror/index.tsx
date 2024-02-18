import React, { useEffect, useState } from "react";
import Codemirror from "@uiw/react-codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import type { Extension } from "@codemirror/state";
import {
  indentWithTab,
  indentWithTabLess,
} from "~/components/Codemirror/extensions/indentWithTab";
import useTheme from "~/hooks/useTheme";
import { defaultDarkTheme, defaultLightTheme } from "./theme";

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
  readOnly?: boolean;
  language?: "javascript" | "python" | "c" | "cpp" | "none";
}

const getLanguage = (language: string) => {
  switch (language) {
    case "python":
      return python();
    case "c":
      return cpp();
    case "cpp":
      return cpp();
    default:
      return python();
  }
};

function CodemirrorRoot({
  value,
  onChange,
  height = "100%",
  minHeight = "100px",
  className,
  syntaxHighlighting = false,
  theme,
  autoFocus = false,
  placeHolder,
  readOnly,
  language = "none",
}: Props) {
  const { theme: currentTheme } = useTheme();
  const [codeMirrorTheme, setCodeMirrorTheme] = useState<Extension | undefined>(
    theme
  );

  useEffect(() => {
    if (theme) {
      setCodeMirrorTheme(theme);
    } else {
      const _theme =
        currentTheme === "light" ? defaultLightTheme : defaultDarkTheme;
      setCodeMirrorTheme(_theme);
    }
  }, [theme, currentTheme]);

  return (
    <Codemirror
      readOnly={readOnly}
      className={className}
      minHeight={minHeight}
      placeholder={placeHolder ? placeHolder : undefined}
      height={height}
      value={value}
      onChange={onChange}
      theme={codeMirrorTheme}
      indentWithTab={false}
      basicSetup={{
        syntaxHighlighting: syntaxHighlighting,
        autocompletion: false,
      }}
      autoFocus={autoFocus}
      extensions={[
        baseTheme,
        getLanguage(language),
        keymap.of([
          { key: "Tab", run: indentWithTab },
          { key: "Shift-Tab", run: indentWithTabLess },
        ]),
      ]}
    />
  );
}

export default CodemirrorRoot;
