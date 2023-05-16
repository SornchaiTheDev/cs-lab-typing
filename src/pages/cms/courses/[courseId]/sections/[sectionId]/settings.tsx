import Button from "@/components/Common/Button";
import DeleteAffect from "@/components/DeleteAffect";
import SectionLayout from "@/Layout/SectionLayout";
import { AddSectionSchema, TAddSection } from "@/forms/SectionSchema";
import { generatePerson } from "@/helpers";
import Forms from "@/components/Forms";
import { useState } from "react";
import { trpc } from "@/helpers";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import Toast from "@/components/Common/Toast";
import { TRPCClientError } from "@trpc/client";
import { useDeleteAffectStore } from "@/store";

interface Props {
  course: {
    id: string;
    name: string;
  };
}

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
    roles: ["ADMIN", "TEACHER"],
  });
  const TAUsers = trpc.users.getAllUsersInRole.useQuery({
    roles: ["STUDENT"],
  });
  const section = trpc.sections.getSectionById.useQuery({
    id: parseInt(sectionId as string),
  });

  const editSectionMutation = trpc.sections.updateSection.useMutation();
  const editSection = async (formData: TAddSection) => {
    try {
      await editSectionMutation.mutateAsync({
        ...formData,
        id: parseInt(sectionId as string),
      });
      toast.custom((t) => (
        <Toast {...t} msg="Edit section successfully" type="success" />
      ));
      ctx.sections.invalidate();
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        toast.custom((t) => <Toast {...t} msg={errMsg} type="error" />);
      }
    }
  };

  return (
    <>
      {selectedObj && <DeleteAffect type="section" />}

      <SectionLayout title={section.data?.name!} isLoading={section.isLoading}>
        <div className="w-1/2 p-4">
          <div className="w-full">
            <h4 className="text-xl">General</h4>
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
                    `${section.data?.semester.year}/${section.data?.semester.term}` ??
                    "",
                },
                {
                  label: "name",
                  title: "Name",
                  type: "text",
                  value: section.data?.name ?? "",
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
                  label: "tas",
                  title: "TA (s)",
                  type: "multiple-search",
                  options: TAUsers.data?.map((user) => user.full_name) ?? [],
                  value: section.data?.tas.map((user) => user.full_name) ?? [],
                },
                {
                  label: "note",
                  title: "Note",
                  type: "text",
                  value: section.data?.note ?? "",
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
                  selected: section.data?.name!,
                  type: "section",
                })
              }
              icon="solar:trash-bin-minimalistic-line-duotone"
              className="shadow bg-red-9 text-sand-1 active:bg-red-11"
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
