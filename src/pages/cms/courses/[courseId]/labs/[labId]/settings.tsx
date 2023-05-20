import LabLayout from "~/Layout/LabLayout";
import React, { useState } from "react";
import { AddLabSchema, TAddLabSchema } from "~/forms/LabSchema";
import Button from "~/components/Common/Button";
import DeleteAffect from "~/components/DeleteAffect";
import Forms from "~/components/Forms";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Settings({ course }: Props) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

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
              { label: "tags", title: "Tags", type: "multiple-search" },
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
            className="shadow bg-red-9 text-sand-1 active:bg-red-11"
          >
            Delete Lab
          </Button>
          {/* <DeleteAffect type="lab" selected="Test" /> */}
        </div>
      </div>
    </LabLayout>
  );
}

export default Settings;
