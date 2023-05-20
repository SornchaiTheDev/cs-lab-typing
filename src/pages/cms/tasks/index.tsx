import TaskLayout from "~/Layout/TaskLayout";
import ModalWithButton from "~/components/Common/ModalWithButton";
import Forms from "~/components/Forms";
import Table from "~/components/Common/Table";
import { AddTaskSchema, TAddTask } from "~/forms/TaskSchema";
import { generatePerson } from "~/helpers";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";
import { useRouter } from "next/router";

interface TaskRow {
  id: string;
  name: string;
  type: string;
  tags: string[];
  language: string;
  owner: string;
  submission_count: number;
}

function Tasks() {
  const router = useRouter();
  const addTask = (formData: TAddTask) => {
    const { isPrivate, language, name, owner, type, note, tags } = formData;
    // TODO add Task
    router.push({
      pathname: router.pathname + "/[taskID]",
      query: { taskID: "1" },
    });
  };

  const columns = useMemo<ColumnDef<TaskRow, string>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Type",
        accessorKey: "type",
      },
      {
        header: "Tags",
        accessorKey: "tags",
      },
      {
        header: "Language",
        accessorKey: "language",
      },
      {
        header: "Submission Count",
        accessorKey: "submission_count",
      },
      {
        header: "Owner",
        accessorKey: "owner",
      },
    ],
    []
  );

  return (
    <TaskLayout title="Tasks">
      <Table
        data={[
          {
            id: "1",
            name: "สร้างรถยนต์ไร้คนขับ",
            tags: ["C++", "CS113"],
            type: "Problem",
            language: "C++",
            owner: "SornchaiTheDev",
            submission_count: 10,
          },
        ]}
        columns={columns}
        className="flex-1 mt-6"
      >
        <div className="p-4">
          <ModalWithButton
            title="Add Task"
            icon="solar:programming-line-duotone"
            className="w-[90%] md:w-[36rem] max-w-[40rem]"
          >
            <Forms
              confirmBtn={{
                title: "Add Task",
                icon: "solar:programming-line-duotone",
              }}
              schema={AddTaskSchema}
              onSubmit={addTask}
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
                  conditional: (data) =>
                    data !== undefined && data !== "Typing",
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
          </ModalWithButton>
        </div>
      </Table>
    </TaskLayout>
  );
}

export default Tasks;
