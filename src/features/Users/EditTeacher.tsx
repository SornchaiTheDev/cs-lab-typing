import Toast from "@/components/Common/Toast";
import DeleteAffect from "@/components/DeleteAffect";
import { KUStudentSchema, TKUStudentSchema } from "@/forms/KUStudentSchema";
import { trpc } from "@/helpers";
import { useDeleteAffectStore } from "@/store";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Modal from "@/components/Common/Modal";
import Forms from "@/components/Forms";
import Button from "@/components/Common/Button";
import { TTeacherSchema, TeacherSchema } from "@/forms/TeacherSchema";

const EditTeacher = ({ onClose }: { onClose: () => void }) => {
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
      onClose();
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
          onClose={onClose}
          title="Edit User"
          className="md:w-[40rem]"
        >
          {user.isLoading ? (
            <div className="flex flex-col gap-2 my-4">
              <div className="w-20 h-6 rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="w-24 h-6 rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="w-24 h-6 rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="h-6 rounded-lg w-28 bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="h-6 rounded-lg w-36 bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="w-full h-8 rounded-lg bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
              <div className="w-full mt-4 rounded-lg h-14 bg-gradient-to-r from-sand-6 to-sand-4 animate-pulse"></div>
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
