import React, { useEffect, useState } from "react";
import ModalWithButton from "../Common/ModalWithButton";
import Input from "../Common/Input";
import { Controller, useForm } from "react-hook-form";
import { AddCourseSchema, type TAddCourse } from "@/forms/AddCourse";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "../Common/TextArea";
import Button from "../Common/Button";
import Multiple from "../Search/Multiple";
import { z } from "zod";
import { generatePerson } from "@/helpers";

function AddCourse() {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitted },
  } = useForm<TAddCourse>({
    resolver: zodResolver(AddCourseSchema),
  });

  const addCourse = (formData: TAddCourse) => {
    const { name, comments, note, number } = formData;
  };

  return (
    <div className="mb-4">
      <ModalWithButton
        title="Add Course"
        icon="solar:add-circle-line-duotone"
        className="md:w-[40rem] max-h-[90%] overflow-y-auto"
        confirmBtn={{
          title: "Add Course",
          icon: "solar:add-circle-line-duotone",
          onClick: () => {},
        }}
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
          <Controller
            control={control}
            name="authors"
            render={({ field: { onChange, value } }) => (
              <Multiple
                title="Authors"
                datas={generatePerson(10)}
                value={value}
                onChange={onChange}
                isError={errors.authors !== undefined}
                error="Authors cannot be empty"
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
        </form>
      </ModalWithButton>
    </div>
  );
}

export default AddCourse;
