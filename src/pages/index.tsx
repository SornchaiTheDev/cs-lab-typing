import FrontLayout from "~/layouts/FrontLayout";
import { trpc } from "~/utils";
import Card from "~/components/Common/Card";
import Skeleton from "~/components/Common/Skeleton";
import { useInView } from "react-intersection-observer";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Select from "~/components/Forms/Select";
import type { SectionType } from "@prisma/client";

const TeachingSections = () => {
  const allSemesters = trpc.semesters.getAllSemesters.useQuery();
  const [semester, setSemester] = useState("Loading...");
  const [sectionType, setSectionType] = useState("All")

  const teach = trpc.front.getTeachingSections.useInfiniteQuery(
    { limit: 6, semester, sectionType: sectionType as SectionType },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,

    }
  );

  const { ref, inView } = useInView();

  useEffect(() => {
    if (teach.hasNextPage) {
      teach.fetchNextPage();
    }
  }, [inView, teach])

  useEffect(() => {
    if (!!allSemesters.data) {
      setSemester(allSemesters.data[0] ?? "Loading...")
    }
  }, [allSemesters.data, setSemester])


  return (
    <>
      {teach.isLoading ? (
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
      ) : teach.data && teach.data.pages.length > 0 ? (
        <>
          <div className="mt-4 flex justify-between items-center">
            <h4 className="text-2xl font-medium text-sand-12 md:text-3xl">
              Teach
            </h4>
            <div className="flex gap-2">
              <Select options={["All", "Lesson", "Exam"]} className="flex-1 min-w-[8rem]" value={sectionType} preMessage="Type" onChange={setSectionType} />
              <Select options={allSemesters.data ?? []} className="flex-1 min-w-[12rem]" preMessage="Semester" value={semester} onChange={setSemester} />
            </div>

          </div>
          <div className="my-6 grid grid-cols-12 gap-6">
            {teach.data?.pages.map((page) =>
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
                      { title: `${number} (${term} ${year})`, type: "success" },
                      { title: name, type: "success" },
                      { title: type, type: "info" },
                    ]}
                  />
                );
              })
            )}
          </div>
          <div ref={ref} className="my-10 flex items-center justify-center gap-2">
            {teach.isFetchingNextPage && (
              <>
                <div className="h-2 w-2 animate-ping rounded-full bg-green-9"></div>
                <h4>Loading</h4>
              </>
            )}
          </div>
        </>
      ) : null}
    </>
  );
};
function MyCourse() {
  useSession();
  const learn = trpc.front.getSections.useInfiniteQuery(
    { limit: 6 },
    { getNextPageParam: (lastPage) => lastPage.nextCursor }
  );

  const checkUser = trpc.front.getCheckUser.useQuery();

  const isTaAbove = checkUser.data?.isTaAbove ?? false;



  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      if (learn.hasNextPage) {
        learn.fetchNextPage();
      }
    }
  }, [inView, learn]);

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
                    { title: `${number} (${term} ${year})`, type: "success" },
                    { title: name, type: "success" },
                  ]}
                />
              );
            })
          )}
        </div>
      ) : null}

      {isTaAbove && (
        <TeachingSections />
      )}

      <div ref={ref} className="my-10 flex items-center justify-center gap-2">
        {learn.isFetchingNextPage && (
          <>
            <div className="h-2 w-2 animate-ping rounded-full bg-green-9"></div>
            <h4>Loading</h4>
          </>
        )}
      </div>
    </FrontLayout>
  );
}

export default MyCourse;
