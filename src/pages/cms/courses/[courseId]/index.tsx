import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import CourseLayout from "~/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Badge from "~/components/Common/Badge";
import { trpc } from "~/helpers";
import Skeleton from "~/components/Common/Skeleton";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { transformer } from "~/helpers";
import { appRouter } from "~/server/api/root";
import { createInnerTRPCContext } from "~/server/context";
import { getServerAuthSession } from "~/server/auth";

function InCourse() {
  const router = useRouter();

  const { courseId } = router.query;
  const course = trpc.courses.getCourseById.useQuery({
    id: parseInt(courseId as string),
  });

  return (
    <CourseLayout
      isLoading={course.isLoading}
      title={course.data?.name as string}
    >
      <div className="p-4 text-sand-12 md:w-1/2">
        <h4 className="text-2xl">Course Information</h4>
        <h5 className="mb-2 mt-4 font-bold">Enrolled Student</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"2rem"} />
        ) : (
          <div className="flex w-fit items-center px-1 gap-1">
            <Icon icon="solar:user-hand-up-line-duotone" className="text-lg" />
            <h6 className="text-sand-12">
              <span className="font-bold">
                {course.data?.sections[0]?._count.students ?? 0}
              </span>{" "}
              students
            </h6>
          </div>
        )}

        <h5 className="mb-2 mt-4 font-bold">Course Name</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"1.5rem"} />
        ) : (
          <h4 className="text-lg">{course.data?.name as string}</h4>
        )}
        <h5 className="mb-2 mt-4 font-bold">Note</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"1.5rem"} />
        ) : (
          <h4 className="text-lg">
            {(course.data?.note as string) === "" ? "-" : course.data?.note}
          </h4>
        )}
        <h5 className="mb-2 mt-4 font-bold">Comment</h5>
        {course.isLoading ? (
          <Skeleton width={"100%"} height={"8rem"} />
        ) : (
          <p>
            {(course.data?.comments as string) === ""
              ? "-"
              : (course.data?.comments as string)}
          </p>
        )}
        <h5 className="mb-2 mt-4 font-bold">Author (s)</h5>
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
export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const session = await getServerAuthSession({ req, res });
  const trpc = createServerSideHelpers({
    router: appRouter,
    ctx: createInnerTRPCContext({ session }), // eslint here
    transformer,
  });
  const { courseId } = query;
  const id = parseInt(courseId as string);
  if (isNaN(id)) {
    return {
      notFound: true,
    };
  }

  const course = await trpc.courses.getCourseById.fetch({ id });

  if (!course) {
    return {
      notFound: true,
    };
  }

  return {
    props: {},
  };
};
