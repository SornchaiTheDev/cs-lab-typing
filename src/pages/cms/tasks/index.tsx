import TaskLayout from "@/Layout/TaskLayout";
import Checkbox from "@/components/Common/Checkbox";
import Input from "@/components/Common/Input";
import ModalWithButton from "@/components/Common/ModalWithButton";
import Select from "@/components/Common/Select";
import Forms from "@/components/Forms";
import Multiple from "@/components/Search/Multiple";
import Table from "@/components/Table";
import { AddTaskSchema, TAddTask } from "@/forms/AddTask";
import { generatePerson } from "@/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import React, { useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

interface TaskRow {
  id: string;
  name: string;
  type: string;
  language: string;
  owner: string;
  submission_count: number;
}

function Tasks() {
  const addTask = (formData: TAddTask) => {
    const { isPrivate, language, name, owner, type, note, tags } = formData;
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
            className="max-w-[40rem]"
            confirmBtn={{
              title: "Add Task",
              icon: "solar:programming-line-duotone",
              onClick: () => {}, //handleSubmit(addTask),
            }}
          >
            <Forms
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
                    options: ["C++", "Python", "Java"],
                  },
                },
                {
                  label: "tags",
                  title: "Tags",
                  type: "multiple",
                  options: ["C++", "Python", "Java"],
                },
                {
                  label: "owner",
                  title: "Owner",
                  type: "multiple",
                  options: generatePerson(10),
                },
                {
                  label: "isPrivate",
                  title: "Private",
                  type: "checkbox",
                },
                { label: "note", title: "Note", type: "text" },
              ]}
            />
          </ModalWithButton>
        </div>
      </Table>
    </TaskLayout>
  );
}

export default Tasks;
