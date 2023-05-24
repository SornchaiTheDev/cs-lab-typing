import Link from "next/link";
import FrontLayout from "~/Layout/FrontLayout";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";
import { Icon } from "@iconify/react";
import Card from "~/components/Common/Card";
import Skeleton from "~/components/Common/Skeleton";

function MyCourse() {
  const router = useRouter();

  const allCourses = trpc.courses.getUserCourses.useQuery();

  return (
    <FrontLayout title="My Courses">
      <div className="grid grid-cols-12 gap-6">
        {allCourses.isLoading
          ? new Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={"12rem"}
                  className="col-span-12 md:col-span-4"
                />
              ))
          : allCourses.data?.map(({ id, name, number }) => (
              <Card
                key={id}
                href={{
                  pathname: "/courses/[courseId]",
                  query: { courseId: id },
                }}
                title={name}
                badges={[number]}
              />
            ))}
      </div>
    </FrontLayout>
  );
}

export default MyCourse;
