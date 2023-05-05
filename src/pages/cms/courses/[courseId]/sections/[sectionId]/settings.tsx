import CourseLayout from "@/Layout/CourseLayout";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/Common/Input";
import { Controller, useForm } from "react-hook-form";
import { AddCourseSchema, TAddCourse } from "@/forms/AddCourse";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "@/components/Common/TextArea";
import Button from "@/components/Common/Button";
import Multiple from "@/components/Search/Multiple";
import DeleteAffect from "@/components/DeleteAffect";
import SectionLayout from "@/Layout/SectionLayout";
import Select from "@/components/Common/Select";
import { AddSectionSchema, TAddSection } from "@/forms/AddSection";
import { semesters } from "@/__mock__";
import { generatePerson } from "@/helpers";
import Forms from "@/components/Forms";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Settings({ course }: Props) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<TAddSection>({
    resolver: zodResolver(AddSectionSchema),
  });

  const [instructors, setInstructors] = useState<string[]>([]);
  const [isInstructorsError, setIsInstructorsError] = useState(false);
  const [semester, setSemester] = useState<string | null>(null);
  const [isSemesterError, setIsSemesterError] = useState(false);

  const editSection = (formData: TAddSection) => {
    const { name, note } = formData;
  };

  useEffect(() => {
    if (isSubmitted) {
      if (instructors.length === 0) setIsInstructorsError(true);
      else setIsInstructorsError(false);

      if (!semester) setIsSemesterError(true);
      else setIsSemesterError(false);
    }
  }, [instructors, semester, isSubmitted]);

  return (
    <SectionLayout title="12 (F 15 - 17)">
      <div className="w-1/2 p-4">
        <div className="w-full">
          <h4 className="text-xl">General</h4>
          <hr className="my-2" />

          <Forms
            onSubmit={editSection}
            schema={AddSectionSchema}
            fields={[
              {
                label: "semester",
                title: "Semester",
                type: "select",
              },
              { label: "name", title: "Name", type: "text" },
              {
                label: "instructors",
                title: "Instructors",
                type: "multiple",
                options: generatePerson(100),
              },
              { label: "note", title: "Note", type: "text" },
            ]}
            confirmBtn={{
              title: "Edit Section",
              icon: "solar:pen-2-line-duotone",
              className: "w-1/3 py-2 ",
            }}
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
            Delete Section
          </Button>
          {isDeleteOpen && (
            <DeleteAffect
              type="section"
              onClose={() => setIsDeleteOpen(false)}
              onDelete={() => setIsDeleteOpen(false)}
              selected="12 (F 15 - 17)"
            />
          )}
        </div>
      </div>
    </SectionLayout>
  );
}

export default Settings;
