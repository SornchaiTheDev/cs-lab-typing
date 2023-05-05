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
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddLabSchema>({
    resolver: zodResolver(AddLabSchema),
  });

  const editLab = (formData: TAddLabSchema) => {
    const { name, isDisabled, tags } = formData;
  };

  return (
    <LabLayout title="Fundamental Programming Concept">
      <div className="w-1/2 p-4">
        <div className="w-full">
          <h4 className="text-xl">General</h4>
          <hr className="my-2" />

          <Forms
            schema={AddLabSchema}
            onSubmit={editLab}
            fields={[
              {
                label: "name",
                title: "Name",
                type: "text",
              },
              { label: "tags", title: "Tags", type: "multiple" },
              {
                label: "isDisabled",
                title: "Disabled",
                type: "checkbox",
              },
            ]}
            confirmBtn={{
              title: "Edit Lab",
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
