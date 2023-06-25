import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import CourseLayout from "~/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Badge from "~/components/Common/Badge";
import { trpc } from "~/helpers";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import Skeleton from "~/components/Common/Skeleton";

function InCourse() {
  const router = useRouter();

  const { courseId } = router.query;
  const course = trpc.courses.getCourseById.useQuery(
    {
      id: courseId as string,
    },
    {
      enabled: !!courseId,
    }
  );

  const students = course.data?.sections.reduce(
    (acc, cur) => acc + cur._count.students,
    0
  );
  return (
    <CourseLayout
      isLoading={course.isLoading}
      title={course.data?.name as string}
    >
      <div className="p-4 text-sand-12 md:w-1/2">
        <h4 className="text-2xl">Course Information</h4>
        <h5 className="mt-4 mb-2 font-bold">Enrolled Student</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"2rem"} />
        ) : (
          <div className="flex items-center gap-1 px-1 w-fit">
            <Icon icon="solar:user-hand-up-line-duotone" className="text-lg" />
            <h6 className="text-sand-12">
              <span className="font-bold">{students}</span> students
            </h6>
          </div>
        )}

        <h5 className="mt-4 mb-2 font-bold">Course Name</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"1.5rem"} />
        ) : (
          <h4 className="text-lg">{course.data?.name as string}</h4>
        )}
        <h5 className="mt-4 mb-2 font-bold">Note</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"1.5rem"} />
        ) : (
          <h4 className="text-lg">
            {(course.data?.note as string) === "" ? "-" : course.data?.note}
          </h4>
        )}
        <h5 className="mt-4 mb-2 font-bold">Comment</h5>
        {course.isLoading ? (
          <Skeleton width={"100%"} height={"8rem"} />
        ) : (
          <p>
            {(course.data?.comments as string) === ""
              ? "-"
              : (course.data?.comments as string)}
          </p>
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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper, role } = await createTrpcHelper({ req, res });
  const { courseId } = query;

  if (role === "STUDENT" || !courseId) {
    return {
      notFound: true,
    };
  }

  const course = await helper.courses.getCourseById.fetch({
    id: courseId as string,
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
