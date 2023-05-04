import React from "react";
import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import CourseLayout from "@/Layout/CourseLayout";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function InCourse({ course }: Props) {
  const router = useRouter();

  return <CourseLayout title={course.name}></CourseLayout>;
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
