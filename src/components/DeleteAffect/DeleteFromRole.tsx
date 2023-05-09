import Modal from "../Common/Modal";
import Button from "../Common/Button";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { useDeleteAffectStore } from "@/store";
import { trpc } from "@/helpers";
import toast from "react-hot-toast";
import Toast from "../Common/Toast";

interface fetchUserDataProps {
  summary: { name: string; amount: number | undefined }[];
  object: { name: string; data: string[] | undefined }[];
}

type SelectObj = {
  obj: string;
  type: string;
};
function DeleteFromRole() {
  const [selectedObject, setSelectedObject] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const [fetchData, setFetchData] = useState<fetchUserDataProps | null>(null);

  const ctx = trpc.useContext();

  const deleteUser = trpc.users.removeRoleFromUser.useMutation({
    onSuccess() {
      toast.custom((t) => (
        <Toast {...t} msg="Delete User successfully" type="success" />
      ));
      setSelectedObject(null);
      setConfirmMsg("");
      ctx.users.invalidate();
    },
  });
  const handleDelete = () => {
    if (selectedObject) {
      const [type, role] = selectedObject.type.split("/");
      if (type === "user") {
        deleteUser.mutateAsync({ email: selectedObject.obj, role });
      }
    }
  };

  return (
    <Modal
      title="Remove Admin Role"
      description={
        <>
          Remove Admin Role from
          <span className="text-lg font-bold">
            &ldquo;{selectedObject?.obj}&rdquo;
          </span>
        </>
      }
      isOpen={!!selectedObject}
      onClose={() => setSelectedObject(null)}
      className="w-[90%]  md:w-[30rem] max-h-[90%]"
    >
      <div className="flex gap-2 mt-10">
        <Button
          onClick={handleDelete}
          className="w-full font-bold bg-red-9 text-sand-2 hover:bg-red-10"
        >
          Delete
        </Button>
        <Button
          onClick={handleDelete}
          className="w-full font-bold border border-sand-9 text-sand-10 hover:bg-sand-4"
        >
          Cancel
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteFromRole;
