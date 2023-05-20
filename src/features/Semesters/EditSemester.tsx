import Toast from "~/components/Common/Toast";
import DeleteAffect from "~/components/DeleteAffect";
import { trpc } from "~/helpers";
import { useDeleteAffectStore } from "~/store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Button from "~/components/Common/Button";
import { SemesterSchema, TSemesterSchema } from "~/forms/SemesterSchema";
import Skeleton from "~/components/Common/Skeleton";

const EditSemester = () => {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const semester = trpc.semesters.getSemesterByYearAndTerm.useQuery({
    yearAndTerm: selectedObj?.selected!,
  });
  const ctx = trpc.useContext();
  const updateSemester = trpc.semesters.updateSemester.useMutation({
    onSuccess: () => {
      toast.custom((t) => (
        <Toast {...t} msg="Edit users successfully" type="success" />
      ));
      setSelectedObj(null);
      ctx.semesters.invalidate();
    },
    onError: (err) => {
      toast.custom((t) => <Toast {...t} msg={err.message} type="error" />);
    },
  });

  const editUser = async (formData: TSemesterSchema) => {
    const { startDate, term, year } = formData;
    updateSemester.mutate({
      id: semester.data?.id!,
      startDate,
      term,
      year,
    });
  };

  const [isDelete, setIsDelete] = useState(false);

  return (
    <>
      {isDelete ? (
        <DeleteAffect type="semester" />
      ) : (
        <Modal
          isOpen={true}
          onClose={() => setSelectedObj(null)}
          title="Edit Semester"
          className="md:w-[40rem]"
        >
          {semester.isLoading ? (
            <div className="flex flex-col gap-2 my-4">
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
                onSubmit={editUser}
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
                className="w-full font-bold bg-red-9 text-sand-2 hover:bg-red-10"
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
