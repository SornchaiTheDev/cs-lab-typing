import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";

import React from "react";
import FrontLayout from "~/Layout/FrontLayout";
import { replaceSlugwithQueryPath, trpc } from "~/helpers";

function Labs() {
  const router = useRouter();
  const { labId } = router.query;
  const labIdInt = parseInt(labId as string);

  const tasks = trpc.front.getTasks.useQuery(
    {
      labId: labIdInt,
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <FrontLayout
      title={tasks.data?.labName ?? ""}
      isLoading={tasks.isLoading}
      customBackPath={`/courses/${replaceSlugwithQueryPath(
        "[sectionId]",
        router.query
      )}`}
      breadcrumbs={[
        { label: "My Course", path: "/" },
        {
          label: tasks.data?.courseName ?? "",
          path: `/courses/${replaceSlugwithQueryPath(
            "[sectionId]",
            router.query
          )}`,
          isLoading: tasks.isLoading,
        },
      ]}
    >
      <div className="my-10 grid grid-cols-12 gap-6">
        {tasks.data?.tasks.map(({ id, name, status }) => (
          <Link
            key={id}
            href={{
              pathname: router.pathname + "/typing/[taskId]",
              query: { ...router.query, taskId: id },
            }}
            className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
          >
            <div
              className={clsx(
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
    </FrontLayout>
  );
}

export default Labs;
