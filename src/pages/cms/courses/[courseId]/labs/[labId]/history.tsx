import { useMemo, useState } from "react";
import Table from "~/components/Common/Table";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import {
  type PaginationState,
  createColumnHelper,
} from "@tanstack/react-table";
import LabLayout from "~/Layout/LabLayout";
import dayjs from "dayjs";

interface HistoryRow {
  action: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

function LabHistory() {
  const router = useRouter();
  const labId = router.query.labId as string;

  const lab = trpc.labs.getLabById.useQuery(
    { id: labId },
    {
      enabled: !!labId,
    }
  );

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex, pageSize } = pagination;

  const history = trpc.labs.getLabHistoryPagination.useQuery(
    {
      labId: labId as string,
      limit: pageSize,
      page: pageIndex,
    },
    {
      enabled: !!labId,
    }
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
    <LabLayout title={lab.data?.name as string} isLoading={lab.isLoading}>
      <Table
        data={history.data?.labHistory ?? []}
        pageCount={history.data?.pageCount ?? 0}
        columns={columns}
        defaultSortingState={{ id: "created_at", desc: true }}
        className="mt-4"
        onPaginationChange={setPagination}
        {...{ pagination }}
      />
    </LabLayout>
  );
}

export default LabHistory;
