import FrontLayout from "~/Layout/FrontLayout";
import { trpc } from "~/helpers";
import Card from "~/components/Common/Card";
import Skeleton from "~/components/Common/Skeleton";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Prisma } from "@prisma/client";
import Badge from "~/components/Common/Badge";

type sections = Prisma.sectionsGetPayload<{
  select: {
    id: true;
    name: true;
    semester: true;
    course: {
      select: {
        id: true;
        number: true;
        name: true;
      };
    };
    type: true;
  };
}>;

interface TeachingSectionsProps {
  isLoading: boolean;
  pages: {
    sections: sections[];
  }[];
}
const TeachingSections = ({ isLoading, pages }: TeachingSectionsProps) => {
  return (
    <>
      {isLoading ? (
        <>
          <div className="mt-4">
            <Skeleton width="16rem" height="2rem" />
          </div>
          <div className="my-4 grid grid-cols-12 gap-6">
            {new Array(3).fill(0).map((_, i) => (
              <Skeleton
                key={i}
                height={"12rem"}
                className="col-span-12 md:col-span-4"
              />
            ))}
          </div>
        </>
      ) : pages.length > 0 ? (
        <>
          <div className="mt-4">
            <h4 className="text-2xl font-medium text-sand-12 md:text-3xl">
              Teach
            </h4>
          </div>
          <div className="my-6 grid grid-cols-12 gap-6">
            {pages.map((page) =>
              page.sections.map(({ id, name, course, type, semester }) => {
                const { name: courseName, number, id: courseId } = course;
                const { term, year } = semester;

                return (
                  <Card
                    key={id}
                    href={{
                      pathname: "cms/courses/[courseId]/sections/[sectionId]",
                      query: { courseId, sectionId: id },
                    }}
                    title={`${courseName}`}
                    badges={[
                      { title: `${number} (${term}/${year})`, type: "success" },
                      { title: name, type: "success" },
                      { title: type, type: "info" },
                    ]}
                  />
                );
              })
            )}
          </div>
        </>
      ) : null}
    </>
  );
};
function MyCourse() {
  const { data: session } = useSession();
  const learn = trpc.front.getSections.useInfiniteQuery(
    { limit: 6 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const checkUser = trpc.front.getCheckUser.useQuery();

  const isTaAbove = checkUser.data?.isTaAbove ?? false;

  const teach = trpc.front.getTeachingSections.useInfiniteQuery(
    { limit: 6 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      enabled: isTaAbove,
    }
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (learn.hasNextPage) {
        learn.fetchNextPage();
      }
      if (teach.hasNextPage) {
        teach.fetchNextPage();
      }
    }
  }, [inView, learn, teach]);

  return (
    <FrontLayout title="My Courses">
      {learn.isLoading ? (
        <div className="my-4 grid grid-cols-12 gap-6">
          {new Array(3).fill(0).map((_, i) => (
            <Skeleton
              key={i}
              height={"12rem"}
              className="col-span-12 md:col-span-4"
            />
          ))}
        </div>
      ) : (learn.data?.pages?.length as number) > 0 ? (
        <div className="my-4 grid grid-cols-12 gap-6">
          {learn.data?.pages?.map((page) =>
            page.sections.map(({ id, name, course, semester }) => {
              const { name: courseName, number } = course;
              const { term, year } = semester;
              return (
                <Card
                  key={id}
                  href={{
                    pathname: "/courses/[sectionId]",
                    query: { sectionId: id },
                  }}
                  title={`${courseName}`}
                  badges={[
                    { title: `${number} (${term}/${year})`, type: "success" },
                    // { title: `${term}/${year}`, type: "success" },
                    { title: name, type: "success" },
                  ]}
                />
              );
            })
          )}
        </div>
      ) : null}

      {isTaAbove && (
        <TeachingSections
          isLoading={teach.isLoading}
          pages={teach.data?.pages ?? []}
        />
      )}

      <div ref={ref} className="my-10 flex items-center justify-center gap-2">
        {learn.isFetchingNextPage ||
          (teach.isFetchingNextPage && (
            <>
              <div className="h-2 w-2 animate-ping rounded-full bg-green-9"></div>
              <h4>Loading</h4>
            </>
          ))}
      </div>
    </FrontLayout>
  );
}

export default MyCourse;
