import SemesterLayout from "@/Layout/SemesterLayout";
import Table from "@/components/Common/Table";
import { TSemesterSchema, SemesterSchema } from "@/forms/SemesterSchema";
import { Icon } from "@iconify/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Forms from "@/components/Forms";
import DeleteAffect from "@/components/DeleteAffect";
import Modal from "@/components/Common/Modal";
import Button from "@/components/Common/Button";
import { trpc } from "@/helpers/trpc";
import toast from "react-hot-toast";
import Toast from "@/components/Common/Toast";
import dayjs from "dayjs";
import EditSemester from "@/features/Semesters/EditSemester";
import { useDeleteAffectStore } from "@/store";

interface SemesterRow {
  id: string;
  year: string;
  startDate: Date;
}

function Semesters() {
  const columnHelper = createColumnHelper<SemesterRow>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const semesters = trpc.semester.getSemesters.useQuery({ page: 1, limit: 50 });
  const addSemesterMutation = trpc.semester.createSemester.useMutation({
    onSuccess() {
      toast.custom((t) => (
        <Toast {...t} msg="Added users successfully" type="success" />
      ));
      semesters.refetch();
      setIsModalOpen(false);
    },
    onError(err) {
      toast.custom((t) => <Toast {...t} msg={err.message} type="error" />);
    },
  });
  const addSemester = (formData: TSemesterSchema) => {
    const { startDate, term, year } = formData;
    console.log(formData);
    addSemesterMutation.mutate({ startDate, term, year });
    setIsModalOpen(false);
  };

  const columns = useMemo<ColumnDef<SemesterRow, string>[]>(
    () => [
      {
        header: "Year",
        accessorKey: "year",
      },
      {
        header: "Term",
        accessorKey: "term",
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
        cell: (props) => (
          <h4>{dayjs(props.getValue()).format("DD/MM/YYYY")}</h4>
        ),
      },
      columnHelper.display({
        id: "actions",
        header: "Edit",
        size: 50,
        cell: (props) => (
          <button
            onClick={() =>
              setSelectedObj({
                selected: `${props.row.getValue("year")}/${props.row.getValue(
                  "term"
                )}`,
                type: "semester",
              })
            }
            className="text-xl rounded-xl text-sand-12"
          >
            <Icon icon="solar:pen-2-line-duotone" />
          </button>
        ),
      }),
    ],
    [columnHelper, setSelectedObj]
  );

  return (
    <>
      {selectedObj && <EditSemester onClose={() => {}} />}
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
          schema={SemesterSchema}
          onSubmit={addSemester}
          fields={[
            {
              label: "year",
              title: "Year",
              type: "text",
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
          isLoading={semesters.isLoading}
          className="mt-6"
          data={semesters.data ?? []}
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
