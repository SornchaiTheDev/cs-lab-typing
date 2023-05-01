import Layout from "@/Layout";
import Button from "@/components/Common/Button";
import ModalWithButton from "@/components/Common/ModalWithButton";
import AddCourse from "@/components/Course/AddCourse";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";

function Courses() {
  function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  return (
    <Layout title="courses">
      <AddCourse />
      <div className="grid grid-cols-12 gap-6">
        {new Array(10).fill(0).map((_, i) => (
          <Link
            key={i}
            href="courses/01418112"
            className="-z-10 relative col-span-12 md:col-span-4 overflow-hidden border flex flex-col justify-end border-sand-6 h-[12rem] rounded-lg bg-sand-4 hover:bg-sand-5 shadow-lg"
          >
            <div className="flex flex-col gap-2 p-2">
              <div
                className="px-2 text-white rounded-lg bg-lime-9 w-fit"
                style={{ background: getRandomColor() }}
              >
                01418112
              </div>
              <div>
                <h4 className="text-xl font-medium text-sand-12">
                  Fundamental Programming Concept
                </h4>
                <div className="absolute flex items-center px-1 rounded-lg w-fit bg-sand-7 right-2 top-2">
                  <Icon
                    icon="solar:user-hand-up-line-duotone"
                    className="text-lg"
                  />
                  <h6 className="text-sand-12">
                    <span className="font-bold">148</span> students
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
    </Layout>
  );
}

export default Courses;
