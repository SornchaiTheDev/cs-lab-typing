import Modal from "../Common/Modal";
import Button from "../Common/Button";
import { ChangeEvent, useEffect, useState } from "react";
import { useDeleteAffectStore } from "@/store";
import { trpc } from "@/helpers";
import toast from "react-hot-toast";
import Toast from "../Common/Toast";

interface Props {
  type: "course" | "section" | "task" | "lab" | "user" | "semester";
}

interface fetchUserDataProps {
  summary: { name: string; amount: number | undefined }[];
  object: { name: string; data: string[] | undefined }[];
}
function DeleteAffect({ type }: Props) {
  const [selectedObject, setSelectedObject] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const [fetchData, setFetchData] = useState<fetchUserDataProps | null>(null);

  const ctx = trpc.useContext();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await ctx.users.getUserObjectRelation.fetch({
        email: selectedObject!.selected,
      });
      setFetchData(data);
    };

    const fetchSemesterData = async () => {
      const data = await ctx.semester.getSemesterObjectRelation.fetch({
        yearAndTerm: selectedObject!.selected,
      });
      setFetchData(data);
    };

    if (type === "user") {
      fetchUserData();
    }

    if (type === "semester") {
      fetchSemesterData();
    }
  }, [type, selectedObject, ctx]);
  const deleteUser = trpc.users.deleteUser.useMutation({
    onSuccess() {
      toast.custom((t) => (
        <Toast {...t} msg="Delete User successfully" type="success" />
      ));
      setSelectedObject(null);
      setConfirmMsg("");
      ctx.users.invalidate();
    },
    onError() {
      toast.custom((t) => (
        <Toast {...t} msg="SOMETHING_WENT_WRONG" type="success" />
      ));
    },
  });
  const deleteSemester = trpc.semester.deleteSemester.useMutation({
    onSuccess() {
      toast.custom((t) => (
        <Toast {...t} msg="Delete Semester successfully" type="success" />
      ));
      setSelectedObject(null);
      setConfirmMsg("");
      ctx.semester.invalidate();
    },
    onError() {
      toast.custom((t) => (
        <Toast {...t} msg="SOMETHING_WENT_WRONG" type="success" />
      ));
    },
  });
  const handleDelete = () => {
    if (selectedObject) {
      if (type === "user") {
        deleteUser.mutate({ email: selectedObject.selected });
      }
      if (type === "semester") {
        deleteSemester.mutate({ yearAndTerm: selectedObject.selected });
      }
    }
  };

  return (
    <Modal
      title={`Delete ${type}`}
      description={
        <>
          Are you sure to delete {type}{" "}
          <span className="text-lg font-bold">
            &ldquo;{selectedObject?.selected}&rdquo;
          </span>
          ? All of these following related items will be deleted
        </>
      }
      isOpen={!!selectedObject}
      onClose={() => setSelectedObject(null)}
      className="md:w-[40rem] max-h-[90%]"
    >
      <div className="flex-1 overflow-y-auto">
        <div className="overflow-auto whitespace-nowrap">
          <h3 className="mt-2 text-lg font-bold">Summary</h3>
          <ul className="list-disc list-inside">
            {fetchData?.summary.map(({ name, amount }) => (
              <li key={name}>
                {name} : {amount}
              </li>
            ))}
          </ul>
          <h3 className="mt-2 text-lg font-bold">Objects</h3>

          <ul className="list-disc list-inside">
            {fetchData?.object.map(({ name, data }) => {
              if (data) {
                return (
                  <li key={name}>
                    {name}
                    <ul className="pl-8 list-disc list-inside">
                      {data.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </li>
                );
              }
              return null;
            })}
          </ul>
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <input
          value={confirmMsg}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setConfirmMsg(e.target.value)
          }
          className="w-full p-2 border rounded-md outline-none border-sand-6 bg-sand-1"
          placeholder={`Type "${selectedObject?.selected}" to confirm`}
        />

        <Button
          disabled={confirmMsg !== selectedObject?.selected}
          onClick={handleDelete}
          className="w-full font-bold bg-red-9 text-sand-2 hover:bg-red-10"
        >
          Delete
        </Button>
      </div>
    </Modal>
  );
}

export default DeleteAffect;
