import LabLayout from "~/Layout/LabLayout";
import ModalWithButton from "~/components/Common/ModalWithButton";
import Table from "~/components/Common/Table";
import { Icon } from "@iconify/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";
import { useSession } from "next-auth/react";
import type { Prisma } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import Button from "~/components/Common/Button";
import Link from "next/link";

type LabTask = Prisma.lab_taskGetPayload<{
  select: {
    id: true;
    order: true;
    task: true;
  };
}>;

function Lab() {
  const { data: session } = useSession();
  const [tableData, setTableData] = useState<LabTask[]>([]);

  const columnHelper = createColumnHelper<LabTask>();

  const router = useRouter();

  const { labId } = router.query;

  const isTeacher = session?.user?.roles.split(",").includes("TEACHER");

  const lab = trpc.labs.getLabById.useQuery({
    id: parseInt(labId as string),
  });

  useEffect(() => {
    if (lab.data?.tasks) {
      console.log(lab.data?.tasks)
      setTableData(lab.data?.tasks);
    }
  }, [lab.data?.tasks]);

  const deleteTask = trpc.labs.deleteTaskFromLab.useMutation();
  const deleteSelectRow = useCallback(
    async (id: string) => {
      try {
        await deleteTask.mutateAsync({
          taskId: parseInt(id),
          labId: parseInt(labId as string),
        });
        lab.refetch();
        callToast({
          msg: "Delete Task from Lab successfully",
          type: "success",
        });
      } catch (err) {
        if (err instanceof TRPCClientError) {
          callToast({ msg: err.message, type: "error" });
        }
      }
    },
    [deleteTask, lab, labId]
  );

  const columns = useMemo<ColumnDef<LabTask, string>[]>(
    () => [
      {
        header: "Task",
        accessorKey: "task",
        cell: (props) => {
          return (
            <Link
              href={{
                pathname: "/cms/tasks/[taskId]",
                query: { taskId: props.row.original.task.id },
              }}
            >
              {props.row.original.task.name as string}
            </Link>
          );
        },
      },
      {
        header: "Submission Count",
        accessorKey: "task.submission_count",
      },
      columnHelper.display({
        id: "actions",
        header: "Delete",
        cell: (props) => (
          <button
            onClick={() => deleteSelectRow(props.row.id)}
            className="rounded-xl text-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </button>
        ),
        size: 50,
      }),
    ],
    [columnHelper, deleteSelectRow]
  );

  const [newOrdered, setNewOrdered] = useState<LabTask[]>([]);
  const isOrderChanged = newOrdered.length > 0;
  const saveLabTasks = trpc.labs.updateTaskOrder.useMutation();
  const handleOnSave = async () => {
    try {
      await saveLabTasks.mutateAsync({
        labId: parseInt(labId as string),
        tasks: newOrdered.map(({ id }, index) => ({
          id: id,
          order: index + 1,
        })),
      });
      callToast({ msg: "Update Tasks order successfully", type: "success" });
      setNewOrdered([]);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };

  return (
    <LabLayout title={lab.data?.name as string} isLoading={lab.isLoading}>
      <Table
        data={tableData}
        columns={columns}
        draggabled={isTeacher}
        className="mt-6"
        onDrag={(data) => setNewOrdered(data)}
      >
        {isTeacher && (
          <div className="flex justify-between p-4">
            <ModalWithButton
              title="Add Task"
              icon="solar:programming-line-duotone"
            ></ModalWithButton>
            {isOrderChanged && (
              <Button
                onClick={handleOnSave}
                icon="solar:diskette-line-duotone"
                className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
              >
                Save
              </Button>
            )}
          </div>
        )}
      </Table>
    </LabLayout>
  );
}

export default Lab;
