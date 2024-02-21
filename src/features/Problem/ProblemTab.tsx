import { MoveLeft } from "lucide-react";
import React from "react";
import ProblemStatus from "./ProblemStatus";
import { trpc } from "~/utils";
import { useRouter } from "next/router";
import MDXRender from "~/components/Common/MDXRender";

interface Props {
  onBackToAllProblem: () => void;
}

function ProblemDescriptionTab({ onBackToAllProblem }: Props) {
  const router = useRouter();
  const { taskId, sectionId, labId } = router.query;
  const { isLoading, data } = trpc.front.getProblemDescription.useQuery({
    taskId: taskId as string,
    sectionId: sectionId as string,
    labId: labId as string,
  });

  return (
    <>
      <div className="flex items-center justify-between">
        <button
          onClick={onBackToAllProblem}
          className="group flex items-center gap-1 text-sand-11 hover:text-sand-12"
        >
          <MoveLeft
            size="1rem"
            className="transition-transform group-hover:-translate-x-1"
          />
          <h5>All Problems</h5>
        </button>
        <ProblemStatus status="Passed" />
      </div>
      <h2 className="mt-6 rounded-t-lg text-2xl font-bold text-sand-12">
        {data?.name}
      </h2>
      <div className="prose-sand max-w-none prose before:prose-code:content-[''] after:prose-code:content-[''] mt-4">
        {!isLoading && <MDXRender mdxSource={data?.description!} />}
      </div>
      <div className="flex gap-2 p-2">
        <button className="flex-1 rounded-lg border p-2 hover:bg-sand-2 active:bg-sand-4">
          Previous
        </button>
        <button className="flex-1 rounded-lg border bg-sand-12/90 p-2 text-sand-1 active:bg-sand-12">
          Next
        </button>
      </div>
    </>
  );
}

export default ProblemDescriptionTab;
