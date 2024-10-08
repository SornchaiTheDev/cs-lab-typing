import { useEffect, useMemo, useState } from "react";
import Table from "~/components/Common/Table";
import type { PaginationState } from "@tanstack/react-table";
import TimePickerRange from "~/components/Forms/TimePickerRange";
import { Icon } from "@iconify/react";
import RangePicker from "~/components/Forms/DatePicker/RangePicker";
import { sanitizeFilename, trpc } from "~/utils";
import type { DateRange } from "react-day-picker";
import dayjs from "dayjs";
import SectionLayout from "~/layouts/SectionLayout";
import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import { createTrpcHelper } from "~/utils/createTrpcHelper";
import { TRPCError } from "@trpc/server";
import { debounce } from "lodash";
import { sectionLogsColumns } from "~/columns";

const today = new Date();

function Logger() {
  const router = useRouter();
  const { sectionId } = router.query;

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(today.setHours(0, 0, 0, 0)),
    to: new Date(today.setHours(23, 59, 59, 999)),
  });

  const section = trpc.sections.getLabSet.useQuery(
    {
      sectionId: sectionId as string,
    },
    {
      enabled: !!sectionId,
    }
  );

  const labLogsCSV = trpc.loggers.exportLabLoggerCSV.useQuery(
    {
      date: dateRange,
      sectionId: sectionId as string,
    },
    {
      enabled: !!sectionId && !!dateRange,
    }
  );

  const exportCSV = async () => {
    let csvString = "Type,Date,Email / Username,TaskId,SectionId,IP Address\n";

    labLogsCSV.data?.forEach((log) => {
      csvString += `${log.type},${dayjs(log.date).format(
        "DD/MM/YYYY HH:mm:ss"
      )},${log.user.email},${log.taskId},${log.sectionId},${log.ip_address}\n`;
    });

    const startDate = dayjs(dateRange.from);
    const endDate = dayjs(dateRange.to);
    const csvBlob = new Blob([csvString], { type: "text/csv" });
    let fileName = `${startDate.format("DD_MM_YYYY")}_${endDate.format(
      "DD_MM_YYYY"
    )}_${sanitizeFilename(section.data?.name as string)}_lab_log`;
    if (startDate.diff(endDate, "day") === 0) {
      fileName = `${startDate.format("DD_MM_YYYY")}_${sanitizeFilename(
        section.data?.name as string
      )}_lab_log`;
    }

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(csvBlob);
    link.download = fileName;
    link.click();
  };

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex, pageSize } = pagination;

  const [searchString, setSearchString] = useState("");

  const handleOnSearchChange = (value: string) => {
    setSearchString(value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchLabLog = useMemo(() => debounce(() => labLogs.refetch(), 500), []);

  useEffect(() => {
    fetchLabLog();
  }, [searchString, dateRange, fetchLabLog, pagination]);

  const labLogs = trpc.loggers.getLabLog.useQuery(
    {
      limit: pageSize,
      page: pageIndex,
      date: dateRange,
      sectionId: sectionId as string,
      search: searchString,
    },
    {
      enabled: false,
    }
  );

  return (
    <SectionLayout
      title={section.data?.name as string}
      isLoading={section.isLoading}
    >
      <Table
        isLoading={labLogs.isLoading}
        data={labLogs.data?.logger ?? []}
        columns={sectionLogsColumns}
        defaultSortingState={{ id: "date", desc: true }}
        pageCount={labLogs.data?.pageCount ?? 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        {...{ searchString }}
        onSearchChange={handleOnSearchChange}
      >
        <div className="flex flex-col items-end gap-2">
          <button
            onClick={exportCSV}
            className="flex h-fit w-fit items-center gap-2 rounded-lg bg-sand-12 p-2 text-sand-1 shadow active:bg-sand-11"
          >
            <Icon icon="solar:document-text-line-duotone" />
            Export as CSV
          </button>

          <div className="flex flex-col justify-between gap-2 md:flex-row">
            <RangePicker value={dateRange} onChange={setDateRange} />

            <TimePickerRange
              date={dateRange}
              onApply={({ from, to }) => {
                setDateRange({
                  from,
                  to,
                });
              }}
            />
          </div>
        </div>
      </Table>
    </SectionLayout>
  );
}

export default Logger;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper } = await createTrpcHelper({ req, res });
  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
    });
    await helper.sections.getSectionById.fetch({
      sectionId: sectionId as string,
    });
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
