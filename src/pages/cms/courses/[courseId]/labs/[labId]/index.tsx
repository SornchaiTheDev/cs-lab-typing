import LabLayout from "~/Layout/LabLayout";
import ModalWithButton from "~/components/Common/ModalWithButton";
import Table from "~/components/Common/Table";
import { Icon } from "@iconify/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React, { useMemo } from "react";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";
import { useSession } from "next-auth/react";

interface AssignmentRow {
  id: string;
  number: string;
  task: string;
  submission_count: number;
}

function Lab() {
  const { data: session } = useSession();

  const columnHelper = createColumnHelper<AssignmentRow>();

  const router = useRouter();

  const { labId } = router.query;

  const isTeacher = session?.user?.roles.split(",").includes("TEACHER");

  const lab = trpc.labs.getLabById.useQuery({
    id: parseInt(labId as string),
  });

  const columns = useMemo<ColumnDef<AssignmentRow, string[]>[]>(
    () => [
      {
        header: "Number",
        accessorKey: "number",
      },
      {
        header: "Task",
        accessorKey: "task",
      },
      {
        header: "Submission Count",
        accessorKey: "submission_count",
      },
      columnHelper.display({
        id: "actions",
        header: "Edit/Delete",
        cell: (props) => (
          <div className="flex w-full justify-center gap-3">
            <button
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={() => {} /*setSelected(props.row.getValue("username"))*/}
              className="rounded-xl text-xl text-sand-12"
            >
              <Icon icon="solar:pen-2-line-duotone" />
            </button>
            <button
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              onClick={() => {} /*setSelected(props.row.getValue("username"))*/}
              className="rounded-xl text-xl text-sand-12"
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
    <LabLayout title={lab.data?.name as string} isLoading={lab.isLoading}>
      <Table
        data={[
          {
            id: "1",
            number: "01",
            task: "Task 1",
            submission_count: 10,
          },
        ]}
        columns={columns}
        className="mt-6"
      >
        {isTeacher && (
          <div className="p-4">
            <ModalWithButton
              title="Add Task"
              icon="solar:programming-line-duotone"
            ></ModalWithButton>
          </div>
        )}
      </Table>
    </LabLayout>
  );
}

export default Lab;
