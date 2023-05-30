import LabLayout from "~/Layout/LabLayout";
import Table from "~/components/Common/Table";
import { Icon } from "@iconify/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { convertToThousand, trpc } from "~/helpers";
import { useSession } from "next-auth/react";
import type { tasks } from "@prisma/client";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import Button from "~/components/Common/Button";
import Link from "next/link";
import Modal from "~/components/Common/Modal";
import Multiple from "~/components/Forms/Search/MultipleSearch";
import clsx from "clsx";
import Skeleton from "~/components/Common/Skeleton";

interface AddTaskModalProps {
  isShow: boolean;
  onClose: () => void;
  labId: number;
}

type TaskType = "Lesson" | "Problem" | "Typing";

const AddTaskModal = ({ isShow, onClose, labId }: AddTaskModalProps) => {
  const tags = trpc.tags.getTags.useQuery();
  const [search, setSearch] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<TaskType[]>([]);

  const ctx = trpc.useContext();

  const tasks = trpc.tasks.searchTasks.useQuery(
    {
      query: search,
      tags: selectedTags,
      types: selectedTypes,
      limit: 20,
    },
    { enabled: false, keepPreviousData: true }
  );

  useEffect(() => {
    tasks.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnSearch = async () => {
    try {
      await tasks.refetch();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({
          msg: err.message,
          type: "error",
        });
      }
    }
  };

  const addTask = trpc.labs.addTask.useMutation();
  const addTaskToLab = async (taskId: number) => {
    try {
      await addTask.mutateAsync({ labId, taskId });
      tasks.refetch();
      await ctx.labs.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({
          msg: err.message,
          type: "error",
        });
      }
    }
  };

  const removeTask = trpc.labs.removeTask.useMutation();
  const removeTaskFromLab = async (taskId: number) => {
    try {
      await removeTask.mutateAsync({ labId, taskId });
      tasks.refetch();
      await ctx.labs.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({
          msg: err.message,
          type: "error",
        });
      }
    }
  };

  const handleOnClickAdd = ({
    taskId,
    isAdded,
  }: {
    taskId: number;
    isAdded: boolean;
  }) => {
    if (!isAdded) {
      return addTaskToLab(taskId);
    }
    removeTaskFromLab(taskId);
  };

  return (
    <Modal
      isOpen={isShow}
      onClose={onClose}
      title="Add Task"
      className="flex h-[90%] max-h-[90%] flex-col gap-2 overflow-y-auto"
    >
      <h6 className="font-semibold">Task Name</h6>
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="h-fit w-full rounded-md border border-sand-6 bg-sand-1 p-2 outline-none"
        placeholder="eg. Typing01"
      />
      <div className="flex gap-4">
        <Multiple
          datas={tags.data?.map((tag) => tag.name) ?? []}
          onChange={setSelectedTags}
          title="Tags"
          value={selectedTags}
          className="flex-1"
        />
        <Multiple
          datas={["Lesson", "Problem", "Typing"]}
          onChange={(value) => setSelectedTypes(value as TaskType[])}
          title="Type"
          value={selectedTypes}
          className="flex-1"
        />
      </div>

      <Button
        onClick={handleOnSearch}
        icon="solar:magnifer-line-duotone"
        className="mt-2 w-fit bg-sand-12 text-sand-1 shadow active:bg-sand-11"
      >
        Search
      </Button>
      <hr className="my-2" />
      <div className="grid flex-1 grid-cols-12 gap-4 overflow-y-auto px-2 py-4">
        {tasks.isLoading
          ? new Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={"12rem"}
                  className="col-span-12 md:col-span-4"
                />
              ))
          : tasks.data?.map(
              ({ id, name, tags, submission_count, note, labs }) => {
                const isAdded = labs.some((lab) => lab.id === labId);
                return (
                  <div
                    key={id}
                    className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-4"
                  >
                    <button
                      onClick={() => handleOnClickAdd({ taskId: id, isAdded })}
                      className={clsx(
                        "absolute right-2 top-2 flex w-fit items-center gap-2 rounded-xl p-2",
                        isAdded
                          ? "bg-lime-9 text-sand-1 hover:bg-lime-10"
                          : "bg-sand-7 text-sand-12 hover:bg-sand-8"
                      )}
                    >
                      {isAdded ? (
                        <Icon icon="tabler:check" />
                      ) : (
                        <Icon icon="tabler:plus" />
                      )}
                    </button>
                    <div className="flex flex-col gap-2 p-2">
                      <div className="flex gap-2">
                        {tags.map(({ name }) => (
                          <div
                            key={name}
                            className="w-fit rounded-lg bg-lime-9 px-2 text-white"
                          >
                            {name}
                          </div>
                        ))}
                      </div>
                      <div>
                        <h4 className="text-xl font-medium text-sand-12">
                          {name}
                        </h4>
                        <h6 className="text-sm">
                          Submissions : {convertToThousand(submission_count)}
                        </h6>
                        <h6>{note}</h6>
                      </div>
                    </div>
                  </div>
                );
              }
            )}
      </div>
    </Modal>
  );
};

function Lab() {
  const { data: session } = useSession();
  const [tableData, setTableData] = useState<tasks[]>([]);

  const columnHelper = createColumnHelper<tasks>();

  const router = useRouter();

  const { labId } = router.query;

  const isTeacher = session?.user?.roles.split(",").includes("TEACHER");

  const lab = trpc.labs.getLabById.useQuery({
    id: parseInt(labId as string),
  });

  useEffect(() => {
    if (lab.data?.tasks) {
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
        await lab.refetch();
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

  const adminColumns = useMemo<ColumnDef<tasks, string>[]>(
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

  const [newOrdered, setNewOrdered] = useState<tasks[]>([]);
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
      {isShow && (
        <AddTaskModal
          isShow={isShow}
          onClose={() => setIsShow(false)}
          labId={parseInt(labId as string)}
        />
      )}
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
