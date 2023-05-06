import SemesterLayout from "@/Layout/SemesterLayout";
import Table from "@/components/Common/Table";
import { TAddSemesterSchema, AddSemesterSchema } from "@/forms/SemesterSchema";
import { Icon } from "@iconify/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Forms from "@/components/Forms";
import DeleteAffect from "@/components/DeleteAffect";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";

interface SemesterRow {
  id: string;
  year: string;
  startDate: Date;
}

function Semesters() {
  const columnHelper = createColumnHelper<SemesterRow>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const addSemester = (formData: TAddSemesterSchema) => {
    const { startDate, term, year } = formData;
    setIsModalOpen(false);
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
            onClick={() => setSelected(props.row.getValue("year"))}
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
    <>
      <DeleteAffect
        selected={selected!}
        type="section"
        isOpen={selected !== null}
        onClose={() => setSelected(null)}
      />

      <Modal
        title="Add Semester"
        isOpen={isModalOpen}
        className="w-[95%] md:w-[40rem] flex flex-col gap-4"
        onClose={() => setIsModalOpen(false)}
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
              options: ["2023", "2024"],
            },
            {
              label: "term",
              title: "Term",
              type: "select",
              options: ["First", "Second", "Summer"],
            },
            {
              label: "startDate",
              title: "Start Date",
              type: "date",
            },
          ]}
        />
      </Modal>
      <SemesterLayout title="Semesters">
        <Table
          className="mt-6"
          data={[
            {
              id: "1",
              year: "2021/F",
              startDate: new Date("2023-05-04T20:20:00"),
            },
            {
              id: "1",
              year: "2021/S",
              startDate: new Date("2023-05-04T20:20:00"),
            },
            {
              id: "1",
              year: "2021/SM",
              startDate: new Date("2023-05-04T20:20:00"),
            },
          ]}
          columns={columns}
        >
          <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
            <Button
              onClick={() => setIsModalOpen(true)}
              icon="solar:calendar-line-duotone"
              className="shadow text-sand-1 active:bg-sand-11 bg-sand-12"
            >
              Add Semester
            </Button>
          </div>
        </Table>
      </SemesterLayout>
    </>
  );
}

export default Semesters;
