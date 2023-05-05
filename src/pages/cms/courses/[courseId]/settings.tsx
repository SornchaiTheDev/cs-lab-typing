import CourseLayout from "@/Layout/CourseLayout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { AddCourseSchema, TAddCourse } from "@/forms/CourseSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import Button from "@/components/Common/Button";
import DeleteAffect from "@/components/DeleteAffect";
import { generatePerson } from "@/helpers";
import Forms from "@/components/Forms";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Settings({ course }: Props) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
 

  const addCourse = (formData: TAddCourse) => {
    const { number, name, authors, note, comments } = formData;
  };

  return (
    <CourseLayout title="Fundamental Programming Concept">
      <div className="w-1/2 p-4">
        <div className="w-full">
          <h4 className="text-xl">General</h4>
          <hr className="my-2" />

          <Forms
            confirmBtn={{
              title: "Edit Course",
              icon: "solar:pen-2-line-duotone",
              className: "w-1/3 py-2 ",
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
                options: generatePerson(100),
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
        </div>
        <div className="mt-10">
          <h4 className="text-xl text-red-9">Danger Zone</h4>
          <hr className="my-2" />
          <Button
            onClick={() => setIsDeleteOpen(true)}
            icon="solar:trash-bin-minimalistic-line-duotone"
            className="shadow bg-red-9 text-sand-1 active:bg-sand-11"
          >
            Delete Course
          </Button>
          {isDeleteOpen && (
            <DeleteAffect
              type="course"
              onClose={() => setIsDeleteOpen(false)}
              onDelete={() => setIsDeleteOpen(false)}
              selected="Fundamental Programming Concept"
            />
          )}
        </div>
      </div>
    </CourseLayout>
  );
}

export default Settings;
