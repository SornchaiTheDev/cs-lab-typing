import dayjs from "dayjs";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import React from "react";
import CodeSection from "~/features/Problem/CodeSection";
import Sidebar from "~/features/Problem/Sidebar";
import FrontLayout from "~/layouts/FrontLayout";
import { replaceSlugwithQueryPath } from "~/utils";
import { createTrpcHelper } from "~/utils/createTrpcHelper";

interface Props {
  taskName: string;
  courseName: string;
  labName: string;
  labStatus: string;
  sectionType: "Lesson" | "Exam";
}

function ProblemTask({ courseName, labName }: Props) {
  const router = useRouter();
  return (
    <FrontLayout
      customBackPath={`/courses/${replaceSlugwithQueryPath(
        "[sectionId]",
        router.query
      )}/labs/${replaceSlugwithQueryPath("[labId]", router.query)}`}
      breadcrumbs={[
        { label: "My Course", path: "/" },
        {
          label: courseName ?? "",
          path: `/courses/${replaceSlugwithQueryPath(
            "[sectionId]",
            router.query
          )}`,
        },
        {
          label: labName ?? "",
          path: `/courses/${replaceSlugwithQueryPath(
            "[sectionId]",
            router.query
          )}/labs/${replaceSlugwithQueryPath("[labId]", router.query)}`,
        },
      ]}
      className="px-4 pb-4 pt-8"
    >
      <div className="flex h-full">
        <Sidebar />
        <CodeSection />
      </div>
    </FrontLayout>
  );
}

export default ProblemTask;

export const getServerSideProps: GetServerSideProps<Props> = async (
  ctx: GetServerSidePropsContext
) => {
  const { req, res } = ctx;
  const { helper } = await createTrpcHelper({ req, res });
  const { labId, sectionId, taskId } = ctx.query;
  try {
    const {
      courseName,
      labName,
      labStatus,
      taskName,
      taskBody,
      closed_at,
      sectionType,
    } = await helper.front.getTaskById.fetch({
      labId: labId as string,
      sectionId: sectionId as string,
      taskId: taskId as string,
    });

    let _labStatus = labStatus;
    const now = dayjs();

    if (dayjs(closed_at).diff(now, "second") <= 0) {
      _labStatus = "READONLY";
    }

    return {
      props: {
        courseName,
        labName,
        labStatus: _labStatus,
        taskName,
        taskBody,
        sectionType,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
