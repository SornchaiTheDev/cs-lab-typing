import CourseLayout from "@/Layout/CourseLayout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/Common/Input";
import { useForm } from "react-hook-form";
import { AddCourseSchema, TAddCourse } from "@/forms/AddCourse";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "@/components/Common/TextArea";
import Button from "@/components/Common/Button";
import Multiple from "@/components/Search/Multiple";
import DeleteAffect from "@/components/DeleteAffect";
import SectionLayout from "@/Layout/SectionLayout";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Settings({ course }: Props) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddCourse>({
    resolver: zodResolver(AddCourseSchema),
  });

  return (
    <SectionLayout title="12 (F 15 - 17)">
      <div className="w-1/2 p-4">
        <div className="mt-0">
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
