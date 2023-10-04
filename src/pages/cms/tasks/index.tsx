import TaskLayout from "~/Layout/TaskLayout";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Table from "~/components/Common/Table";
import { AddTaskSchema, type TAddTask } from "~/schemas/TaskSchema";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { convertToCompact, trpc } from "~/helpers";
import type { tags, users } from "@prisma/client";
import Button from "~/components/Common/Button";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import Link from "next/link";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import type { SearchValue } from "~/types";
import { debounce } from "lodash";

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

  const [isShow, setIsShow] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const { pageIndex, pageSize } = pagination;

  const [searchString, setSearchString] = useState("");

  const handleOnSearchChange = (value: string) => {
    setSearchString(value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const fetchTask = useMemo(
    () => debounce(() => allTasks.refetch(), 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchTask();
  }, [searchString, fetchTask, pagination]);

  const allTasks = trpc.tasks.getTaskPagination.useQuery(
    {
      page: pageIndex,
      limit: pageSize,
      search: searchString,
    },
    { enabled: false }
  );

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
              className="font-bold"
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
          if (props.getValue() === undefined) return null;
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
        cell: (props) => {
          return convertToCompact(props.getValue() as string);
        },
      },
      {
        header: "Owner",
        accessorKey: "owner",
        cell: (props) => {
          if (props.getValue() === undefined) return null;

          const owner = props.getValue() as users;
          return owner.full_name;
        },
      },
    ],
    [router.pathname, router.query]
  );

  const isTeacher = session?.user?.roles.includes("TEACHER");

  return (
    <>
      <Modal
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        title="Add Task"
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
              options:
                tags.data?.map(({ name }) => ({ label: name, value: name })) ??
                [],
              optional: true,
              canAddItemNotInList: true,
              value: [],
            },
            {
              label: "owner",
              title: "Owner",
              type: "single-search",
              options:
                ownerUser.data?.map(({ full_name, student_id }) => ({
                  label: full_name,
                  value: student_id,
                })) ?? [],
              value: {
                label: session?.user?.full_name,
                value: session?.user?.student_id,
              } as SearchValue,
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
          isLoading={allTasks.isLoading}
          data={allTasks.data?.tasks ?? []}
          columns={columns}
          className="mt-6 flex-1"
          pageCount={allTasks.data?.pageCount ?? 0}
          onPaginationChange={setPagination}
          {...{ pagination, searchString }}
          onSearchChange={handleOnSearchChange}
        >
          {isTeacher && (
            <Button
              onClick={() => setIsShow(true)}
              icon="solar:programming-line-duotone"
              className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
            >
              Add Task
            </Button>
          )}
        </Table>
      </TaskLayout>
    </>
  );
}

export default Tasks;
