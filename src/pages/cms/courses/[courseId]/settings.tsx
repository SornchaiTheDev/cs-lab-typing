import CourseLayout from "@/Layout/CourseLayout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/Common/Input";
import { Controller, useForm } from "react-hook-form";
import { AddCourseSchema, TAddCourse } from "@/forms/AddCourse";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "@/components/Common/TextArea";
import Button from "@/components/Common/Button";
import Multiple from "@/components/Search/Multiple";
import DeleteAffect from "@/components/DeleteAffect";
import { generatePerson } from "@/helpers";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Settings({ course }: Props) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddCourse>({
    resolver: zodResolver(AddCourseSchema),
  });

  return (
    <CourseLayout title="Fundamental Programming Concept">
      <div className="w-1/2 p-4">
        <div className="w-full">
          <h4 className="text-xl">General</h4>
          <hr className="my-2" />

          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(() => {})}
          >
            <Input
              title="Number"
              label="number"
              error={errors.number && errors.number.message}
              isError={errors.number !== undefined}
              register={register}
              className="flex-1"
            />
            <Input
              title="Name"
              label="name"
              register={register}
              error={errors.name && errors.name.message}
              isError={errors.name !== undefined}
              className="flex-1"
            />

            <Controller
              control={control}
              name="authors"
              render={({ field: { onChange, value } }) => (
                <Multiple
                  datas={generatePerson(100)}
                  title="Authors"
                  value={value}
                  onChange={onChange}
                  isError={errors.authors !== undefined}
                  error={errors.authors?.message}
                />
              )}
            />
            <Input title="Note" label="note" register={register} optional />

            <TextArea
              title="Comments"
              label="comments"
              register={register}
              optional
            />
            <Button
              icon="solar:pen-2-line-duotone"
              className="w-1/3 py-2 shadow bg-sand-12 text-sand-1 active:bg-sand-11"
            >
              Edit
            </Button>
          </form>
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
