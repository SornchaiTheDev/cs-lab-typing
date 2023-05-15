import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import CourseLayout from "@/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Badge from "@/components/Common/Badge";
import { trpc } from "@/helpers/trpc";
import Skeleton from "@/components/Common/Skeleton";

const instructors = ["SornchaiTheDev", "SaacSOS"];

const TA = ["Jgogo01", "Teerut26"];

function InCourse() {
  const router = useRouter();

  const { courseId } = router.query;
  const course = trpc.courses.getCourseById.useQuery({
    id: parseInt(courseId as string),
  });

  return (
    <CourseLayout isLoading={course.isLoading} title={course.data?.name!}>
      <div className="w-1/2 p-4 text-sand-12">
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
        <h5 className="mt-4 mb-2 font-bold">Course Number</h5>
        {course.isLoading ? (
          <Skeleton width={"10rem"} height={"1.5rem"} />
        ) : (
          <h4 className="text-lg">{course.data?.number}</h4>
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
            <div
              key={full_name}
              className="flex items-center px-2 py-1 text-sm font-semibold text-white rounded-md bg-sand-12"
            >
              <h5>{full_name}</h5>
            </div>
          ))}
        </div>
        <h5 className="mt-4 mb-2 font-bold">Instructor (s)</h5>
        <div className="flex flex-wrap gap-2">
          {instructors.map((instructor) => (
            <Badge key={instructor}>{instructor}</Badge>
          ))}
        </div>
      </div>
    </CourseLayout>
  );
}

export default InCourse;
