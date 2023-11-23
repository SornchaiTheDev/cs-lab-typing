import LabLayout from "~/Layout/LabLayout";
import { AddLabSchema, type TAddLabSchema } from "~/schemas/LabSchema";
import Button from "~/components/Common/Button";
import DeleteAffect from "~/components/DeleteAffect";
import Forms from "~/components/Forms";
import { getHighestRole, trpc } from "~/helpers";
import { useRouter } from "next/router";
import { TRPCClientError } from "@trpc/client";
import { useDeleteAffectStore } from "~/store";
import { callToast } from "~/services/callToast";
import { useSession } from "next-auth/react";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";

function Settings() {
  const { data: session } = useSession();
  const isTeacher = session?.user?.roles.includes("TEACHER");

  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const router = useRouter();

  const { courseId, labId } = router.query;

  const lab = trpc.labs.getLabById.useQuery(
    {
      labId: labId as string,
      courseId: courseId as string,
    },
    {
      enabled: !!labId,
    }
  );

  const tags = trpc.tags.getTags.useQuery();

  const editLabMutation = trpc.labs.updateLab.useMutation();
  const editLab = async (formData: TAddLabSchema) => {
    try {
      await editLabMutation.mutateAsync({
        ...formData,
        courseId: courseId as string,
        labId: labId as string,
      });

      await lab.refetch();
      await tags.refetch();
      callToast({
        msg: "Updated lab successfully",
        type: "success",
      });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  const role = getHighestRole(session?.user?.roles ?? []);
  const isStudent = role === "STUDENT";

  return (
    <>
      {selectedObj && <DeleteAffect type="lab-inside" />}
      <LabLayout
        title={lab.data?.name as string}
        isLoading={lab.isLoading}
        canAccessToSuperUserMenus={!isStudent}
      >
        <div className="p-4 md:w-1/2">
          <div className="w-full">
            <h4 className="text-xl text-sand-12">General</h4>
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
                  options:
                    tags.data?.map(({ name }) => ({
                      label: name,
                      value: name,
                    })) ?? [],
                  value: lab.data?.tags.map(({ name }) => ({
                    label: name,
                    value: name,
                  })),
                },
                {
                  label: "active",
                  title: "Active",
                  type: "checkbox",
                  disabled: !isTeacher,
                  value: lab.data?.active,
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
                  selected: {
                    display: lab.data?.name as string,
                    id: `${labId}/${courseId}`,
                  },
                  type: "lab",
                })
              }
              icon="solar:trash-bin-minimalistic-line-duotone"
              className="w-full bg-red-9 text-sand-1 shadow active:bg-red-11 md:w-fit"
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

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { req, res } = ctx;
  const { helper } = await createTrpcHelper({ req, res });
  const { courseId } = ctx.query;
  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      if (err.message === "NOT_FOUND") {
        return {
          notFound: true,
        };
      }
    }
  }
  return {
    props: {},
  };
};
