import InsideTaskLayout from "~/layouts/InsideTaskLayout";
import { useRouter } from "next/router";
import Button from "~/components/Common/Button";
import DeleteAffect from "~/components/DeleteAffect";
import Forms from "~/components/Forms";
import { AddTaskSchema, type TAddTask } from "~/schemas/TaskSchema";
import { trpc } from "~/utils";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import { useDeleteAffectStore } from "~/store";
import { useSession } from "next-auth/react";
import type { SearchValue } from "~/types";
import useGetUserByName from "~/hooks/useGetUserByName";
import useGetTagByName from "~/hooks/useGetTags";

function Settings() {
  const { data: session } = useSession();
  const router = useRouter();
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const { taskId } = router.query;
  const task = trpc.tasks.getTaskById.useQuery(
    { id: taskId as string },
    {
      enabled: !!taskId,
    }
  );
  const editTaskMutation = trpc.tasks.updateTask.useMutation();

  // const isTeacher = session?.user?.roles.includes("TEACHER");
  const isAdmin = session?.user?.roles.includes("ADMIN") ?? false;
  const isOwner = task.data?.owner.full_name === session?.user?.full_name;
  const isTeacher = session?.user?.roles.includes("TEACHER") ?? false;
  const isNotStudent = isAdmin || isTeacher || isOwner;
  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  const queryUsers = useGetUserByName();
  const queryTags = useGetTagByName();

  const editTask = async (formData: TAddTask) => {
    try {
      await editTaskMutation.mutateAsync({
        ...formData,
        id: taskId as string,
      });
      await task.refetch();
      callToast({ msg: "Updated task successfully", type: "success" });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  const handleDelete = () => {
    if (!canDelete) {
      return void callToast({
        msg: "You cannot delete other user task!",
        type: "error",
      });
    }
    setSelectedObj({
      selected: {
        display: task.data?.name as string,
        id: task.data?.id as number,
      },
      type: "task",
    });
  };

  return (
    <>
      {selectedObj && <DeleteAffect type="task" />}
      <InsideTaskLayout
        title={task.data?.name as string}
        isLoading={task.isLoading}
        canAccessToSettings={isOwner || isAdmin}
        canAccessToHistory={isNotStudent}
      >
        <div className="p-4 md:w-1/2">
          <div className="w-full">
            <h4 className="text-xl text-sand-12">General</h4>
            <hr className="my-2" />

            <Forms
              confirmBtn={{
                title: "Edit Task",
                icon: "solar:programming-line-duotone",
                className: "lg:w-1/3 py-2",
              }}
              schema={AddTaskSchema}
              onSubmit={editTask}
              fields={[
                {
                  label: "name",
                  title: "Name",
                  type: "text",
                  value: task.data?.name ?? "",
                  disabled: !isOwner && !isAdmin,
                },
                {
                  label: "type",
                  title: "Type",
                  options: ["Lesson", "Problem", "Typing"],
                  type: "select",
                  disabled: true,
                  conditional: (data) =>
                    data !== undefined && data !== "Typing",
                  children: {
                    label: "language",
                    title: "Language",
                    type: "select",
                    options: ["C++", "Python", "Java", "C#", "C"],
                  },
                  value: task.data?.type ?? "",
                },
                {
                  label: "tags",
                  title: "Tags",
                  type: "multiple-search",
                  queryFn: queryTags,
                  optional: true,
                  canAddItemNotInList: true,
                  value:
                    task.data?.tags.map(({ name }) => ({
                      label: name,
                      value: name,
                    })) ?? [],
                  disabled: !isOwner && !isAdmin,
                },
                {
                  label: "owner",
                  title: "Owner",
                  type: "single-search",
                  queryFn: queryUsers,
                  value: task.isLoading
                    ? []
                    : ([
                        {
                          label: task.data?.owner.full_name ?? "",
                          value: task.data?.owner.student_id ?? "",
                        },
                      ] as SearchValue[]),
                  disabled: !isOwner,
                },
                {
                  label: "isPrivate",
                  title: "Private",
                  type: "checkbox",
                  disabled: !canEdit,
                  value: task.data?.isPrivate ?? false,
                },
                {
                  label: "note",
                  title: "Note",
                  type: "text",
                  optional: true,
                  value: task.data?.note ?? "",
                  disabled: !isOwner && !isAdmin,
                },
              ]}
            />
          </div>
          {canDelete && (
            <div className="mt-10">
              <h4 className="text-xl text-red-9">Danger Zone</h4>
              <hr className="my-2" />
              <Button
                onClick={handleDelete}
                icon="solar:trash-bin-minimalistic-line-duotone"
                className="w-full bg-red-9 text-sand-1 shadow active:bg-red-11 md:w-fit"
              >
                Delete Task
              </Button>
            </div>
          )}
        </div>
      </InsideTaskLayout>
    </>
  );
}

export default Settings;
