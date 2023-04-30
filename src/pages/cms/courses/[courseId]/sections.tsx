import CourseLayout from "@/Layout/CourseLayout";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

function Sections() {
  const router = useRouter();
  const { courseId } = router.query;
  return (
    <CourseLayout title={courseId as string}>
      <div className="grid grid-cols-12 gap-6 mt-4">
        {new Array(0).fill(0).map((_, i) => (
          <Link
            key={i}
            href="courses/01418112"
            className="relative col-span-12 md:col-span-4 overflow-hidden border flex flex-col justify-end border-sand-6 h-[12rem] rounded-lg bg-sand-4 hover:bg-sand-5 shadow-lg"
          >
            <div className="flex flex-col gap-2 p-2">
              <div className="px-2 text-white rounded-lg bg-lime-9 w-fit">
                12 (F 15 - 17)
              </div>
              <div>
                <div className="absolute flex items-center px-1 rounded-lg w-fit bg-sand-7 right-2 top-2">
                  <Icon
                    icon="solar:user-hand-up-line-duotone"
                    className="text-lg"
                  />
                  <h6 className="text-sand-12">
                    <span className="font-bold">18</span> students
                  </h6>
                </div>
                <h6 className="text-sand-10">
                  Lorem ipsum dolor sit amet consectetur
                </h6>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </CourseLayout>
  );
}

export default Sections;
