import Layout from "@/Layout";
import ModalWithButton from "@/components/Common/ModalWithButton";
import Forms from "@/components/Forms";
import { AddCourseSchema, TAddCourse } from "@/forms/CourseSchema";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { trpc } from "@/helpers";
import toast from "react-hot-toast";
import Toast from "@/components/Common/Toast";
import Skeleton from "@/components/Common/Skeleton";
import { TRPCClientError } from "@trpc/client";

function Courses() {
  const router = useRouter();

  const allCourses = trpc.courses.getCoursePagination.useQuery({
    page: 1,
    limit: 10,
  });

  const authorUser = trpc.users.getAllUsersInRole.useQuery({
    roles: ["ADMIN", "TEACHER"],
  });

  const addCourseMutation = trpc.courses.createCourse.useMutation();
  const addCourse = async (formData: TAddCourse) => {
    try {
      const course = await addCourseMutation.mutateAsync(formData);
      if (course) {
        toast.custom((t) => (
          <Toast {...t} msg="Added course successfully" type="success" />
        ));
        router.push({
          pathname: router.pathname + "/[courseId]",
          query: { ...router.query, courseId: course.id },
        });
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        toast.custom((t) => <Toast {...t} msg={errMsg} type="error" />);
      }
    }
  };

  return (
    <Layout title="courses">
      <div className="mb-4">
        <ModalWithButton
          title="Add Course"
          icon="solar:add-circle-line-duotone"
          className="md:w-[40rem] max-h-[90%] overflow-y-auto"
        >
          <Forms
            confirmBtn={{
              title: "Add Course",
              icon: "solar:add-circle-line-duotone",
            }}
            schema={AddCourseSchema}
            onSubmit={addCourse}
            fields={[
              { label: "number", title: "Number", type: "text" },
              {
                label: "name",
                title: "Name",
                type: "text",
              },
              {
                label: "authors",
                title: "Authors",
                type: "multiple-search",
                options: authorUser.data?.map((user) => user.full_name) ?? [],
              },
              { label: "note", title: "Note", type: "text", optional: true },
              {
                label: "comments",
                title: "Comments",
                type: "textarea",
                optional: true,
              },
            ]}
          />
        </ModalWithButton>
      </div>
      <div className="grid grid-cols-12 gap-6">
        {allCourses.isLoading
          ? new Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={"12rem"}
                  className="col-span-12 md:col-span-4"
                />
              ))
          : allCourses.data!.map(({ id, name, note, number }, i) => (
              <Link
                key={id}
                href={{
                  pathname: "/cms/courses/[courseId]",
                  query: { courseId: id },
                }}
                className="relative col-span-12 md:col-span-4 overflow-hidden border flex flex-col justify-end border-sand-6 h-[12rem] rounded-lg bg-sand-4 hover:bg-sand-5 shadow-lg"
              >
                <div className="flex flex-col gap-2 p-2">
                  <div className="px-2 text-white rounded-lg bg-lime-9 w-fit">
                    {number}
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-sand-12">{name}</h4>
                    <div className="absolute flex items-center px-1 rounded-lg w-fit bg-sand-7 right-2 top-2">
                      <Icon
                        icon="solar:user-hand-up-line-duotone"
                        className="text-lg"
                      />
                      <h6 className="text-sand-12">
                        <span className="font-bold">148</span> students
                      </h6>
                    </div>
                    <h6 className="text-sand-10">{note}</h6>
                  </div>
                </div>
              </Link>
            ))}
      </div>
    </Layout>
  );
}

export default Courses;
