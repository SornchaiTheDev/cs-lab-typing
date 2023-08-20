import SemesterLayout from "~/Layout/SemesterLayout";
import Table from "~/components/Common/Table";
import { type TSemesterSchema, SemesterSchema } from "~/schemas/SemesterSchema";
import { Icon } from "@iconify/react";
import {
  type ColumnDef,
  createColumnHelper,
  type PaginationState,
} from "@tanstack/react-table";
import { useEffect, useMemo, useState } from "react";
import Forms from "~/components/Forms";
import Modal from "~/components/Common/Modal";
import Button from "~/components/Common/Button";
import { trpc } from "~/helpers";
import dayjs from "dayjs";
import EditSemester from "~/features/Semesters/EditSemester";
import { useDeleteAffectStore } from "~/store";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import type { semesters } from "@prisma/client";
import { debounce } from "lodash";

function Semesters() {
  const columnHelper = createColumnHelper<semesters>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [searchString, setSearchString] = useState("");

  const handleOnSearchChange = (value: string) => {
    setSearchString(value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const fetchSemester = useMemo(
    () => debounce(() => semesters.refetch(), 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchSemester();
  }, [searchString, fetchSemester]);

  const { pageIndex, pageSize } = pagination;

  const semesters = trpc.semesters.getSemestersPagination.useQuery(
    {
      page: pageIndex,
      limit: pageSize,
      search: searchString,
    },
    { enabled: false }
  );
  const addSemesterMutation = trpc.semesters.createSemester.useMutation();

  const addSemester = async (formData: TSemesterSchema) => {
    const { startDate, term, year } = formData;
    try {
      await addSemesterMutation.mutateAsync({ startDate, term, year });
      callToast({
        msg: "Added users successfully",
        type: "success",
      });
      await semesters.refetch();
      setIsModalOpen(false);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errorMsg = err.message;
        callToast({
          msg: errorMsg,
          type: "error",
        });
      }
    }
  };

  const columns = useMemo<ColumnDef<semesters, string>[]>(
    () => [
      {
        header: "Year",
        accessorKey: "year",
      },
      {
        header: "Term",
        accessorKey: "term",
      },
      {
        header: "Start Date",
        accessorKey: "startDate",
        cell: (props) => (
          <h4>{dayjs(props.getValue()).format("DD/MM/YYYY")}</h4>
        ),
      },
      columnHelper.display({
        id: "actions",
        header: "Edit",
        size: 50,
        cell: (props) => (
          <button
            onClick={() =>
              setSelectedObj({
                selected: {
                  display: `${props.row.getValue("year")}/${props.row.getValue(
                    "term"
                  )}`,
                  id: props.row.original.id,
                },
                type: "semester",
              })
            }
            className="rounded-xl text-xl text-sand-12"
          >
            <Icon icon="solar:pen-2-line-duotone" />
          </button>
        ),
      }),
    ],
    [columnHelper, setSelectedObj]
  );

  return (
    <>
      {selectedObj && <EditSemester />}
      <Modal
        title="Add Semester"
        isOpen={isModalOpen}
        className="flex w-[95%] flex-col gap-4 md:w-[40rem]"
        onClose={() => setIsModalOpen(false)}
      >
        <Forms
          confirmBtn={{
            title: "Add Semester",
            icon: "solar:calendar-line-duotone",
          }}
          schema={SemesterSchema}
          onSubmit={addSemester}
          fields={[
            {
              label: "year",
              title: "Year",
              type: "text",
            },
            {
              label: "term",
              title: "Term",
              type: "select",
              options: ["First", "Second", "Summer"],
            },
            {
              label: "startDate",
              title: "Start Date",
              type: "date",
            },
          ]}
        />
      </Modal>
      <SemesterLayout title="Semesters">
        <Table
          isLoading={semesters.isLoading}
          className="mt-6"
          data={semesters.data?.semesters ?? []}
          pageCount={semesters.data?.pageCount ?? 0}
          columns={columns}
          {...{ pagination, searchString }}
          onPaginationChange={setPagination}
          onSearchChange={handleOnSearchChange}
        >
          <Button
            onClick={() => setIsModalOpen(true)}
            icon="solar:calendar-line-duotone"
            className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
          >
            Add Semester
          </Button>
        </Table>
      </SemesterLayout>
    </>
  );
}

export default Semesters;
