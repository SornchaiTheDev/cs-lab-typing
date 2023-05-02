import React, { useEffect, useState } from "react";
import ModalWithButton from "../Common/ModalWithButton";
import Input from "../Common/Input";
import { useForm } from "react-hook-form";
import { AddCourseSchema, type TAddCourse } from "@/forms/AddCourse";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "../Common/TextArea";
import Button from "../Common/Button";
import Multiple from "../Search/Multiple";
import { z } from "zod";

function AddCourse() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
  } = useForm<TAddCourse>({
    resolver: zodResolver(AddCourseSchema),
  });

  const [authors, setAuthors] = useState<string[]>([]);
  const [isAuthorError, setisAuthorError] = useState<boolean>(false);

  const addCourse = (formData: TAddCourse) => {
    const { name, comments, note, number } = formData;
  };

  useEffect(() => {
    if (isSubmitted && authors.length === 0) {
      setisAuthorError(true);
      return;
    }

    setisAuthorError(false);
  }, [authors.length, isSubmitted]);

  return (
    <div className="mb-4">
      <ModalWithButton
        title="Add Course"
        icon="solar:add-circle-line-duotone"
        className="md:w-[40rem] max-h-[90%] overflow-y-auto"
      >
        <form
          className="flex flex-col gap-2"
          onSubmit={handleSubmit(addCourse)}
        >
          <div className="flex w-full gap-2">
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
          </div>

          <Multiple
            title="Authors"
            value={setAuthors}
            isError={isAuthorError}
            error="Authors cannot be empty"
          />
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
