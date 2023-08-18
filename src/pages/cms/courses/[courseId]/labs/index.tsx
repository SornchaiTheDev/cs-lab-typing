import CourseLayout from "~/Layout/CourseLayout";
import Table from "~/components/Common/Table";
import { AddLabSchema, type TAddLabSchema } from "~/schemas/LabSchema";
import { Icon } from "@iconify/react";
import { type ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Forms from "~/components/Forms";
import { trpc } from "~/helpers";
import { TRPCClientError } from "@trpc/client";
import type { labs } from "@prisma/client";
import { useDeleteAffectStore } from "~/store";
import DeleteAffect from "~/components/DeleteAffect";
import Modal from "~/components/Common/Modal";
import Button from "~/components/Common/Button";
import { callToast } from "~/services/callToast";
import { useSession } from "next-auth/react";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";
interface LabsRow {
  id: number;
  name: string;
  tags: string[];
}

function Labs() {
  const { data: session } = useSession();
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const [isShow, setIsShow] = useState(false);

  const columnHelper = createColumnHelper<LabsRow>();
  const router = useRouter();

  const { courseId } = router.query;
  const course = trpc.courses.getCourseById.useQuery(
    {
      id: courseId as string,
    },
    {
      enabled: !!courseId,
    }
  );

  const isTeacher = session?.user?.roles.split(",").includes("TEACHER");

  const allLabs = trpc.labs.getAllLabInCourse.useQuery(
    {
      courseId: courseId as string,
    },
    {
      enabled: !!courseId,
    }
  );

  const addLabMutation = trpc.labs.createLab.useMutation();
  const addLab = async (formData: TAddLabSchema) => {
    try {
      const lab = await addLabMutation.mutateAsync({
        ...formData,
        courseId: courseId as string,
      });
      if (lab) {
        await allLabs.refetch();
        callToast({
          msg: "Added lab successfully",
          type: "success",
        });

        setIsShow(false);
      }
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        callToast({ msg: errMsg, type: "error" });
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
                selected: {
                  display: props.row.original.name,
                  id: props.row.original.id,
                },
                type: "lab-outside",
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
    [columnHelper, router, setSelectedObj]
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
              options: tags.data?.map(({ name }) => ({
                label: name,
                value: name,
              })),
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
        <Table data={allLabs.data ?? []} columns={columns}>
          {isTeacher && (
            <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
              <Button
                onClick={() => setIsShow(true)}
                icon="solar:checklist-minimalistic-line-duotone"
                className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
              >
                Add Lab
              </Button>
            </div>
          )}
        </Table>
      </CourseLayout>
    </>
  );
}

export default Labs;

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { req, res } = ctx;
  const { helper } = await createTrpcHelper({ req, res });
  const { courseId } = ctx.query;
  try {
    await helper.courses.getCourseById.fetch({
      id: courseId as string,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      if (err.message === "NOT_FOUND") {
        return {
          notFound: true,
        };
      }
    }
  }
  return {
    props: {},
  };
};
