import SemesterLayout from "@/Layout/SemesterLayout";
import Badge from "@/components/Common/Badge";
import Checkbox from "@/components/Common/Checkbox";
import Input from "@/components/Common/Input";
import ModalWithButton from "@/components/Common/ModalWithButton";
import Multiple from "@/components/Search/Multiple";
import Table from "@/components/Table";
import { TAddSemesterSchema, AddSemesterSchema } from "@/forms/AddSemester";
import { generatePerson } from "@/helpers";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { useRouter } from "next/router";
import Link from "next/link";
import Select from "@/components/Common/Select";
import SinglePicker from "@/components/DatePicker/SinglePicker";
import DeleteAffect from "@/components/DeleteAffect";

interface SemesterRow {
  id: string;
  year: string;
  startDate: Date;
}

function Semesters() {
  const columnHelper = createColumnHelper<SemesterRow>();
  const router = useRouter();
  const {
    control,
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<TAddSemesterSchema>({
    resolver: zodResolver(AddSemesterSchema),
  });
  console.log(errors);
  const addSemester = (formData: TAddSemesterSchema) => {
    const { startDate, term, year } = formData;

    // TODO add semester
  };

  const columns = useMemo<ColumnDef<SemesterRow, string>[]>(
    () => [
      {
        header: "Year",
        accessorKey: "year",
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
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
    <SemesterLayout title="Semesters">
      {/* <DeleteAffect onClose={() => {}} onDelete={() => {}} selected="" type="section"/> */}
      <Table
        className="mt-6"
        data={[
          {
            id: "1",
            year: "2021",
            startDate: new Date("2023-05-04T20:20:00"),
          },
        ]}
        columns={columns}
      >
        <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
          <ModalWithButton
            title="Add Semester"
            icon="solar:calendar-line-duotone"
            className="w-[95%] md:w-[40rem] flex flex-col gap-4"
            confirmBtn={{
              title: "Add Semester",
              icon: "solar:calendar-line-duotone",
              onClick: handleSubmit(addSemester),
            }}
          >
            <form
              onSubmit={handleSubmit(addSemester)}
              className="flex flex-col gap-2"
            >
              <Controller
                control={control}
                name="year"
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onChange={onChange}
                    options={new Array(10)
                      .fill(0)
                      .map((_, i) => new Date().getFullYear() + i + 543)
                      .map((year) => year.toString())}
                    title="Year"
                    error={errors.year?.message}
                    isError={!!errors.year}
                  />
                )}
              />
              <Controller
                control={control}
                name="term"
                render={({ field: { onChange, value } }) => (
                  <Select
                    value={value}
                    onChange={onChange}
                    options={["first", "second", "summer"]}
                    title="Term"
                    error={errors.term?.message}
                    isError={!!errors.term}
                  />
                )}
              />

              <Controller
                control={control}
                name="startDate"
                render={({ field: { onChange, value } }) => (
                  <SinglePicker
                    title="Start Date"
                    value={value}
                    onChange={onChange}
                    error={errors.startDate?.message}
                    isError={!!errors.startDate}
                  />
                )}
              />
            </form>
          </ModalWithButton>
        </div>
      </Table>
    </SemesterLayout>
  );
}

export default Semesters;
