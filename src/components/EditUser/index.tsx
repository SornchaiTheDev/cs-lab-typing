import DeleteAffect from "~/components/DeleteAffect";
import { useDeleteAffectStore } from "~/store";
import { useState } from "react";
import Modal from "~/components/Common/Modal";
import Forms from "~/components/Forms";
import Button from "~/components/Common/Button";
import { type UserType, useEditUser } from "~/hooks/useEditUser";

interface Props {
  onUpdate: () => void;
  type: UserType;
}
const EditUser = ({ type, onUpdate }: Props) => {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const { schema, fields, user, updateUser, formSubmit } = useEditUser({
    email: selectedObj?.selected.display as string,
    type,
    onUpdate,
  });

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
                schema={schema}
                onSubmit={formSubmit}
                fields={fields}
                confirmBtn={{
                  title: "Edit",
                  icon: "solar:pen-2-line-duotone",
                  isLoading: updateUser!.isLoading,
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

export default EditUser;
