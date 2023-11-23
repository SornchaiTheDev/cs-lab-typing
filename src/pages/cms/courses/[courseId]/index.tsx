import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import CourseLayout from "~/Layout/CourseLayout";
import Badge from "~/components/Common/Badge";
import { trpc } from "~/helpers";
import Skeleton from "~/components/Common/Skeleton";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";

function InCourse() {
  const router = useRouter();

  const { courseId } = router.query;
  const course = trpc.courses.getCourseById.useQuery(
    {
      courseId: courseId as string,
    },
    {
      enabled: !!courseId,
    }
  );

  return (
    <CourseLayout
      isLoading={course.isLoading}
      title={course.data?.name as string}
    >
      <div className="p-4 text-sand-12 md:w-1/2">
        <h4 className="text-2xl">Course Information</h4>

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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper } = await createTrpcHelper({ req, res });
  const { courseId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      if (err.message === "NOT_FOUND") {
        return {
          notFound: true,
        };
      }
    }
  }

  return {
    props: {},
  };
};
