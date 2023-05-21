import LabLayout from "~/Layout/LabLayout";
import { AddLabSchema, type TAddLabSchema } from "~/forms/LabSchema";
import Button from "~/components/Common/Button";
import DeleteAffect from "~/components/DeleteAffect";
import Forms from "~/components/Forms";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import { TRPCClientError } from "@trpc/client";
import { useDeleteAffectStore } from "~/store";
import { callToast } from "~/services/callToast";

function Settings() {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const router = useRouter();

  const { courseId, labId } = router.query;
  const course = trpc.courses.getCourseById.useQuery({
    id: parseInt(courseId as string),
  });

  const lab = trpc.labs.getLabById.useQuery({
    id: parseInt(labId as string),
  });

  const editLabMutation = trpc.labs.updateLab.useMutation();
  const editLab = async (formData: TAddLabSchema) => {
    try {
      const _lab = await editLabMutation.mutateAsync({
        ...formData,
        courseId: parseInt(courseId as string),
        id: parseInt(labId as string),
      });
      if (_lab) {
        callToast({
          msg: "Updated lab successfully",
          type: "success",
        });

        await lab.refetch();
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  const tags = trpc.tags.getTags.useQuery();

  return (
    <>
      {selectedObj && <DeleteAffect type="lab-inside" />}
      <LabLayout
        title={course.data?.name as string}
        isLoading={course.isLoading}
      >
        <div className="w-1/2 p-4">
          <div className="w-full">
            <h4 className="text-xl">General</h4>
            <hr className="my-2" />

            <Forms
              schema={AddLabSchema}
              onSubmit={editLab}
              fields={[
                {
                  label: "name",
                  title: "Name",
                  type: "text",
                  value: lab.data?.name,
                },
                {
                  label: "tags",
                  title: "Tags",
                  type: "multiple-search",
                  optional: true,
                  canAddItemNotInList: true,
                  options: tags.data?.map(({ name }) => name) ?? [],
                  value: lab.data?.tags.map((tag) => tag.name),
                },
                {
                  label: "isDisabled",
                  title: "Disabled",
                  type: "checkbox",
                  value: lab.data?.isDisabled,
                },
              ]}
              confirmBtn={{
                title: "Edit Lab",
                icon: "solar:pen-2-line-duotone",
              }}
            />
          </div>
          <div className="mt-10">
            <h4 className="text-xl text-red-9">Danger Zone</h4>
            <hr className="my-2" />
            <Button
              onClick={() =>
                setSelectedObj({
                  selected: lab.data?.name as string,
                  type: "lab",
                })
              }
              icon="solar:trash-bin-minimalistic-line-duotone"
              className="bg-red-9 text-sand-1 shadow active:bg-red-11"
            >
              Delete Lab
            </Button>
          </div>
        </div>
      </LabLayout>
    </>
  );
}

export default Settings;
