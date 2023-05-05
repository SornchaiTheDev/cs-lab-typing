import TaskLayout from "@/Layout/TaskLayout";
import Checkbox from "@/components/Common/Checkbox";
import Input from "@/components/Common/Input";
import ModalWithButton from "@/components/Common/ModalWithButton";
import Select from "@/components/Common/Select";
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
  const columnHelper = createColumnHelper<TaskRow>();

  const {
    watch,
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TAddTask>({
    resolver: zodResolver(AddTaskSchema),
  });

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
              onClick: handleSubmit(addTask),
            }}
          >
            <form
              onSubmit={handleSubmit(addTask)}
              className="flex flex-col gap-2"
            >
              <Input
                register={register}
                label="name"
                title="Name"
                isError={!!errors.name}
                error={errors.name?.message}
              />
              <Controller
                control={control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <Select
                    options={["Lesson", "Problem", "Contest", "Typing"]}
                    title="Type"
                    value={value}
                    onChange={onChange}
                    isError={!!errors.type}
                    error={errors.type?.message}
                  />
                )}
              />
              {watch("type") !== undefined && watch("type") !== "Typing" && (
                <Controller
                  control={control}
                  name="language"
                  render={({ field: { onChange, value } }) => (
                    <Select
                      options={["C++", "Python", "Java", "C#", "Typing"]}
                      title="Language"
                      value={value}
                      onChange={onChange}
                      isError={!!errors.language}
                      error={errors.language?.message}
                    />
                  )}
                />
              )}
              <Controller
                control={control}
                name="owner"
                render={({ field: { onChange, value } }) => (
                  <Multiple
                    datas={generatePerson(100)}
                    title="Owner"
                    value={value ?? []}
                    onChange={onChange}
                    isError={!!errors.owner}
                    error={errors.owner?.message}
                  />
                )}
              />
              <Checkbox register={register} label="isPrivate" title="Private" />
              <Controller
                control={control}
                name="tags"
                render={({ field: { onChange, value } }) => (
                  <Multiple
                    datas={generatePerson(100)}
                    title="Tags"
                    value={value ?? []}
                    onChange={onChange}
                    canAddItemNotInList
                    isError={!!errors.tags}
                    error={errors.tags?.message}
                  />
                )}
              />

              <Input register={register} label="note" title="Note" />
            </form>
          </ModalWithButton>
        </div>
      </Table>
    </TaskLayout>
  );
}

export default Tasks;
