import { TRPCError } from "@trpc/server";
import clsx from "clsx";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import FrontLayout from "~/layouts/FrontLayout";
import { replaceSlugwithQueryPath } from "~/utils";
import { createTrpcHelper } from "~/utils/createTrpcHelper";
import superjson from "superjson";
import type { taskWithStatus } from "~/types";
import type { task_type } from "@prisma/client";

interface Props {
  courseName: string;
  labName: string;
  tasks: string;
}

const routeByTaskType = (type: task_type) => {
  let pathName = "";
  switch (type) {
    case "Lesson":
      throw new Error("Not yet implement");
    case "Problem":
      pathName = "[labId]/problem/[taskId]";
      break;
    case "Typing":
      pathName = "[labId]/typing/[taskId]";
      break;
  }
  return pathName;
};
function Labs({ courseName, labName, tasks }: Props) {
  const router = useRouter();

  const _tasks: taskWithStatus[] = superjson.parse(tasks);

  return (
    <FrontLayout
      title={labName ?? ""}
      customBackPath={`/courses/${replaceSlugwithQueryPath(
        "[sectionId]",
        router.query
      )}`}
      breadcrumbs={[
        { label: "My Course", path: "/" },
        {
          label: courseName ?? "",
          path: `/courses/${replaceSlugwithQueryPath(
            "[sectionId]",
            router.query
          )}`,
        },
      ]}
      className="container mx-auto"
    >
      <div className="my-10 grid grid-cols-12 gap-6">
        {_tasks.map(({ id, name, status, type }) => (
          <Link
            key={id}
            href={{
              pathname: routeByTaskType(type),
              query: { ...router.query, taskId: id },
            }}
            className="relative col-span-12 flex h-[8rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper } = await createTrpcHelper({ req, res });
  const { sectionId, labId } = query;

  try {
    const lab = await helper.front.getTasks.fetch({
      labId: labId as string,
      sectionId: sectionId as string,
    });
    if (lab) {
      const { courseName, labName, tasks } = lab;
      return {
        props: {
          courseName,
          labName,
          tasks: superjson.stringify(tasks),
        },
      };
    }
  } catch (err) {
    if (err instanceof TRPCError) {
      if (
        err.message === "NOT_FOUND" ||
        err.message === "SOMETHING_WENT_WRONG"
      ) {
        return {
          notFound: true,
        };
      }
    }
  }

  return {
    props: {},
  };
};
