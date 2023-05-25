import { useRouter } from "next/router";

import React from "react";
import FrontLayout from "~/Layout/FrontLayout";
import Card from "~/components/Common/Card";
import { replaceSlugwithQueryPath } from "~/helpers";

function Labs() {
  const router = useRouter();

  return (
    <FrontLayout
      title="Lab001"
      customBackPath={`/courses/${replaceSlugwithQueryPath(
        "[courseId]",
        router.query
      )}`}
      breadcrumbs={[
        { label: "My Course", path: "/" },
        {
          label: "Typing Test",
          path: `/courses/${replaceSlugwithQueryPath(
            "[courseId]",
            router.query
          )}`,
        },
      ]}
    >
      <div className="my-10 grid grid-cols-12 gap-6">
        <Card
          title="Task A"
          href={{
            pathname: router.pathname + "/typing/1",
            query: { ...router.query },
          }}
        />
      </div>
    </FrontLayout>
  );
}

export default Labs;
