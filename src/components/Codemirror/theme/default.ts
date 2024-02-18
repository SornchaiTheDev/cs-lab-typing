import { createTheme } from "@uiw/codemirror-themes";
import { tags as t } from "@lezer/highlight";

export const defaultLightTheme = createTheme({
  theme: "light",
  settings: {
    background: "#f9f9f8",
    foreground: "#393a34",
    caret: "#21201c",
    selection: "#59682c",
    selectionMatch: "#59682c",
    lineHighlight: "#8a91991a",
    gutterBackground: "#fff",
    gutterForeground: "#8a919966",
  },
  styles: [{ tag: t.separator, color: "#59682c" }],
});

export const defaultDarkTheme = createTheme({
  theme: "dark", // Changed theme to "dark"
  settings: {
    background: "#21201c", // Changed background color
    foreground: "#fdfdfc", // Changed text color
    caret: "#fdfdfc",
    selection: "#59682c",
    selectionMatch: "#59682c",
    lineHighlight: "#8a91991a",
    gutterBackground: "#21221e", // Changed gutter background color
    gutterForeground: "#8d8d86", // Changed gutter text color
  },
  styles: [{ tag: t.separator, color: "#b0e64c" }],
});
