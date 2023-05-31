import FrontLayout from "~/Layout/FrontLayout";
import { useRouter } from "next/router";
import Card from "~/components/Common/Card";
import ProgressIndicator from "~/components/Common/ProgressIndicator";
import { trpc } from "~/helpers";

function Course() {
  const router = useRouter();
  const { sectionId } = router.query;
  const sectionIdInt = parseInt(sectionId as string);

  const labs = trpc.front.getLabs.useQuery(
    { sectionId: sectionIdInt },
    {
      refetchOnMount: false,
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
      <div className="my-10 grid grid-cols-12 gap-6">
        {labs.data?.labs.map(({ id, name }) => (
          <Card
            key={id}
            href={{
              pathname: router.pathname + "/labs/[labId]",
              query: { ...router.query, labId: id },
            }}
            title={name}
          >
            <ProgressIndicator />
          </Card>
        ))}
      </div>
    </FrontLayout>
  );
}

export default Course;
