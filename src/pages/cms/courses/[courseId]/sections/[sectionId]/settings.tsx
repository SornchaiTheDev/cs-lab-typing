import Button from "~/components/Common/Button";
import DeleteAffect from "~/components/DeleteAffect";
import SectionLayout from "~/Layout/SectionLayout";
import { AddSectionSchema, type TAddSection } from "~/schemas/SectionSchema";
import Forms from "~/components/Forms";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import { TRPCClientError } from "@trpc/client";
import { useDeleteAffectStore } from "~/store";
import { callToast } from "~/services/callToast";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";

function Settings() {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const router = useRouter();
  const { sectionId } = router.query;

  const ctx = trpc.useContext();
  const getAllSemester = trpc.semesters.getAllSemesters.useQuery();
  const authorUser = trpc.users.getAllUsersInRole.useQuery({
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  });

  const section = trpc.sections.getSectionById.useQuery(
    {
      id: sectionId as string,
    },
    {
      enabled: !!sectionId,
    }
  );

  const editSectionMutation = trpc.sections.updateSection.useMutation();
  const editSection = async (formData: TAddSection) => {
    try {
      await editSectionMutation.mutateAsync({
        ...formData,
        id: sectionId as string,
      });
      callToast({ msg: "Edit section successfully", type: "success" });

      await ctx.sections.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
      }
    }
  };

  return (
    <>
      {selectedObj && <DeleteAffect type="section" />}

      <SectionLayout
        title={section.data?.name as string}
        isLoading={section.isLoading}
      >
        <div className="p-4 md:w-1/2">
          <div className="w-full">
            <h4 className="text-xl text-sand-12">General</h4>
            <hr className="my-2" />

            <Forms
              onSubmit={editSection}
              schema={AddSectionSchema}
              fields={[
                {
                  label: "semester",
                  title: "Semester",
                  type: "select",
                  options: getAllSemester.data,
                  value:
                    `${section.data?.semester.year as string}/${
                      section.data?.semester.term as string
                    }` ?? "",
                },
                {
                  label: "name",
                  title: "Name",
                  type: "text",
                  value: section.data?.name ?? "",
                },
                {
                  label: "type",
                  title: "Type",
                  type: "select",
                  options: ["Lesson", "Exam"],
                  value: section.data?.type ?? "",
                },
                {
                  label: "instructors",
                  title: "Instructors",
                  type: "multiple-search",
                  options: authorUser.data?.map((user) => user.full_name) ?? [],
                  value:
                    section.data?.instructors.map((user) => user.full_name) ??
                    [],
                },
                {
                  label: "note",
                  title: "Note",
                  type: "text",
                  value: section.data?.note ?? "",
                },
                {
                  label: "active",
                  title: "Active",
                  type: "checkbox",
                  optional: true,
                  value: section.data?.active ?? false,
                },
              ]}
              confirmBtn={{
                title: "Edit Section",
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
                    display: section.data?.name as string,
                    id: section.data?.id as number,
                  },
                  type: "section",
                })
              }
              icon="solar:trash-bin-minimalistic-line-duotone"
              className="w-full shadow bg-red-9 text-sand-1 active:bg-red-11 md:w-fit"
            >
              Delete Section
            </Button>
          </div>
        </div>
      </SectionLayout>
    </>
  );
}

export default Settings;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper } = await createTrpcHelper({ req, res });
  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      id: courseId as string,
    });
    await helper.sections.getSectionById.fetch({
      id: sectionId as string,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {},
  };
};
