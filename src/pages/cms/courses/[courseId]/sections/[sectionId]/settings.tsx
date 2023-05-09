import Button from "@/components/Common/Button";
import DeleteAffect from "@/components/DeleteAffect";
import SectionLayout from "@/Layout/SectionLayout";
import { AddSectionSchema, TAddSection } from "@/forms/SectionSchema";
import { generatePerson } from "@/helpers";
import Forms from "@/components/Forms";
import { useState } from "react";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Settings({ course }: Props) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const editSection = (formData: TAddSection) => {
    const { name, note } = formData;
  };

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
                type: "multiple-search",
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
            className="shadow bg-red-9 text-sand-1 active:bg-red-11"
          >
            Delete Section
          </Button>
          {/* <DeleteAffect type="section" selected="12 (F 15 - 17)" /> */}
        </div>
      </div>
    </SectionLayout>
  );
}

export default Settings;
