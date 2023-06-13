import Modal from "../Common/Modal";
import Button from "../Common/Button";
import { type ChangeEvent, useEffect, useState } from "react";
import { useDeleteAffectStore } from "~/store";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import { callToast } from "~/services/callToast";
import type { Relation } from "~/types/Relation";

interface Props {
  type:
    | "course"
    | "section"
    | "task-outside"
    | "task-inside"
    | "lab"
    | "lab-outside"
    | "lab-inside"
    | "user"
    | "semester";
}

function DeleteAffect({ type }: Props) {
  const [selectedObject, setSelectedObject] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const [confirmMsg, setConfirmMsg] = useState<string>("");
  const [fetchData, setFetchData] = useState<Relation | null>(null);

  const ctx = trpc.useContext();

  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const data = await ctx.users.getUserObjectRelation.fetch({
        email: selectedObject?.selected.display as string,
      });
      setFetchData(data);
    };

    const fetchSemesterData = async () => {
      const data = await ctx.semesters.getSemesterObjectRelation.fetch({
        yearAndTerm: selectedObject?.selected.display as string,
      });
      setFetchData(data);
    };

    const fetchCourseData = async () => {
      const data = await ctx.courses.getCourseObjectRelation.fetch({
        name: selectedObject?.selected.display as string,
      });
      setFetchData(data);
    };

    const fetchSectionData = async () => {
      const data = await ctx.sections.getSectionObjectRelation.fetch({
        name: selectedObject?.selected.display as string,
      });
      setFetchData(data);
    };

    const fetchLabData = async () => {
      const data = await ctx.labs.getLabObjectRelation.fetch({
        id: selectedObject?.selected.id as number,
      });
      setFetchData(data);
    };

    const fetchTaskData = async () => {
      const data = await ctx.tasks.getTaskObjectRelation.fetch({
        id: selectedObject?.selected.id as number,
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

    if (type.startsWith("lab")) {
      fetchLabData();
    }

    if (type.startsWith("task")) {
      fetchTaskData();
    }
  }, [type, selectedObject, ctx]);

  const deleteUser = trpc.users.deleteUser.useMutation();
  const handleDeleteUser = async () => {
    if (!selectedObject) return;
    try {
      await deleteUser.mutateAsync({
        email: selectedObject.selected.display as string,
      });

      callToast({
        msg: "Delete User successfully",
        type: "success",
      });
      setSelectedObject(null);
      setConfirmMsg("");
      ctx.users.invalidate();
    } catch (err) {
      callToast({
        msg: "SOMETHING_WENT_WRONG",
        type: "success",
      });
    }
  };

  const deleteSemester = trpc.semesters.deleteSemester.useMutation();
  const handleDeleteSemester = async () => {
    if (!selectedObject) return;
    try {
      await deleteSemester.mutateAsync({
        yearAndTerm: selectedObject.selected.display as string,
      });

      callToast({ msg: "Delete Semester successfully", type: "success" });
      setSelectedObject(null);
      setConfirmMsg("");
      ctx.semesters.invalidate();
    } catch (err) {
      callToast({ msg: "SOMETHING_WENT_WRONG", type: "success" });
    }
  };

  const deleteCourse = trpc.courses.deleteCourse.useMutation();
  const handleDeleteCourse = async () => {
    if (!selectedObject) return;
    try {
      await deleteCourse.mutateAsync({
        name: selectedObject.selected.display,
      });

      callToast({ msg: "Delete Course successfully", type: "success" });
      setSelectedObject(null);
      router.replace("/cms/courses");
    } catch (err) {
      callToast({ msg: "SOMETHING_WENT_WRONG", type: "error" });
    }
  };
  const deleteSection = trpc.sections.deleteSection.useMutation();
  const handleDeleteSection = async () => {
    if (!selectedObject) return;
    try {
      await deleteSection.mutateAsync({
        name: selectedObject.selected.display,
      });

      callToast({ msg: "Delete Section successfully", type: "success" });
      setSelectedObject(null);
      router.replace({
        pathname: "/cms/courses/[courseId]/sections",
        query: { courseId: router.query.courseId },
      });
    } catch (err) {
      callToast({ msg: "SOMETHING_WENT_WRONG", type: "error" });
    }
  };

  const deleteLab = trpc.labs.deleteLab.useMutation();
  const handleDeleteLab = async () => {
    if (!selectedObject) return;
    try {
      await deleteLab.mutateAsync({
        name: selectedObject.selected.display,
      });

      callToast({ msg: "Delete Lab successfully", type: "success" });
      if (type === "lab-outside") {
        await ctx.labs.invalidate();
      } else {
        await router.replace({
          pathname: "/cms/courses/[courseId]/labs",
          query: { courseId: router.query.courseId },
        });
      }

      setSelectedObject(null);
    } catch (err) {
      callToast({ msg: "SOMETHING_WENT_WRONG", type: "error" });
    }
  };

  const deleteTask = trpc.tasks.deleteTask.useMutation();
  const handleDeleteTask = async () => {
    if (!selectedObject) return;
    try {
      await deleteTask.mutateAsync({
        id: selectedObject.selected.id,
      });

      if (type === "task-outside") {
        await ctx.tasks.invalidate();
      } else {
        await router.replace({
          pathname: "/cms/tasks",
        });
      }

      callToast({ msg: "Delete Task successfully", type: "success" });
      setSelectedObject(null);
    } catch (err) {
      callToast({ msg: "SOMETHING_WENT_WRONG", type: "error" });
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
    if (type.startsWith("lab")) {
      handleDeleteLab();
    }
    if (type.startsWith("task")) {
      handleDeleteTask();
    }
  };

  interface ListItem {
    name: string;
    data: ListItem[];
  }

  const RecursiveList = ({ items }: { items: ListItem[] }) => {
    if (items.length === 0) return null;

    return (
      <ul className="pl-8 list-disc">
        {items.map((item, index) => (
          <ListItem key={index} name={item.name} data={item.data} />
        ))}
      </ul>
    );
  };

  const ListItem = ({ name, data }: ListItem) => {
    return (
      <li key={name}>
        {name}
        {data && data.length > 0 && <RecursiveList items={data} />}
      </li>
    );
  };

  type = type === "lab-inside" || type === "lab-outside" ? "lab" : type;

  return (
    <Modal
      title={`Delete ${type}`}
      description={
        <>
          Are you sure to delete {type}{" "}
          <span className="text-lg font-bold">
            &ldquo;{selectedObject?.selected.display}&rdquo;
          </span>
          ? All of these following related items will be deleted
        </>
      }
      isOpen={!!selectedObject}
      onClose={() => setSelectedObject(null)}
      className="flex max-h-[90%] flex-col md:w-[40rem]"
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
          {!!fetchData?.object && (
            <ul className="list-disc list-inside">
              <RecursiveList items={fetchData?.object} />
            </ul>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-4">
        <input
          value={confirmMsg}
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setConfirmMsg(e.target.value)
          }
          className="w-full p-2 border rounded-md outline-none border-sand-6 bg-sand-1"
          placeholder={`Type "${selectedObject?.selected.display}" to confirm`}
        />

        <Button
          disabled={confirmMsg !== selectedObject?.selected.display}
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
