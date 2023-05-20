import Toast from "~/components/Common/Toast";
import DeleteAffect from "~/components/DeleteAffect";
import { trpc } from "~/helpers";
import { useDeleteAffectStore } from "~/store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Button from "~/components/Common/Button";
import { TTeacherSchema, TeacherSchema } from "~/forms/TeacherSchema";
import Skeleton from "~/components/Common/Skeleton";

const EditTeacher = () => {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const user = trpc.users.getUserByEmail.useQuery({
    email: selectedObj?.selected!,
  });
  const ctx = trpc.useContext();
  const updateUser = trpc.users.updateTeacher.useMutation({
    onSuccess: () => {
      toast.custom((t) => (
        <Toast {...t} msg="Edit users successfully" type="success" />
      ));
      setSelectedObj(null);
      ctx.users.invalidate();
    },
    onError: (err) => {
      toast.custom((t) => <Toast {...t} msg={err.message} type="error" />);
    },
  });

  const editUser = async (formData: TTeacherSchema) => {
    const { email, full_name, roles } = formData;
    updateUser.mutate({
      email,
      full_name,
      roles,
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
            <div className="flex flex-col gap-2 my-4">
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
                    options: ["STUDENT", "TEACHER", "ADMIN"],
                    value: user.data?.roles.map((role) => role.name),
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
                className="w-full font-bold bg-red-9 text-sand-2 hover:bg-red-10"
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
