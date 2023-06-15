import FrontLayout from "~/Layout/FrontLayout";
import { useRouter } from "next/router";
import Card from "~/components/Common/Card";
import ProgressIndicator from "~/components/Common/ProgressIndicator";
import { trpc } from "~/helpers";
import Announcement from "~/components/Common/Announcement";

function Course() {
  const router = useRouter();
  const { sectionId } = router.query;
  

  const labs = trpc.front.getLabs.useQuery(
    { sectionId: sectionId as string },
    {
      refetchOnWindowFocus: false,
    }
  );

  return (
    <FrontLayout
      title={labs.data?.course.name ?? ""}
      isLoading={labs.isLoading}
      customBackPath="/"
      breadcrumbs={[{ label: "My Course", path: "/" }]}
    >
      <Announcement />

      <div className="grid grid-cols-12 gap-6 my-10">
        {labs.data?.labs.map(
          ({ id, name, tasksStatus, status, isDisabled }) => (
            <Card
              key={id}
              disabled={status === "DISABLED" || isDisabled}
              href={{
                pathname: router.pathname + "/labs/[labId]",
                query: { ...router.query, labId: id },
              }}
              title={name}
              badges={[
                {
                  title: isDisabled ? "DISABLED" : (status as string),
                  type: isDisabled
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
          )
        )}
      </div>
    </FrontLayout>
  );
}

export default Course;
