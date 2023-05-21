import InsideTaskLayout from "~/Layout/InsideTaskLayout";
import { useRouter } from "next/router";
import Button from "~/components/Common/Button";
import DeleteAffect from "~/components/DeleteAffect";
import Forms from "~/components/Forms";
import { AddTaskSchema, type TAddTask } from "~/forms/TaskSchema";
import { trpc } from "~/helpers";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import { useDeleteAffectStore } from "~/store";
interface Props {
  course: {
    id: string;
    name: string;
  };
}

function Settings({ course }: Props) {
  const router = useRouter();
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const taskId = parseInt(router.query.taskId as string);
  const task = trpc.tasks.getTaskById.useQuery({ id: taskId });
  const editTaskMutation = trpc.tasks.updateTask.useMutation();
  const editTask = async (formData: TAddTask) => {
    try {
      editTaskMutation.mutateAsync({
        ...formData,
        id: taskId,
      });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  const authorUser = trpc.users.getAllUsersInRole.useQuery({
    roles: ["ADMIN", "TEACHER"],
  });

  return (
    <>
      {selectedObj && <DeleteAffect type="task-inside" />}
      <InsideTaskLayout
        title={task.data?.name as string}
        isLoading={task.isLoading}
      >
        <div className="w-1/2 p-4">
          <div className="w-full">
            <h4 className="text-xl">General</h4>
            <hr className="my-2" />

            <Forms
              confirmBtn={{
                title: "Edit Task",
                icon: "solar:programming-line-duotone",
                className: "w-1/3 py-2",
              }}
              schema={AddTaskSchema}
              onSubmit={editTask}
              fields={[
                {
                  label: "name",
                  title: "Name",
                  type: "text",
                  value: task.data?.name ?? "",
                },
                {
                  label: "type",
                  title: "Type",
                  options: ["Lesson", "Problem", "Typing"],
                  type: "select",
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
                  options: ["C++", "Python", "Java", "C#", "C"],
                  optional: true,
                  canAddItemNotInList: true,
                  value: task.data?.tags.map(({ name }) => name) ?? [],
                },
                {
                  label: "owner",
                  title: "Owner",
                  type: "single-search",
                  options:
                    authorUser.data?.map(({ full_name }) => full_name) ?? [],
                  value: task.data?.owner.full_name,
                },
                {
                  label: "isPrivate",
                  title: "Private",
                  type: "checkbox",
                  value: task.data?.isPrivate ?? false,
                },
                {
                  label: "note",
                  title: "Note",
                  type: "text",
                  optional: true,
                  value: task.data?.note ?? "",
                },
              ]}
            />
          </div>
          <div className="mt-10">
            <h4 className="text-xl text-red-9">Danger Zone</h4>
            <hr className="my-2" />
            <Button
              onClick={() =>
                setSelectedObj({
                  selected: task.data?.name as string,
                  type: "task",
                })
              }
              icon="solar:trash-bin-minimalistic-line-duotone"
              className="bg-red-9 text-sand-1 shadow active:bg-red-11"
            >
              Delete Task
            </Button>

            {/* <DeleteAffect type="task" selected="Q KEY" /> */}
          </div>
        </div>
      </InsideTaskLayout>
    </>
  );
}

export default Settings;
