import { useMemo } from "react";
import Table from "~/components/Common/Table";
import InsideTaskLayout from "~/Layout/InsideTaskLayout";
import { useSession } from "next-auth/react";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import { createColumnHelper } from "@tanstack/react-table";
import dayjs from "dayjs";

interface HistoryRow {
  action: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

function TaskHistory() {
  const { data: session } = useSession();
  const router = useRouter();
  const taskId = parseInt(router.query.taskId as string);

  const task = trpc.tasks.getTaskById.useQuery({ id: taskId });

  const isAdmin = session?.user?.roles.includes("ADMIN") ?? false;
  const isOwner = task.data?.owner.full_name === session?.user?.full_name;

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
    <InsideTaskLayout
      title={task.data?.name ?? ""}
      isLoading={task.isLoading}
      canAccessToSettings={isAdmin || isOwner}
    >
      <Table
        data={task.data?.history ?? []}
        columns={columns}
        defaultSortingState={{ id: "created_at", desc: true }}
        className="mt-4"
      />
    </InsideTaskLayout>
  );
}

export default TaskHistory;
