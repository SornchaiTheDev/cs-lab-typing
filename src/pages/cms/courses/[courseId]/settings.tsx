import CourseLayout from "@/Layout/CourseLayout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { AddCourseSchema, TAddCourse } from "@/forms/CourseSchema";
import Button from "@/components/Common/Button";
import DeleteAffect from "@/components/DeleteAffect";
import { trpc } from "@/helpers";
import Forms from "@/components/Forms";
import Toast from "@/components/Common/Toast";
import toast from "react-hot-toast";
import { useDeleteAffectStore } from "@/store";

function Settings() {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const router = useRouter();
  const { courseId } = router.query;
  const {
    data: course,
    isLoading,
    refetch,
  } = trpc.courses.getCourseById.useQuery({
    id: parseInt(courseId as string),
  });

  const authorUser = trpc.users.getAllUsersInRole.useQuery({
    roles: ["ADMIN", "TEACHER"],
  });

  const editCourseMutation = trpc.courses.updateCourse.useMutation();
  const editCourse = async (formData: TAddCourse) => {
    try {
      if (course) {
        await editCourseMutation.mutateAsync({ ...formData, id: course?.id });
        toast.custom((t) => (
          <Toast {...t} msg="Edit course successfully" type="success" />
        ));
        refetch();
      }
    } catch (err: any) {
      toast.custom((t) => <Toast {...t} msg={err.message} type="error" />);
    }
  };

  return (
    <>
      {selectedObj && <DeleteAffect type="course" />}

      <CourseLayout title={course?.name!} isLoading={isLoading}>
        <div className="w-1/2 p-4">
          <div className="w-full">
            <h4 className="text-xl">General</h4>
            <hr className="my-2" />

            <Forms
              isLoading={isLoading}
              confirmBtn={{
                title: "Edit Course",
                icon: "solar:pen-2-line-duotone",
              }}
              schema={AddCourseSchema}
              onSubmit={editCourse}
              fields={[
                {
                  label: "number",
                  title: "Number",
                  type: "text",
                  value: course?.number,
                },
                {
                  label: "name",
                  title: "Name",
                  type: "text",
                  value: course?.name,
                },
                {
                  label: "authors",
                  title: "Authors",
                  type: "multiple-search",
                  options: authorUser.data?.map((user) => user.full_name) ?? [],
                  value: course?.authors.map((author) => author.full_name),
                },
                {
                  label: "note",
                  title: "Note",
                  type: "text",
                  value: course?.note ?? "",
                  optional: true,
                },
                {
                  label: "comments",
                  title: "Comments",
                  type: "textarea",
                  optional: true,
                  value: course?.comments ?? "",
                },
              ]}
            />
          </div>
          <div className="mt-10">
            <h4 className="text-xl text-red-9">Danger Zone</h4>
            <hr className="my-2" />
            <Button
              onClick={() =>
                setSelectedObj({ selected: course?.name!, type: "course" })
              }
              icon="solar:trash-bin-minimalistic-line-duotone"
              className="shadow bg-red-9 text-sand-1 active:bg-red-11"
            >
              Delete Course
            </Button>
          </div>
        </div>
      </CourseLayout>
    </>
  );
}

export default Settings;
