import FrontLayout from "~/Layout/FrontLayout";
import { useRouter } from "next/router";
import Card from "~/components/Common/Card";
import ProgressIndicator from "~/components/Common/ProgressIndicator";

function Course() {
  const router = useRouter();
  return (
    <FrontLayout
      title="Typing Test"
      customBackPath="/"
      breadcrumbs={[{ label: "My Course", path: "/" }]}
    >
      <div className="my-10 grid grid-cols-12 gap-6">
        <Card
          href={{
            pathname: router.pathname + "/labs",
            query: { ...router.query },
          }}
          title="Lab01"
        >
          <ProgressIndicator />
        </Card>
      </div>
    </FrontLayout>
  );
}

export default Course;
