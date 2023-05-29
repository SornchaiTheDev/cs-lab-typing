import LabLayout from "~/Layout/LabLayout";
import Table from "~/components/Common/Table";
import { Icon } from "@iconify/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";
import { useSession } from "next-auth/react";
import type { Prisma } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import Button from "~/components/Common/Button";
import Link from "next/link";
import Modal from "~/components/Common/Modal";
import Input from "~/components/Forms/Input";
import Badge from "~/components/Common/Badge";
import Forms from "~/components/Forms";
import { AddLabSchema } from "~/forms/LabSchema";

interface AddTaskModalProps {
  isShow: boolean;
  onClose: () => void;
  labId: number;
}

interface task {
  id: number;
  name: string;
  submission_count: number;
}

const AddTaskModal = ({ isShow, onClose, labId }: AddTaskModalProps) => {
  const [search, setSearch] = useState("");

  const tasks = trpc.tasks.searchTasks.useQuery({
    page: 1,
    query: search,
    limit: 10,
  });

  const columns = useMemo<ColumnDef<task, string>[]>(
    () => [
      {
        header: "Task",
        accessorKey: "task",
        cell: (props) => {
          return (
            <Link
              href={{
                pathname: "/cms/tasks/[taskId]",
                query: { taskId: props.row.original.id },
              }}
            >
              {props.row.original.name as string}
            </Link>
          );
        },
      },
      {
        header: "Submission Count",
        accessorKey: "submission_count",
      },
    ],
    []
  );

  return (
    <Modal
      isOpen={isShow}
      onClose={onClose}
      title="Add Task"
      className="flex max-h-[70%] flex-col gap-4 overflow-y-auto md:w-[40rem]"
    >
      <input />
      <Table data={tasks.data ?? []} columns={columns} className="mt-6" />
    </Modal>
  );
};

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
      console.log(lab.data?.tasks);
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

  const adminColumns = useMemo<ColumnDef<LabTask, string>[]>(
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
    ],
    []
  );

  const teacherColumns = useMemo(
    () =>
      adminColumns.concat([
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
      ]),
    [adminColumns, columnHelper, deleteSelectRow]
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

  const [isShow, setIsShow] = useState(false);
  return (
    <>
      <AddTaskModal
        isShow={isShow}
        onClose={() => setIsShow(false)}
        labId={parseInt(labId as string)}
      />
      <LabLayout title={lab.data?.name as string} isLoading={lab.isLoading}>
        <Table
          data={tableData}
          columns={isTeacher ? teacherColumns : adminColumns}
          draggabled={isTeacher}
          className="mt-6"
          onDrag={(data) => setNewOrdered(data)}
        >
          {isTeacher && (
            <div className="flex justify-between p-4">
              <Button
                onClick={() => setIsShow(true)}
                icon="solar:checklist-minimalistic-line-duotone"
                className="bg-sand-12  text-sand-1 shadow active:bg-sand-11"
              >
                Add Task
              </Button>
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
    </>
  );
}

export default Lab;
