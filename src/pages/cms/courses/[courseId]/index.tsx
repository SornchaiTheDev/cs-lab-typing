import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import CourseLayout from "@/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Badge from "@/components/Common/Badge";
import { trpc } from "@/helpers";
import Skeleton from "@/components/Common/Skeleton";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/routers/_app";
import { transformer } from "@/helpers";
import { prisma } from "@/server/prisma";

function InCourse() {
  const router = useRouter();

  const { courseId } = router.query;
  const course = trpc.courses.getCourseById.useQuery({
    id: parseInt(courseId as string),
  });

  return (
    <CourseLayout isLoading={course.isLoading} title={course.data?.name!}>
      <div className="p-4 md:w-1/2 text-sand-12">
        <h4 className="text-2xl">Course Information</h4>
        <h5 className="mt-4 mb-2 font-bold">Enrolled Student</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"2rem"} />
        ) : (
          <div className="flex items-center px-1 w-fit">
            <Icon icon="solar:user-hand-up-line-duotone" className="text-lg" />
            <h6 className="text-sand-12">
              <span className="font-bold">148</span> students
            </h6>
          </div>
        )}

        <h5 className="mt-4 mb-2 font-bold">Course Name</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"1.5rem"} />
        ) : (
          <h4 className="text-lg">{course.data?.name!}</h4>
        )}
        <h5 className="mt-4 mb-2 font-bold">Note</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"1.5rem"} />
        ) : (
          <h4 className="text-lg">{course.data?.note!}</h4>
        )}
        <h5 className="mt-4 mb-2 font-bold">Comment</h5>
        {course.isLoading ? (
          <Skeleton width={"100%"} height={"8rem"} />
        ) : (
          <p>{course.data?.comments! === "" ? "-" : course.data?.comments!}</p>
        )}
        <h5 className="mt-4 mb-2 font-bold">Author (s)</h5>
        <div className="flex flex-wrap gap-2">
          {course.data?.authors.map(({ full_name }) => (
            <Badge key={full_name}>{full_name}</Badge>
          ))}
        </div>
      </div>
    </CourseLayout>
  );
}

export default InCourse;
// TODO : MAKE THIS WORK
export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  // const helpers = createServerSideHelpers({
  //   router: appRouter,
  //   ctx: await createInnerContext(),
  //   transformer,
  // });
  const { courseId } = query;
  const id = parseInt(courseId as string);
  if (isNaN(id)) {
    return {
      notFound: true,
    };
  }

  const course = await prisma.courses.findUnique({
    where: { id },
  });

  if (!course) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
