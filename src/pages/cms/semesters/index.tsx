import SemesterLayout from "@/Layout/SemesterLayout";
import ModalWithButton from "@/components/Common/ModalWithButton";
import Table from "@/components/Table";
import { TAddSemesterSchema, AddSemesterSchema } from "@/forms/AddSemester";
import { Icon } from "@iconify/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo } from "react";
import Forms from "@/components/Forms";

interface SemesterRow {
  id: string;
  year: string;
  startDate: Date;
}

function Semesters() {
  const columnHelper = createColumnHelper<SemesterRow>();

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
          >
            <Forms
              confirmBtn={{
                title: "Add Semester",
                icon: "solar:calendar-line-duotone",
              }}
              schema={AddSemesterSchema}
              onSubmit={addSemester}
              fields={[
                {
                  label: "year",
                  title: "Year",
                  type: "select",
                },
                {
                  label: "term",
                  title: "Term",
                  type: "select",
                },
                {
                  label: "startDate",
                  title: "Start Date",
                  type: "date",
                },
              ]}
            />
          </ModalWithButton>
        </div>
      </Table>
    </SemesterLayout>
  );
}

export default Semesters;
