import Modal from "../Common/Modal";
import Button from "../Common/Button";
import { ChangeEvent, useEffect, useState } from "react";
import { useDeleteAffectStore } from "~/store";
import { trpc } from "~/helpers";
import toast from "react-hot-toast";
import Toast from "../Common/Toast";
import { useRouter } from "next/router";

interface Props {
  type: "course" | "section" | "task" | "lab" | "user" | "semester";
}

interface fetchDataProps {
  summary: { name: string; amount: number }[];
  object: { name: string; data: (string | undefined)[] }[];
}
function DeleteAffect({ type }: Props) {
  const [selectedObject, setSelectedObject] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const [fetchData, setFetchData] = useState<fetchDataProps | null>(null);

  const ctx = trpc.useContext();

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await ctx.users.getUserObjectRelation.fetch({
        email: selectedObject!.selected,
      });
      setFetchData(data);
    };

    const fetchSemesterData = async () => {
      const data = await ctx.semesters.getSemesterObjectRelation.fetch({
        yearAndTerm: selectedObject!.selected,
      });
      setFetchData(data);
    };

    const fetchCourseData = async () => {
      const data = await ctx.courses.getCourseObjectRelation.fetch({
        name: selectedObject!.selected,
      });
      setFetchData(data);
    };

    const fetchSectionData = async () => {
      const data = await ctx.sections.getSectionObjectRelation.fetch({
        name: selectedObject!.selected,
      });
      setFetchData(data);
    };

    if (type === "user") {
      fetchUserData();
    }

    if (type === "semester") {
      fetchSemesterData();
    }

    if (type === "course") {
      fetchCourseData();
    }

    if (type === "section") {
      fetchSectionData();
    }
  }, [type, selectedObject, ctx]);

  const deleteUser = trpc.users.deleteUser.useMutation();
  const handleDeleteUser = async () => {
    if (!selectedObject) return;
    try {
      await deleteUser.mutateAsync({
        email: selectedObject.selected as string,
      });

      toast.custom((t) => (
        <Toast {...t} msg="Delete User successfully" type="success" />
      ));
      setSelectedObject(null);
      setConfirmMsg("");
      ctx.users.invalidate();
    } catch (err) {
      toast.custom((t) => (
        <Toast {...t} msg="SOMETHING_WENT_WRONG" type="success" />
      ));
    }
  };

  const deleteSemester = trpc.semesters.deleteSemester.useMutation();
  const handleDeleteSemester = async () => {
    if (!selectedObject) return;
    try {
      await deleteSemester.mutateAsync({
        yearAndTerm: selectedObject.selected as string,
      });

      toast.custom((t) => (
        <Toast {...t} msg="Delete Semester successfully" type="success" />
      ));
      setSelectedObject(null);
      setConfirmMsg("");
      ctx.semesters.invalidate();
    } catch (err) {
      toast.custom((t) => (
        <Toast {...t} msg="SOMETHING_WENT_WRONG" type="success" />
      ));
    }
  };

  const deleteCourse = trpc.courses.deleteCourse.useMutation();
  const handleDeleteCourse = async () => {
    if (!selectedObject) return;
    try {
      await deleteCourse.mutateAsync({
        name: selectedObject.selected,
      });

      toast.custom((t) => (
        <Toast {...t} msg="Delete Course successfully" type="success" />
      ));
      setSelectedObject(null);
      router.replace("/cms/courses");
    } catch (err) {
      toast.custom((t) => (
        <Toast {...t} msg="SOMETHING_WENT_WRONG" type="success" />
      ));
    }
  };
  const deleteSection = trpc.sections.deleteSection.useMutation();
  const handleDeleteSection = async () => {
    if (!selectedObject) return;
    try {
      await deleteSection.mutateAsync({
        name: selectedObject.selected,
      });

      toast.custom((t) => (
        <Toast {...t} msg="Delete Section successfully" type="success" />
      ));
      setSelectedObject(null);
      router.replace({
        pathname: "/cms/courses/[courseId]/sections",
        query: { courseId: router.query.courseId },
      });
    } catch (err) {
      toast.custom((t) => (
        <Toast {...t} msg="SOMETHING_WENT_WRONG" type="success" />
      ));
    }
  };

  const handleDelete = () => {
    if (type === "user") {
      handleDeleteUser();
    }
    if (type === "semester") {
      handleDeleteSemester();
    }
    if (type === "course") {
      handleDeleteCourse();
    }
    if (type === "section") {
      handleDeleteSection();
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
      className="md:w-[40rem] max-h-[90%] flex flex-col"
    >
      <div className="flex-1 overflow-auto">
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
