import FrontLayout from "~/Layout/FrontLayout";
import { trpc } from "~/helpers";
import Card from "~/components/Common/Card";
import Skeleton from "~/components/Common/Skeleton";

function MyCourse() {
  const allSections = trpc.front.getSections.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });

  return (
    <FrontLayout title="My Courses">
      <div className="grid grid-cols-12 gap-6">
        {allSections.isLoading
          ? new Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={"12rem"}
                  className="col-span-12 md:col-span-4"
                />
              ))
          : allSections.data?.map(({ id, name, course }) => {
              const { name: courseName, number } = course;
              return (
                <Card
                  key={id}
                  href={{
                    pathname: "/courses/[courseId]",
                    query: { courseId: id },
                  }}
                  title={courseName}
                  badges={[
                    { title: number, type: "success" },
                    { title: name, type: "success" },
                  ]}
                />
              );
            })}
      </div>
    </FrontLayout>
  );
}

export default MyCourse;
