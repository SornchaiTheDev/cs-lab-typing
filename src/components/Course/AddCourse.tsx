import React from "react";
import ModalWithButton from "../Common/ModalWithButton";
import Input from "../Common/Input";
import { useForm } from "react-hook-form";
import { AddCourseSchema, type TAddCourse } from "@/forms/AddCourse";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "../Common/TextArea";
import Button from "../Common/Button";
import Single from "../Search/Single";

function AddCourse() {
  const { register } = useForm<TAddCourse>({
    resolver: zodResolver(AddCourseSchema),
  });
  return (
    <div className="mb-4">
      <ModalWithButton
        title="Add Course"
        icon="solar:add-circle-line-duotone"
        className="w-[40rem] max-h-[90%] overflow-y-scroll"
      >
        <form className="flex flex-col gap-2">
          <div className="flex w-full gap-2">
            <Input title="Number" label="number" register={register} />
            <Input
              title="Name"
              label="name"
              register={register}
              className="flex-1"
            />
          </div>
          <Single title="Authors" label="authors" register={register} />
          <Input title="Note" label="note" register={register} optional />
          <TextArea
            title="Comments"
            label="comments"
            register={register}
            optional
          />
          <Button
            icon="solar:add-circle-line-duotone"
            className="py-3 shadow bg-sand-12 text-sand-1 active:bg-sand-11"
          >
            Add Course
          </Button>
        </form>
      </ModalWithButton>
    </div>
  );
}

export default AddCourse;
