import Link from "next/link";
import React from "react";
import { twMerge } from "tailwind-merge";
import type { taskWithStatus } from "~/types";
import { useRouter } from "next/router";

interface Props {
  tasks: taskWithStatus[];
  sectionType: string | null;
}
function ProblemList({ tasks, sectionType }: Props) {
  const router = useRouter();
  const isExam = sectionType === "Exam";
  const LESSON_PATH = "/courses/[sectionId]/labs/[labId]/typing/[taskId]";
  const EXAM_PATH = "/courses/[sectionId]/labs/[labId]/typing/exam/[taskId]";
  return (
    <div className="fixed left-0 top-0 h-full w-[20rem] rounded-r-2xl bg-sand-1 border border-sand-6 p-4 shadow">
      <h3 className="text-2xl font-bold text-sand-12">Tasks List</h3>
      <div className="h-full overflow-y-auto px-2 mt-4">
        {tasks.map(({ id, name, status }) => (
          <Link
            key={id}
            href={{
              pathname: isExam ? EXAM_PATH : LESSON_PATH,
              query: { ...router.query, taskId: id },
            }}
            className="relative col-span-12 mb-2 flex h-[8rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
          >
            <div
              className={twMerge(
                "absolute -bottom-1 h-4 w-full p-1",
                status === "PASSED" && "bg-lime-9",
                status === "FAILED" && "bg-red-9",
                status === "NOT_SUBMITTED" && "bg-sand-9"
              )}
            />

            <div className="mb-2 flex flex-col gap-2 p-2">
              <h4 className="text-xl font-medium text-sand-12">{name}</h4>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProblemList;
