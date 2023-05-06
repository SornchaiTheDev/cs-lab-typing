import InsideTaskLayout from "@/Layout/InsideTaskLayout";
import React, { useState } from "react";
import { useRouter } from "next/router";
import Button from "@/components/Common/Button";
import DeleteAffect from "@/components/DeleteAffect";
import { generatePerson } from "@/helpers";
import Forms from "@/components/Forms";
import { AddTaskSchema, TAddTask } from "@/forms/TaskSchema";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Settings({ course }: Props) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const editTask = (formData: TAddTask) => {
    const { isPrivate, language, name, owner, type, note, tags } = formData;
    // TODO add Task
    router.push({
      pathname: router.pathname + "/[taskID]",
      query: { taskID: "1" },
    });
  };

  return (
    <InsideTaskLayout title="Q KEY">
      <div className="w-1/2 p-4">
        <div className="w-full">
          <h4 className="text-xl">General</h4>
          <hr className="my-2" />

          <Forms
            confirmBtn={{
              title: "Edit Task",
              icon: "solar:programming-line-duotone",
              className: "w-1/3 py-2",
            }}
            schema={AddTaskSchema}
            onSubmit={editTask}
            fields={[
              {
                label: "name",
                title: "Name",
                type: "text",
              },
              {
                label: "type",
                title: "Type",
                options: ["Lesson", "Problem", "Typing"],
                type: "select",
                conditional: (data) => data !== undefined && data !== "Typing",
                children: {
                  label: "language",
                  title: "Language",
                  type: "select",
                  options: ["C++", "Python", "Java", "C#", "C"],
                },
              },
              {
                label: "tags",
                title: "Tags",
                type: "multiple-search",
                options: ["C++", "Python", "Java", "C#", "C"],
                optional: true,
                canAddItemNotInList: true,
              },
              {
                label: "owner",
                title: "Owner",
                type: "single-search",
                options: generatePerson(10),
              },
              {
                label: "isPrivate",
                title: "Private",
                type: "checkbox",
              },
              { label: "note", title: "Note", type: "text", optional: true },
            ]}
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
            Delete Course
          </Button>
          {isDeleteOpen && (
            <DeleteAffect
              type="task"
              onClose={() => setIsDeleteOpen(false)}
              onDelete={() => setIsDeleteOpen(false)}
              selected="Q KEY"
            />
          )}
        </div>
      </div>
    </InsideTaskLayout>
  );
}

export default Settings;
