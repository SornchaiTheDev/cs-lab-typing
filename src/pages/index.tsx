import FrontLayout from "~/Layout/FrontLayout";
import { trpc } from "~/helpers";
import Card from "~/components/Common/Card";
import Skeleton from "~/components/Common/Skeleton";

function MyCourse() {
  const allSections = trpc.front.getSections.useQuery();

  const teachingAssistantSections = trpc.front.getTeachingSections.useQuery();

  return (
    <FrontLayout title="My Courses">
      {allSections.isLoading ? (
        <div className="grid grid-cols-12 gap-6 my-4">
          {new Array(3).fill(0).map((_, i) => (
            <Skeleton
              key={i}
              height={"12rem"}
              className="col-span-12 md:col-span-4"
            />
          ))}
        </div>
      ) : (allSections.data?.length as number) > 0 ? (
        <div className="grid grid-cols-12 gap-6 my-4">
          {allSections.data?.map(({ id, name, course }) => {
            const { name: courseName, number } = course;
            return (
              <Card
                key={id}
                href={{
                  pathname: "/courses/[sectionId]",
                  query: { sectionId: id },
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
      ) : null}

      {teachingAssistantSections.isLoading ? (
        <>
          <div className="mt-4">
            <Skeleton width="16rem" height="2rem" />
          </div>
          <div className="grid grid-cols-12 gap-6 my-4">
            {new Array(3).fill(0).map((_, i) => (
              <Skeleton
                key={i}
                height={"12rem"}
                className="col-span-12 md:col-span-4"
              />
            ))}
          </div>
        </>
      ) : (teachingAssistantSections.data?.length as number) > 0 ? (
        <>
          <div className="mt-4">
            <h4 className="text-2xl font-medium md:text-3xl text-sand-12">
              Teach
            </h4>
          </div>
          <div className="grid grid-cols-12 gap-6 my-6">
            {teachingAssistantSections.data?.map(({ id, name, course }) => {
              const { name: courseName, number, id: courseId } = course;
              return (
                <Card
                  key={id}
                  href={{
                    pathname: "cms/courses/[courseId]/sections/[sectionId]",
                    query: { courseId, sectionId: id },
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
        </>
      ) : null}
    </FrontLayout>
  );
}

export default MyCourse;
