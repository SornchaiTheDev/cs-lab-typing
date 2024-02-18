import { useAtom } from "jotai";
import CodemirrorRoot from "~/components/Codemirror";
import { sourceCodeAtom } from "~/store/problemTask";
import { githubDark, githubLight } from "@uiw/codemirror-theme-github";
import useTheme from "~/hooks/useTheme";

function SourceCodeSection() {
  const [sourceCode, setSourceCode] = useAtom(sourceCodeAtom);
  const { theme } = useTheme();
  const codeMirrorTheme = theme === "light" ? githubLight : githubDark;
  return (
    <div className="mb-2 mt-10">
      <h4 className="text-3xl font-bold text-sand-12">Source Code</h4>
      <CodemirrorRoot
        className="mt-4 h-full overflow-hidden rounded-lg border border-sand-6"
        syntaxHighlighting
        theme={codeMirrorTheme}
        value={sourceCode}
        onChange={setSourceCode}
        minHeight="300px"
      />
    </div>
  );
}

export default SourceCodeSection;
