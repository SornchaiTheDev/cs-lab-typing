import React from "react";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import CourseLayout from "@/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Badge from "@/components/Common/Badge";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

const instructors = ["SornchaiTheDev", "SaacSOS"];

const TA = ["Jgogo01", "Teerut26"];

function InCourse({ course }: Props) {
  const router = useRouter();

  return (
    <CourseLayout title="Fundamental Programming Concept">
      <div className="w-1/2 p-4 text-sand-12">
        <h4 className="text-2xl">Course Information</h4>
        <h5 className="mt-4 mb-2 font-bold">Enrolled Student</h5>
        <div className="flex items-center px-1 w-fit">
          <Icon icon="solar:user-hand-up-line-duotone" className="text-lg" />
          <h6 className="text-sand-12">
            <span className="font-bold">148</span> students
          </h6>
        </div>
        <h5 className="mt-4 mb-2 font-bold">Course Number</h5>
        <h4 className="text-lg">CS112</h4>
        <h5 className="mt-4 mb-2 font-bold">Course Name</h5>
        <h4 className="text-lg">Fundamental Programming Concept</h4>
        <h5 className="mt-4 mb-2 font-bold">Note</h5>
        <h4 className="text-lg">Fundamental Programming Concept</h4>
        <h5 className="mt-4 mb-2 font-bold">Comment</h5>
        <h4 className="text-lg">This is a comment.</h4>
        <h5 className="mt-4 mb-2 font-bold">Author (s)</h5>
        <div className="flex flex-wrap gap-2">
          {instructors.map((instructor) => (
            <div
              key={instructor}
              className="flex items-center px-2 py-1 text-sm font-semibold text-white rounded-md bg-sand-12"
            >
              <h5>{instructor}</h5>
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

export const getStaticProps: GetStaticProps<Props> = () => {
  return {
    props: {
      course: {
        id: "01418112",
        name: "Fundamental Programming Concept",
      },
    },
  };
};

export const getStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};
