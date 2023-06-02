import { useRouter } from "next/router";

import React from "react";
import FrontLayout from "~/Layout/FrontLayout";
import Card from "~/components/Common/Card";
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
        {tasks.data?.tasks.map(({ id, name }) => (
          <Card
            key={id}
            title={name}
            href={{
              pathname: router.pathname + "/typing/[taskId]",
              query: { ...router.query, taskId: id },
            }}
          />
        ))}
      </div>
    </FrontLayout>
  );
}

export default Labs;
