import FrontLayout from "~/layouts/FrontLayout";
import { useRouter } from "next/router";
import Card from "~/components/Common/Card";
import ProgressIndicator from "~/components/Common/ProgressIndicator";
import { trpc } from "~/utils";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/utils/createTrpcHelper";
import { TRPCError } from "@trpc/server";

function Course() {
  const router = useRouter();
  const { sectionId } = router.query;

  const section = trpc.front.getLabs.useQuery(
    { sectionId: sectionId as string },
    {
      enabled: !!sectionId,
    }
  );

  return (
    <FrontLayout
      title={section.data?.courseName ?? ""}
      isLoading={section.isLoading}
      customBackPath="/"
      breadcrumbs={[{ label: "My Course", path: "/" }]}
    >
      {/* <Announcement /> */}

      <div className="my-10 grid grid-cols-12 gap-6">
        {section.data?.labs.map(({ id, name, tasksStatus, status, active }) => (
          <Card
            key={id}
            disabled={status === "DISABLED" || !active}
            href={{
              pathname: router.pathname + "/labs/[labId]",
              query: { ...router.query, labId: id },
            }}
            title={name}
            badges={[
              {
                title: !active ? "DISABLED" : (status as string),
                type: !active
                  ? "danger"
                  : status === "ACTIVE"
                  ? "success"
                  : status === "READONLY"
                  ? "warning"
                  : "danger",
              },
            ]}
          >
            <ProgressIndicator tasksStatus={tasksStatus} />
          </Card>
        ))}
      </div>
    </FrontLayout>
  );
}

export default Course;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper } = await createTrpcHelper({ req, res });
  const { sectionId } = query;

  try {
    const section = await helper.front.getLabs.fetch({
      sectionId: sectionId as string,
    });

    if (!section?.active) {
      throw new Error("NOT_FOUND");
    }
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === "NOT_FOUND") {
        return {
          notFound: true,
        };
      }
    }

    if (err instanceof TRPCError) {
      if (err.message === "SOMETHING_WENT_WRONG") {
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
