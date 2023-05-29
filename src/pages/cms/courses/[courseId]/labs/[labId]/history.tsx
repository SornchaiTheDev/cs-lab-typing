import { useMemo } from "react";
import Table from "~/components/Common/Table";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import { createColumnHelper } from "@tanstack/react-table";
import SectionLayout from "~/Layout/SectionLayout";
import LabLayout from "~/Layout/LabLayout";

interface HistoryRow {
  action: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

function LabHistory() {
  const router = useRouter();
  const labId = parseInt(router.query.labId as string);

  const lab = trpc.labs.getLabById.useQuery({ id: labId });

  const columnHelper = createColumnHelper<HistoryRow>();

  const columns = useMemo(
    () => [
      {
        header: "Date/Time",
        accessorKey: "created_at",
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
        data={lab.data?.history ?? []}
        columns={columns}
        defaultSortingState={{ id: "created_at", desc: true }}
        className="mt-4"
      />
    </LabLayout>
  );
}

export default LabHistory;
