import DeleteAffect from "~/components/DeleteAffect";
import { trpc } from "~/helpers";
import { useDeleteAffectStore } from "~/store";
import React, { useState } from "react";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Button from "~/components/Common/Button";
import { SemesterSchema, type TSemesterSchema } from "~/schemas/SemesterSchema";
import Skeleton from "~/components/Common/Skeleton";
import { callToast } from "~/services/callToast";

interface Props {
  onUpdate: () => void;
}
const EditSemester = ({ onUpdate }: Props) => {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const semester = trpc.semesters.getSemesterByYearAndTerm.useQuery({
    yearAndTerm: selectedObj?.selected.display as string,
  });

  const updateSemester = trpc.semesters.updateSemester.useMutation({
    onSuccess: () => {
      callToast({
        msg: "Edit users successfully",
        type: "success",
      });

      setSelectedObj(null);
      onUpdate();
    },
    onError: (err) => {
      callToast({
        msg: err.message,
        type: "error",
      });
    },
  });

  const editSemester = async (formData: TSemesterSchema) => {
    const { startDate, term, year } = formData;
    updateSemester.mutate({
      id: semester.data?.id as number,
      startDate,
      term,
      year,
    });
  };

  const [isDelete, setIsDelete] = useState(false);

  return (
    <>
      {isDelete ? (
        <DeleteAffect onDeleted={onUpdate} type="semester" />
      ) : (
        <Modal
          isOpen={true}
          onClose={() => setSelectedObj(null)}
          title="Edit Semester"
          className="md:w-[40rem]"
        >
          {semester.isLoading ? (
            <div className="my-4 flex flex-col gap-2">
              <Skeleton width={"4rem"} height={"1.5rem"} />
              <Skeleton width={"100%"} height={"2.5rem"} />
              <Skeleton width={"4rem"} height={"1.5rem"} />
              <Skeleton width={"100%"} height={"2.5rem"} />
              <Skeleton width={"4rem"} height={"1.5rem"} />
              <Skeleton width={"100%"} height={"2.5rem"} />
              <Skeleton width={"100%"} height={"3rem"} />
            </div>
          ) : (
            <>
              <Forms
                schema={SemesterSchema}
                onSubmit={editSemester}
                fields={[
                  {
                    label: "year",
                    title: "Year",
                    type: "text",
                    value: semester.data?.year ?? "",
                  },
                  {
                    label: "term",
                    title: "Term",
                    type: "select",
                    options: ["First", "Second", "Summer"],
                    value: semester.data?.term ?? "",
                  },
                  {
                    label: "startDate",
                    title: "Start Date",
                    type: "date",
                    value: semester.data?.startDate,
                  },
                ]}
                confirmBtn={{
                  title: "Edit",
                  icon: "solar:pen-2-line-duotone",
                  isLoading: updateSemester.isLoading,
                }}
              />
              <hr className="my-2" />
              <Button
                onClick={() => setIsDelete(true)}
                className="w-full bg-red-9 font-bold text-sand-2 hover:bg-red-10"
                icon="solar:trash-bin-trash-line-duotone"
              >
                Delete Semester
              </Button>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default EditSemester;
