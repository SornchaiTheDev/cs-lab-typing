import Layout from "~/Layout";
import ModalWithButton from "~/components/Common/ModalWithButton";
import Forms from "~/components/Forms";
import { AddCourseSchema, type TAddCourse } from "~/forms/CourseSchema";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";
import toast from "react-hot-toast";
import Toast from "~/components/Common/Toast";
import Skeleton from "~/components/Common/Skeleton";
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
        await router.push({
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
          className="max-h-[90%] overflow-y-auto md:w-[40rem]"
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
          : allCourses.data?.map(({ id, name, note, number }) => (
              <Link
                key={id}
                href={{
                  pathname: "/cms/courses/[courseId]",
                  query: { courseId: id },
                }}
                className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
              >
                <div className="flex flex-col gap-2 p-2">
                  <div className="w-fit rounded-lg bg-lime-9 px-2 text-white">
                    {number}
                  </div>
                  <div>
                    <h4 className="text-xl font-medium text-sand-12">{name}</h4>
                    <div className="absolute right-2 top-2 flex w-fit items-center rounded-lg bg-sand-7 px-1">
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
