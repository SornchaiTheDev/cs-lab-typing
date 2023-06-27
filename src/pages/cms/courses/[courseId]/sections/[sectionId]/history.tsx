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
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { TRPCError } from "@trpc/server";

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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex, pageSize } = pagination;

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

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper, user } = await createTrpcHelper({ req, res });
  const { role, full_name } = user;
  const { courseId, sectionId } = query;

  if (role === "STUDENT" || !courseId) {
    return {
      notFound: true,
    };
  }

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
