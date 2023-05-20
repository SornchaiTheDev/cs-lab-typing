import CourseLayout from "~/Layout/CourseLayout";
import ModalWithButton from "~/components/Common/ModalWithButton";
import Table from "~/components/Common/Table";
import { AddLabSchema, type TAddLabSchema } from "~/forms/LabSchema";
import { Icon } from "@iconify/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Forms from "~/components/Forms";
import { trpc } from "~/helpers";
import toast from "react-hot-toast";
import Toast from "~/components/Common/Toast";
import { TRPCClientError } from "@trpc/client";
import type { labs } from "@prisma/client";
import { useDeleteAffectStore } from "~/store";
import DeleteAffect from "~/components/DeleteAffect";
import Modal from "~/components/Common/Modal";
import Button from "~/components/Common/Button";
interface LabsRow {
  id: string;
  name: string;
  tags: string[];
}

function Labs() {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const [isShow, setIsShow] = useState(false);

  const columnHelper = createColumnHelper<LabsRow>();
  const router = useRouter();

  const { courseId } = router.query;
  const course = trpc.courses.getCourseById.useQuery({
    id: parseInt(courseId as string),
  });

  const allLabs = trpc.labs.getLabPagination.useQuery({
    page: 1,
    limit: 10,
    courseId: parseInt(courseId as string),
  });

  const addLabMutation = trpc.labs.createLab.useMutation();
  const addLab = async (formData: TAddLabSchema) => {
    try {
      const lab = await addLabMutation.mutateAsync({
        ...formData,
        courseId: parseInt(courseId as string),
      });
      if (lab) {
        await allLabs.refetch();
        toast.custom((t) => (
          <Toast {...t} msg="Added lab successfully" type="success" />
        ));
        setIsShow(false);
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        toast.custom((t) => <Toast {...t} msg={errMsg} type="error" />);
      }
    }
  };

  const tags = trpc.tags.getTags.useQuery();

  const columns = useMemo<ColumnDef<LabsRow, string | (string | labs)[]>[]>(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (props) => {
          console.log(props);
          return (
            <Link
              href={{
                pathname: router.pathname + "/[labId]",
                query: { ...router.query, labId: props.row.original.id },
              }}
            >
              {props.getValue() as string}
            </Link>
          );
        },
        size: 100,
      },
      {
        header: "Tags",
        accessorKey: "tags",
        size: 60,
        cell: (props) => {
          const tags = props.getValue() as labs[];
          return tags.map(({ name }) => name).join(",");
        },
      },
      columnHelper.display({
        id: "actions",
        header: "Delete",
        cell: (props) => (
          <button
            onClick={() => {
              setSelectedObj({
                selected: props.row.original.name,
                type: "lab",
              });
            }}
            className="rounded-xl text-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </button>
        ),
        size: 50,
      }),
    ],
    [columnHelper]
  );

  return (
    <>
      {selectedObj && <DeleteAffect type="lab-outside" />}
      <Modal
        isOpen={isShow}
        onClose={() => setIsShow(false)}
        title="Add Lab"
        className="flex flex-col gap-4 md:w-[40rem]"
      >
        <Forms
          schema={AddLabSchema}
          onSubmit={addLab}
          confirmBtn={{
            title: `Add Lab`,
            icon: "solar:checklist-minimalistic-line-duotone",
          }}
          fields={[
            {
              label: "name",
              title: "Name",
              type: "text",
            },
            {
              label: "tags",
              title: "Tags",
              type: "multiple-search",
              canAddItemNotInList: true,
              optional: true,
              options: tags.data?.map(({ name }) => name) ?? [],
              value: [],
            },
            {
              label: "isDisabled",
              title: "Disabled",
              type: "checkbox",
              value: false,
            },
          ]}
        />
      </Modal>
      <CourseLayout
        title={course.data?.name as string}
        isLoading={course.isLoading}
      >
        <Table className="mt-6" data={allLabs.data ?? []} columns={columns}>
          <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
            <Button
              onClick={() => setIsShow(true)}
              icon="solar:checklist-minimalistic-line-duotone"
              className="bg-sand-12  text-sand-1 shadow active:bg-sand-11"
            >
              Add Lab
            </Button>
          </div>
        </Table>
      </CourseLayout>
    </>
  );
}

export default Labs;
