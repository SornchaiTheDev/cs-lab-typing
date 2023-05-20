import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

export const addUserTheme = createTheme({
  theme: "light",
  settings: {
    background: "#f9f9f8",
    foreground: "#393a34",
    caret: "#7c3aed",
    selection: "#e8e8e8",
    selectionMatch: "#dbdbd7",
    lineHighlight: "#8a91991a",
    gutterBackground: "#fff",
    gutterForeground: "#8a919966",
  },
  styles: [
    {
      tag: t.comment,
      color: "#999988",
    },
    {
      tag: t.variableName,
      color: "#393a34",
    },
    {
      tag: [t.string, t.special(t.brace)],
      color: "#e3116c",
    },
    {
      tag: t.number,
      color: "#36acaa",
    },
    {
      tag: t.bool,
      color: "#007dfa",
    },
    {
      tag: t.null,
      color: "#0d7ae7",
    },
    {
      tag: t.keyword,
      color: "#00a4db",
    },
    {
      tag: t.operator,
      color: "#393a34",
    },
    {
      tag: t.className,
      color: "#50575e",
    },
    {
      tag: t.definition(t.typeName),
      color: "#00aaff",
    },
    {
      tag: [t.definition(t.propertyName), t.function(t.variableName)],
      color: "#00a4db",
    },
    {
      tag: t.typeName,
      color: "#0080ff",
    },
    {
      tag: t.angleBracket,
      color: "#dd7f27",
    },
    {
      tag: t.tagName,
      color: "#ffae00",
    },
    {
      tag: t.attributeName,
      color: "#ff6600",
    },
  ],
});