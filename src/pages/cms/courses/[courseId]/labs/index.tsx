import CourseLayout from "@/Layout/CourseLayout";
import Badge from "@/components/Common/Badge";
import Checkbox from "@/components/Common/Checkbox";
import Input from "@/components/Common/Input";
import ModalWithButton from "@/components/Common/ModalWithButton";
import Multiple from "@/components/Search/Multiple";
import Table from "@/components/Table";
import { AddLabSchema, TAddLabSchema } from "@/forms/AddLab";
import { generatePerson } from "@/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";

interface LabsRow {
  id: string;
  name: string;
  tags: string[];
}

function Labs() {
  const columnHelper = createColumnHelper<LabsRow>();
  const router = useRouter();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TAddLabSchema>({
    resolver: zodResolver(AddLabSchema),
  });

  const addLab = (formData: TAddLabSchema) => {
    const { isDisabled, name, tags } = formData;
    router.push({
      pathname: router.pathname + "/[labId]",
      query: { ...router.query, labId: 1 },
    });

    // TODO add lab
  };

  const columns = useMemo<ColumnDef<LabsRow, string[]>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Tags",
        accessorKey: "tags",
        cell: (props) => (
          <div className="flex flex-wrap justify-center gap-2">
            {props.getValue().map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
        ),
        size: 60,
      },
      columnHelper.display({
        id: "actions",
        header: "Edit/Delete",
        cell: (props) => (
          <div className="flex justify-center w-full gap-3">
            <button
              onClick={() => {} /*setSelected(props.row.getValue("username"))*/}
              className="text-xl rounded-xl text-sand-12"
            >
              <Icon icon="solar:pen-2-line-duotone" />
            </button>
            <button
              onClick={() => {} /*setSelected(props.row.getValue("username"))*/}
              className="text-xl rounded-xl text-sand-12"
            >
              <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
            </button>
          </div>
        ),
        size: 50,
      }),
    ],
    [columnHelper]
  );

  return (
    <CourseLayout title="Fundamental Programming Concept">
      <Table
        className="mt-6"
        data={[
          {
            id: 1,
            name: "C 113 Lab 1",
            tags: ["python", "cs112", "test", "hi", "hehe", "haha", "hoho"],
          },
          {
            id: 2,
            name: "C 113 Lab 1",
            tags: ["python", "cs112", "test", "hi", "hehe", "haha", "hoho"],
          },
          {
            id: 3,
            name: "C 113 Lab 1",
            tags: ["python", "cs112", "test", "hi", "hehe", "haha", "hoho"],
          },
          {
            id: 4,
            name: "C 113 Lab 1",
            tags: ["python", "cs112", "test", "hi", "hehe", "haha", "hoho"],
          },
          {
            id: 5,
            name: "C 113 Lab 1",
            tags: ["python", "cs112", "test", "hi", "hehe", "haha", "hoho"],
          },
          {
            id: 6,
            name: "C 113 Lab 1",
            tags: ["python", "cs112", "test", "hi", "hehe", "haha", "hoho"],
          },
          {
            id: 7,
            name: "C 113 Lab 1",
            tags: ["python", "cs112", "test", "hi", "hehe", "haha", "hoho"],
          },
          {
            id: 8,
            name: "C 113 Lab 1",
            tags: ["python", "cs112", "test", "hi", "hehe", "haha", "hoho"],
          },
        ]}
        columns={columns}
      >
        <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
          <ModalWithButton
            title="Add Lab"
            icon="solar:checklist-minimalistic-line-duotone"
            className="w-[95%] md:w-[40rem] flex flex-col gap-4"
            confirmBtn={{
              title: `Add Lab`,
              icon: "solar:checklist-minimalistic-line-duotone",
              onClick: handleSubmit(addLab),
            }}
          >
            <form
              onSubmit={handleSubmit(addLab)}
              className="flex flex-col gap-2"
            >
              <Input
                register={register}
                label="name"
                title="Name"
                isError={errors.name != undefined}
                error={errors.name?.message}
              />
              <Controller
                control={control}
                name="tags"
                render={({ field: { onChange, value } }) => (
                  <Multiple
                    datas={generatePerson(100)}
                    title="Tags"
                    value={value}
                    onChange={onChange}
                    canAddItemNotInList
                  />
                )}
              />
              <Checkbox
                register={register}
                label="isDisabled"
                title="Disabled"
              />
            </form>
          </ModalWithButton>
        </div>
      </Table>
    </CourseLayout>
  );
}

export default Labs;
