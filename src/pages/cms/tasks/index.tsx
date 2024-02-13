import TaskLayout from "~/layouts/TaskLayout";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Table from "~/components/Common/Table";
import { AddTaskSchema, type TAddTask } from "~/schemas/TaskSchema";
import type { PaginationState } from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import { trpc } from "~/utils";
import Button from "~/components/Common/Button";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { debounce } from "lodash";
import { taskPaginationColumns } from "~/columns/taskPagination";
import useGetAddTaskFields from "~/hooks/useGetAddTaskFields";

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

  const isTeacher = session?.user?.roles.includes("TEACHER");

  const addTaskFields = useGetAddTaskFields(isShow);

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
          fields={addTaskFields}
        />
      </Modal>
      <TaskLayout title="Tasks">
        <Table
          isLoading={allTasks.isLoading}
          data={allTasks.data?.tasks ?? []}
          columns={taskPaginationColumns(router)}
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
