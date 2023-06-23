import { useMemo, useState } from "react";
import Table from "~/components/Common/Table";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import {
  type PaginationState,
  createColumnHelper,
} from "@tanstack/react-table";
import SectionLayout from "~/Layout/SectionLayout";
import dayjs from "dayjs";

interface HistoryRow {
  action: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

function SectionHistory() {
  const router = useRouter();
  const { sectionId } = router.query;

  const section = trpc.sections.getSectionById.useQuery(
    {
      id: sectionId as string,
    },
    {
      enabled: !!sectionId,
    }
  );

  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const history = trpc.sections.getSectionHistoryPagination.useQuery(
    {
      sectionId: sectionId as string,
      limit: pageSize,
      page: pageIndex,
    },
    {
      enabled: !!sectionId,
    }
  );

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const columnHelper = createColumnHelper<HistoryRow>();

  const columns = useMemo(
    () => [
      {
        header: "Date/Time",
        accessorKey: "created_at",
        cell: (props) =>
          dayjs(props.getValue() as unknown as Date).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
      },
      columnHelper.accessor("user", {
        header: "Username",
        cell: (props) => props.getValue().full_name,
      }),
      {
        header: "Action",
        accessorKey: "action",
      },
    ],
    [columnHelper]
  );

  return (
    <SectionLayout
      title={section.data?.name as string}
      isLoading={section.isLoading}
    >
      <Table
        data={history.data?.sectionHistory ?? []}
        columns={columns}
        defaultSortingState={{ id: "created_at", desc: true }}
        className="mt-4"
        onPaginationChange={setPagination}
        pageCount={history.data?.pageCount ?? 0}
        {...{ pagination }}
      />
    </SectionLayout>
  );
}

export default SectionHistory;
