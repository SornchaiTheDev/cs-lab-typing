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
import Link from "next/link";
import Forms from "@/components/Forms";

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
        cell: (props) => (
          <Link
            href={{
              pathname: router.pathname + "/[labId]",
              query: { ...router.query, labId: 1 },
            }}
          >
            {props.getValue()}
          </Link>
        ),
        size: 100,
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
        header: "Delete",
        cell: (props) => (
          <button
            onClick={() => {} /*setSelected(props.row.getValue("username"))*/}
            className="text-xl rounded-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </button>
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
            tags: ["python", "cs112"],
          },
          {
            id: 2,
            name: "C 113 Lab 1",
            tags: ["python", "cs112"],
          },
          {
            id: 3,
            name: "C 113 Lab 1",
            tags: ["python"],
          },
          {
            id: 4,
            name: "C 113 Lab 1",
            tags: ["python"],
          },
          {
            id: 5,
            name: "C 113 Lab 1",
            tags: ["python"],
          },
          {
            id: 6,
            name: "C 113 Lab 1",
            tags: ["python"],
          },
          {
            id: 7,
            name: "C 113 Lab 1",
            tags: ["python"],
          },
          {
            id: 8,
            name: "C 113 Lab 1",
            tags: ["python"],
          },
        ]}
        columns={columns}
      >
        <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
          <ModalWithButton
            title="Add Lab"
            icon="solar:checklist-minimalistic-line-duotone"
            className="w-[95%] md:w-[40rem] flex flex-col gap-4"
          >
            <Forms
              schema={AddLabSchema}
              onSubmit={addLab}
              confirmBtn={{
                title: `Add Lab`,
                icon: "solar:checklist-minimalistic-line-duotone",
              }}
              fields={[
                {
                  label: "name",
                  title: "Name",
                  type: "text",
                },
                {
                  label: "tags",
                  title: "Tags",
                  type: "multiple",
                },
                {
                  label: "isDisabled",
                  title: "Disabled",
                  type: "checkbox",
                },
              ]}
            />
          </ModalWithButton>
        </div>
      </Table>
    </CourseLayout>
  );
}

export default Labs;
