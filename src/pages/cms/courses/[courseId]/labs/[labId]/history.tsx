import { useMemo, useState } from "react";
import Table from "~/components/Common/Table";
import { getHighestRole, trpc } from "~/utils";
import { useRouter } from "next/router";
import {
  type PaginationState,
  createColumnHelper,
} from "@tanstack/react-table";
import LabLayout from "~/Layout/LabLayout";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import type { GetServerSideProps, GetServerSidePropsContext } from "next";
import { createTrpcHelper } from "~/utils/createTrpcHelper";
import { TRPCError } from "@trpc/server";

interface HistoryRow {
  action: string;
  created_at: string;
  user: {
    full_name: string;
  };
}

function LabHistory() {
  const router = useRouter();
  const { data: session } = useSession();
  const { labId, courseId } = router.query;

  const lab = trpc.labs.getLabById.useQuery(
    { labId: labId as string, courseId: courseId as string },
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
      courseId: courseId as string,
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
        cell: (props) => (props.getValue() ? props.getValue().full_name : null),
      }),
      {
        header: "Action",
        accessorKey: "action",
      },
    ],
    [columnHelper]
  );

  const role = getHighestRole(session?.user?.roles ?? []);
  const isStudent = role === "STUDENT";

  return (
    <LabLayout
      title={lab.data?.name as string}
      isLoading={lab.isLoading}
      canAccessToSuperUserMenus={!isStudent}
    >
      <Table
        isLoading={history.isLoading}
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

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const { req, res } = ctx;
  const { helper } = await createTrpcHelper({ req, res });
  const { courseId } = ctx.query;
  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
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
