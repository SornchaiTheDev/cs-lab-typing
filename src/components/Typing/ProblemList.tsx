import { twMerge } from "tailwind-merge";
import type { taskWithStatus } from "~/types";
import { useRouter } from "next/router";
import { replaceSlugwithQueryPath } from "~/helpers";

interface Props {
  tasks: taskWithStatus[];
  sectionType: string | null;
}
function ProblemList({ tasks, sectionType }: Props) {
  const router = useRouter();
  const isExam = sectionType === "Exam";
  const LESSON_PATH = replaceSlugwithQueryPath(
    "/courses/[sectionId]/labs/[labId]/typing",
    router.query
  );
  const EXAM_PATH = replaceSlugwithQueryPath(
    "/courses/[sectionId]/labs/[labId]/typing/exam",
    router.query
  );

  return (
    <div className="fixed left-0 top-0 h-full w-[20rem] rounded-r-2xl border border-sand-6 bg-sand-1 p-4 shadow">
      <h3 className="text-2xl font-bold text-sand-12">Tasks List</h3>
      <div className="mt-4 h-full overflow-y-auto px-2">
        {tasks.map(({ id, name, status }) => (
          <a
            key={id}
            href={isExam ? `${EXAM_PATH}/${id}` : `${LESSON_PATH}/${id}`}
            className="relative col-span-12 mb-2 flex h-[8rem] w-full flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
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
          </a>
        ))}
      </div>
    </div>
  );
}

export default ProblemList;
