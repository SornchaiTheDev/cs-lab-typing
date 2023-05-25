import DeleteAffect from "~/components/DeleteAffect";
import { NonKUStudent, type TNonKUStudent } from "~/forms/NonKUSchema";
import { trpc } from "~/helpers";
import { useDeleteAffectStore } from "~/store";
import { useState } from "react";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Button from "~/components/Common/Button";
import { callToast } from "~/services/callToast";

const EditNonKUStudent = () => {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const user = trpc.users.getUserByEmail.useQuery({
    email: selectedObj?.selected.display as string,
  });
  const ctx = trpc.useContext();
  const updateUser = trpc.users.updateNonKUStudent.useMutation({
    onSuccess: () => {
      callToast({ msg: "Edit users successfully", type: "success" });
      setSelectedObj(null);
      ctx.users.invalidate();
    },
    onError: (err) => {
      callToast({ msg: err.message, type: "error" });
    },
  });

  const editUser = async (formData: TNonKUStudent) => {
    const { email, full_name, roles, student_id, password } = formData;
    updateUser.mutate({
      email,
      full_name,
      roles,
      password,
      student_id,
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
              <div className="h-6 w-20 animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-8 w-full animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-6 w-24 animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-8 w-full animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-6 w-24 animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-8 w-full animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-6 w-28 animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-8 w-full animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-6 w-36 animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="h-8 w-full animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
              <div className="mt-4 h-14 w-full animate-pulse rounded-lg bg-gradient-to-r from-sand-6 to-sand-4"></div>
            </div>
          ) : (
            <>
              <Forms
                schema={NonKUStudent}
                onSubmit={editUser}
                fields={[
                  {
                    label: "student_id",
                    title: "Username",
                    type: "text",
                    value: user.data?.student_id,
                  },
                  {
                    label: "password",
                    title: "New Password",
                    type: "text",
                  },
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
                    value: user.data?.roles,
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

export default EditNonKUStudent;
