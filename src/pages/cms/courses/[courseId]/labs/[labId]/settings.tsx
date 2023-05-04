import LabLayout from "@/Layout/LabLayout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Input from "@/components/Common/Input";
import { Controller, useForm } from "react-hook-form";
import { AddLabSchema, TAddLabSchema } from "@/forms/AddLab";
import { zodResolver } from "@hookform/resolvers/zod";
import TextArea from "@/components/Common/TextArea";
import Button from "@/components/Common/Button";
import Multiple from "@/components/Search/Multiple";
import DeleteAffect from "@/components/DeleteAffect";

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
  } = useForm<TAddLabSchema>({
    resolver: zodResolver(AddLabSchema),
  });

  return (
    <LabLayout title="Fundamental Programming Concept">
      <div className="w-1/2 p-4">
        <div className="w-full">
          <h4 className="text-xl">General</h4>
          <hr className="my-2" />

          <form
            className="flex flex-col gap-2"
            onSubmit={handleSubmit(() => {})}
          >
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
              name="tags"
              render={({ field: { onChange, value } }) => (
                <Multiple
                  datas={[]}
                  title="Tags"
                  value={value}
                  onChange={onChange}
                  isError={errors.tags !== undefined}
                  error={errors.tags?.message}
                  canAddItemNotInList
                />
              )}
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
            Delete Lab
          </Button>
          {isDeleteOpen && (
            <DeleteAffect
              type="lab"
              onClose={() => setIsDeleteOpen(false)}
              onDelete={() => setIsDeleteOpen(false)}
              selected="Test"
            />
          )}
        </div>
      </div>
    </LabLayout>
  );
}

export default Settings;
