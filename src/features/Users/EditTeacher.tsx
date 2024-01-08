import DeleteAffect from "~/components/DeleteAffect";
import { trpc } from "~/utils";
import { useDeleteAffectStore } from "~/store";
import { useState } from "react";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Button from "~/components/Common/Button";
import { type TTeacherSchema, TeacherSchema } from "~/schemas/TeacherSchema";
import Skeleton from "~/components/Common/Skeleton";
import { callToast } from "~/services/callToast";

interface Props {
  onUpdate: () => void;
}

const EditTeacher = ({ onUpdate }: Props) => {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const user = trpc.users.getUserByEmail.useQuery({
    email: selectedObj?.selected.display as string,
  });

  const updateUser = trpc.users.updateTeacher.useMutation({
    onSuccess: () => {
      callToast({ msg: "Edit users successfully", type: "success" });
      setSelectedObj(null);
      onUpdate();
    },
    onError: (err) => {
      callToast({ msg: err.message, type: "error" });
    },
  });

  const editUser = async (formData: TTeacherSchema) => {
    const { email, full_name, roles } = formData;
    updateUser.mutate({
      email,
      full_name,
      roles: roles.map((role) => role.value as string),
    });
  };

  const [isDelete, setIsDelete] = useState(false);

  return (
    <>
      {isDelete ? (
        <DeleteAffect type="user" />
      ) : (
        <Modal
          isOpen={true}
          onClose={() => setSelectedObj(null)}
          title="Edit User"
          className="md:w-[40rem]"
        >
          {user.isLoading ? (
            <div className="my-4 flex flex-col gap-2">
              <Skeleton width={"4rem"} height={"1.5rem"} />
              <Skeleton width={"100%"} height={"2rem"} />
              <Skeleton width={"4rem"} height={"1.5rem"} />
              <Skeleton width={"100%"} height={"2rem"} />
              <Skeleton width={"4rem"} height={"1.5rem"} />
              <Skeleton width={"100%"} height={"2rem"} />
              <Skeleton width={"4rem"} height={"1.5rem"} />
              <Skeleton width={"100%"} height={"2rem"} />
              <Skeleton width={"100%"} height={"2.5rem"} />
            </div>
          ) : (
            <>
              <Forms
                schema={TeacherSchema}
                onSubmit={editUser}
                fields={[
                  {
                    label: "email",
                    title: "Email",
                    type: "text",
                    value: user.data?.email,
                    disabled: true,
                  },
                  {
                    label: "full_name",
                    title: "Full Name",
                    type: "text",
                    value: user.data?.full_name,
                  },
                  {
                    label: "roles",
                    title: "Roles",
                    type: "multiple-search",
                    options: [
                      { label: "Student", value: "STUDENT" },
                      { label: "Teacher", value: "TEACHER" },
                      { label: "Admin", value: "ADMIN" },
                    ],
                    value: user.data?.roles.map((role) => ({
                      label: role.charAt(0) + role.slice(1).toLowerCase(),
                      value: role,
                    })),
                  },
                ]}
                confirmBtn={{
                  title: "Edit",
                  icon: "solar:pen-2-line-duotone",
                  isLoading: updateUser.isLoading,
                }}
              />
              <hr className="my-2" />
              <Button
                onClick={() => setIsDelete(true)}
                className="w-full bg-red-9 font-bold text-sand-2 hover:bg-red-10"
                icon="solar:trash-bin-trash-line-duotone"
              >
                Delete User
              </Button>
            </>
          )}
        </Modal>
      )}
    </>
  );
};

export default EditTeacher;
