import TaskLayout from "~/Layout/TaskLayout";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Table from "~/components/Common/Table";
import { AddTaskSchema, type TAddTask } from "~/forms/TaskSchema";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { trpc } from "~/helpers";
import type { tags, users } from "@prisma/client";
import { useDeleteAffectStore } from "~/store";
import { Icon } from "@iconify/react";
import DeleteAffect from "~/components/DeleteAffect";
import Button from "~/components/Common/Button";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

interface TaskRow {
  id: number;
  name: string;
  type: string;
  tags: string[];
  language: string;
  owner: string;
  submission_count: number;
}

function Tasks() {
  const { data: session } = useSession();
  const router = useRouter();
  const selectedObj = useDeleteAffectStore((state) => state.selectedObj);

  const [isShow, setIsShow] = useState(false);

  const allTasks = trpc.tasks.getTask.useQuery({ page: 1, limit: 50 });

  const addTaskMutation = trpc.tasks.addTask.useMutation();
  const addTask = async (formData: TAddTask) => {
    try {
      const task = await addTaskMutation.mutateAsync(formData);
      await allTasks.refetch();
      setIsShow(false);
      await router.push({
        pathname: router.pathname + "/[taskId]",
        query: { ...router.query, taskId: task?.id },
      });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  const ownerUser = trpc.users.getAllUsersInRole.useQuery({
    roles: ["ADMIN", "TEACHER"],
  });

  const tags = trpc.tags.getTags.useQuery();

  const columns = useMemo<ColumnDef<TaskRow, string | tags[] | users>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (props) => {
          return (
            <Link
              href={{
                pathname: router.pathname + "/[taskId]",
                query: { ...router.query, taskId: props.row.original.id },
              }}
            >
              {props.getValue() as string}
            </Link>
          );
        },
      },
      {
        header: "Type",
        accessorKey: "type",
      },
      {
        header: "Tags",
        accessorKey: "tags",
        cell: (props) => {
          const tags = props.getValue() as tags[];
          const isEmpty = tags.length === 0;
          return isEmpty ? "-" : tags.map(({ name }) => name).join(",");
        },
      },
      {
        header: "Language",
        accessorKey: "language",
        cell: (props) => {
          const language = props.getValue() as string;
          return language === null ? "-" : language;
        },
      },
      {
        header: "Submission Count",
        accessorKey: "submission_count",
      },
      {
        header: "Owner",
        accessorKey: "owner",
        cell: (props) => {
          const owner = props.getValue() as users;
          return owner.full_name;
        },
      },
      // columnHelper.display({
      //   id: "actions",
      //   header: "Delete",
      //   cell: (props) => (
      //     <button
      //       onClick={() => {
      //         setSelectedObj({
      //           selected: {
      //             display: props.row.original.name,
      //             id: props.row.original.id,
      //           },
      //           type: "lab",
      //         });
      //       }}
      //       className="text-xl rounded-xl text-sand-12"
      //     >
      //       <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
      //     </button>
      //   ),
      //   size: 50,
      // }),
    ],
    [router.pathname, router.query]
  );

  const isTeacher = session?.user?.roles.includes("TEACHER");

  return (
    <>
      {selectedObj && <DeleteAffect type="task-outside" />}
      <Modal
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        title="Add Lab"
        className="flex flex-col gap-4 md:w-[40rem]"
      >
        <Forms
          confirmBtn={{
            title: "Add Task",
            icon: "solar:programming-line-duotone",
          }}
          schema={AddTaskSchema}
          onSubmit={addTask}
          fields={[
            {
              label: "name",
              title: "Name",
              type: "text",
            },
            {
              label: "type",
              title: "Type",
              options: ["Lesson", "Problem", "Typing"],
              type: "select",
              conditional: (data) => data !== undefined && data !== "Typing",
              children: {
                label: "language",
                title: "Language",
                type: "select",
                options: ["C++", "Python", "Java", "C#", "C"],
              },
            },
            {
              label: "tags",
              title: "Tags",
              type: "multiple-search",
              options: tags.data?.map(({ name }) => name) ?? [],
              optional: true,
              canAddItemNotInList: true,
              value: [],
            },
            {
              label: "owner",
              title: "Owner",
              type: "single-search",
              options: ownerUser.data?.map(({ full_name }) => full_name) ?? [],
              value: session?.user?.full_name as string,
            },
            {
              label: "isPrivate",
              title: "Private",
              type: "checkbox",
              value: false,
            },
            {
              label: "note",
              title: "Note",
              type: "text",
              optional: true,
            },
          ]}
        />
      </Modal>
      <TaskLayout title="Tasks">
        <Table
          data={allTasks.data ?? []}
          columns={columns}
          className="flex-1 mt-6"
        >
          {isTeacher && (
            <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
              <Button
                onClick={() => setIsShow(true)}
                icon="solar:programming-line-duotone"
                className="shadow bg-sand-12 text-sand-1 active:bg-sand-11"
              >
                Add Task
              </Button>
            </div>
          )}
        </Table>
      </TaskLayout>
    </>
  );
}

export default Tasks;
