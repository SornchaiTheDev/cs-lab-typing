import { useMemo } from "react";
import Table from "~/components/Common/Table";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import { createColumnHelper } from "@tanstack/react-table";
import SectionLayout from "~/Layout/SectionLayout";

interface HistoryRow {
  action: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

function TaskHistory() {
  const router = useRouter();
  const sectionId = parseInt(router.query.sectionId as string);

  const section = trpc.sections.getSectionById.useQuery({ id: sectionId });

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
    <SectionLayout
      title={section.data?.name as string}
      isLoading={section.isLoading}
    >
      <Table
        data={section.data?.history ?? []}
        columns={columns}
        defaultSortingState={{ id: "created_at", desc: true }}
        className="mt-4"
      />
    </SectionLayout>
  );
}

export default TaskHistory;
