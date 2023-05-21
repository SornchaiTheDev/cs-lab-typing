import SemesterLayout from "~/Layout/SemesterLayout";
import Table from "~/components/Common/Table";
import { type TSemesterSchema, SemesterSchema } from "~/forms/SemesterSchema";
import { Icon } from "@iconify/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import Forms from "~/components/Forms";
import Modal from "~/components/Common/Modal";
import Button from "~/components/Common/Button";
import { trpc } from "~/helpers";
import dayjs from "dayjs";
import EditSemester from "~/features/Semesters/EditSemester";
import { useDeleteAffectStore } from "~/store";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";

interface SemesterRow {
  id: string;
  year: string;
  startDate: Date;
}

interface cellProps {
  row: {
    getValue: (title: string) => string | number;
  };
}

function Semesters() {
  const columnHelper = createColumnHelper<SemesterRow>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const semesters = trpc.semesters.getSemesters.useQuery({
    page: 1,
    limit: 50,
  });
  const addSemesterMutation = trpc.semesters.createSemester.useMutation();

  const addSemester = async (formData: TSemesterSchema) => {
    const { startDate, term, year } = formData;
    try {
      await addSemesterMutation.mutateAsync({ startDate, term, year });
      callToast({
        msg: "Added users successfully",
        type: "success",
      });
      await semesters.refetch();
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errorMsg = err.message;
        callToast({
          msg: errorMsg,
          type: "error",
        });
      }
    }
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
        cell: (props: cellProps) => (
          <button
            onClick={() =>
              setSelectedObj({
                selected: `${props.row.getValue("year")}/${props.row.getValue(
                  "term"
                )}`,
                type: "semester",
              })
            }
            className="rounded-xl text-xl text-sand-12"
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
      {selectedObj && <EditSemester />}
      <Modal
        title="Add Semester"
        isOpen={isModalOpen}
        className="flex w-[95%] flex-col gap-4 md:w-[40rem]"
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
              className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
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
