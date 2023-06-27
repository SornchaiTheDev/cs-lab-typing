import SectionLayout from "~/Layout/SectionLayout";
import React, { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "~/helpers";
import Table from "~/components/Common/Table";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { callToast } from "~/services/callToast";
import { TRPCClientError } from "@trpc/client";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import type { LabStatus, labs } from "@prisma/client";
import Button from "~/components/Common/Button";
import Modal from "~/components/Common/Modal";
import clsx from "clsx";
import Skeleton from "~/components/Common/Skeleton";
import Select from "~/components/Forms/Select";
import Alert from "~/components/Common/Alert";
import { TRPCError } from "@trpc/server";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";

interface AddLabModalProps {
  onClose: () => void;
}

const AddLabModal = ({ onClose }: AddLabModalProps) => {
  const router = useRouter();

  const { courseId, sectionId } = router.query;

  const ctx = trpc.useContext();

  const labs = trpc.labs.getAllLabInCourse.useQuery(
    {
      courseId: courseId as string,
    },
    {
      enabled: !!courseId,
    }
  );

  const addLab = trpc.sections.addLab.useMutation();
  const addLabToSection = async (labId: number) => {
    try {
      await addLab.mutateAsync({ sectionId: sectionId as string, labId });
      labs.refetch();
      await ctx.sections.invalidate();
      callToast({
        msg: "Add Lab to Section successfully",
        type: "success",
      });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({
          msg: err.message,
          type: "error",
        });
      }
    }
  };

  const removeTask = trpc.sections.deleteLab.useMutation();
  const deleteLabFromSection = async (labId: number) => {
    try {
      await removeTask.mutateAsync({ sectionId: sectionId as string, labId });
      await labs.refetch();
      await ctx.sections.invalidate();
      callToast({
        msg: "Delete Task from Lab successfully",
        type: "success",
      });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({
          msg: err.message,
          type: "error",
        });
      }
    }
  };

  const handleOnClickAdd = ({
    labId,
    isAdded,
  }: {
    labId: number;
    isAdded: boolean;
  }) => {
    if (!isAdded) {
      return addLabToSection(labId);
    }
    deleteLabFromSection(labId);
  };

  return (
    <Modal
      isOpen
      onClose={onClose}
      title="Add Labs to Section"
      className="flex h-[90%] max-h-[90%] max-w-[60rem] flex-col gap-2 overflow-y-auto"
    >
      <div className="grid grid-cols-12 gap-4 overflow-y-auto px-2 py-4">
        {labs.isLoading
          ? new Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton
                  key={i}
                  height={"12rem"}
                  className="col-span-12 md:col-span-6"
                />
              ))
          : labs.data?.map(({ id, name, tags, sections }) => {
              const isAdded = sections.some(
                (section) => section.id === parseInt(sectionId as string)
              );
              return (
                <div
                  key={id}
                  className="relative col-span-12 flex h-[12rem] flex-col justify-end overflow-hidden rounded-lg border border-sand-6 bg-sand-4 shadow-lg hover:bg-sand-5 md:col-span-6"
                >
                  <button
                    onClick={() => handleOnClickAdd({ labId: id, isAdded })}
                    className={clsx(
                      "absolute right-2 top-2 flex w-fit items-center gap-2 rounded-xl p-2",
                      isAdded
                        ? "bg-lime-9 text-sand-1 hover:bg-lime-10"
                        : "bg-sand-7 text-sand-12 hover:bg-sand-8"
                    )}
                  >
                    {isAdded ? (
                      <Icon icon="tabler:check" />
                    ) : (
                      <Icon icon="tabler:plus" />
                    )}
                  </button>
                  <div className="flex flex-col gap-2 p-2">
                    <div className="flex gap-2">
                      {tags.map(({ name }) => (
                        <div
                          key={name}
                          className="w-fit rounded-lg bg-lime-9 px-2 text-white"
                        >
                          {name}
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-sand-12">
                        {name}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
    </Modal>
  );
};

type LabWithStatus = labs & { status: string };

function LabSet() {
  const router = useRouter();
  const columnHelper = createColumnHelper<LabWithStatus>();

  const { sectionId } = router.query;

  const section = trpc.sections.getLabSet.useQuery(
    {
      id: sectionId as string,
    },
    {
      enabled: !!sectionId,
    }
  );

  const changeLabStatus = trpc.sections.updateLabStatus.useMutation();
  const updateLabStatus = useCallback(
    async (labId: number, status: LabStatus) => {
      try {
        await changeLabStatus.mutateAsync({
          labId,
          sectionId: sectionId as string,
          status,
        });
        await section.refetch();
        callToast({
          msg: "Update Lab Status successfully",
          type: "success",
        });
      } catch (err) {
        if (err instanceof TRPCClientError) {
          callToast({ msg: err.message, type: "error" });
        }
      }
    },
    [changeLabStatus, section, sectionId]
  );

  const [selectedLab, setSelectedLab] = useState<number | null>(null);

  const deleteLab = trpc.sections.deleteLab.useMutation();
  const deleteSelectRow = async () => {
    try {
      await deleteLab.mutateAsync({
        labId: selectedLab as number,
        sectionId: sectionId as string,
      });
      setSelectedLab(null);
      await section.refetch();
      callToast({
        msg: "Delete Lab from Section successfully",
        type: "success",
      });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };

  const columns = useMemo<ColumnDef<LabWithStatus, string>[]>(
    () => [
      {
        header: "Lab",
        accessorKey: "task",
        cell: (props) => {
          return (
            <Link
              href={{
                pathname: "/cms/courses/1/labs/[labId]",
                query: { labId: props.row.original.id },
              }}
            >
              {props.row.original.name as string}
            </Link>
          );
        },
      },

      columnHelper.display({
        id: "status",
        header: "Status",
        size: 40,
        cell: (props) => (
          <Select
            options={["ACTIVE", "READONLY", "DISABLED"]}
            value={props.row.original.status}
            onChange={(status) =>
              updateLabStatus(props.row.original.id, status as LabStatus)
            }
          />
        ),
      }),

      columnHelper.display({
        id: "actions",
        header: "Remove",
        cell: (props) => (
          <button
            onClick={() => setSelectedLab(props.row.original.id)}
            className="rounded-xl text-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </button>
        ),
        size: 50,
      }),
    ],
    [columnHelper, setSelectedLab, updateLabStatus]
  );

  const [newOrdered, setNewOrdered] = useState<labs[]>([]);
  const isOrderChanged = newOrdered.length > 0;
  const saveLabTasks = trpc.sections.updateLabOrder.useMutation();
  const handleOnSave = async () => {
    try {
      await saveLabTasks.mutateAsync({
        sectionId: sectionId as string,
        order: newOrdered.map(({ id }) => id),
      });
      await section.refetch();
      setNewOrdered([]);
      callToast({ msg: "Update Labs order successfully", type: "success" });
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };

  const [isShow, setIsShow] = useState(false);

  return (
    <>
      {isShow && <AddLabModal onClose={() => setIsShow(false)} />}
      <Alert
        type="lab"
        isOpen={!!selectedLab}
        onCancel={() => setSelectedLab(null)}
        onConfirm={deleteSelectRow}
      />
      <SectionLayout
        title={section.data?.name as string}
        isLoading={section.isLoading}
      >
        <Table
          data={section.data?.labs ?? []}
          columns={columns}
          className="mt-6"
          onDrag={(data) => setNewOrdered(data)}
          draggabled
        >
          <div className="flex justify-between p-4">
            <Button
              onClick={() => setIsShow(true)}
              icon="solar:checklist-minimalistic-line-duotone"
              className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
            >
              Add Lab
            </Button>
            {isOrderChanged && (
              <Button
                onClick={handleOnSave}
                icon="solar:diskette-line-duotone"
                className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
              >
                Save
              </Button>
            )}
          </div>
        </Table>
      </SectionLayout>
    </>
  );
}

export default LabSet;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper, user } = await createTrpcHelper({ req, res });
  const { full_name } = user;
  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      id: courseId as string,
    });
    const section = await helper.sections.getSectionById.fetch({
      id: sectionId as string,
    });

    if (
      !section?.instructors
        .map((user) => user.full_name)
        .includes(full_name as string)
    ) {
      return {
        notFound: true,
      };
    }
  } catch (err) {
    if (err instanceof TRPCError) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {},
  };
};
