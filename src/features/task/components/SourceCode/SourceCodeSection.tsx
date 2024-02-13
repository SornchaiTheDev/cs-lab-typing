import { useAtom } from "jotai";
import CodemirrorRoot from "~/components/Codemirror";
import { sourceCodeAtom } from "~/store/problemTask";

function SourceCodeSection() {
  const [sourceCode, setSourceCode] = useAtom(sourceCodeAtom);
  return (
    <div className="mb-2 mt-10">
      <h4 className="text-3xl font-bold text-sand-12">Source Code</h4>
      <CodemirrorRoot
        className="mt-4 h-full overflow-hidden rounded-lg border border-sand-6"
        syntaxHighlighting
        value={sourceCode}
        onChange={setSourceCode}
        minHeight="300px"
      />
    </div>
  );
}

export default SourceCodeSection;
