import { useMemo, useState } from "react";
import Layout from "~/Layout";
import Table from "~/components/Common/Table";
import type { ColumnDef, PaginationState } from "@tanstack/react-table";
import clsx from "clsx";
import TimePickerRange from "~/components/TimePickerRange";
import { Icon } from "@iconify/react";
import RangePicker from "~/components/Forms/DatePicker/RangePicker";
import { trpc } from "~/helpers";
import type { DateRange } from "react-day-picker";
import dayjs from "dayjs";

interface LoggerRow {
  type: string;
  date: string;
  username: string;
  ip: string;
}

const Type = ({ type }: { type: string }) => {
  return (
    <div className="flex w-full justify-center">
      <button
        className={clsx(
          "rounded-md px-2 text-sm font-medium",
          type === "LOGIN" && "bg-lime-3 text-lime-9",
          type === "LOGOUT" && "bg-amber-3 text-amber-9",
          type === "FAILED-LOGIN" && "bg-red-3 text-red-9"
        )}
      >
        {type}
      </button>
    </div>
  );
};

const today = new Date();

function Logger() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(today.setHours(0, 0, 0, 0)),
    to: new Date(today.setHours(23, 59, 59, 999)),
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex, pageSize } = pagination;
  const authLogs = trpc.loggers.getAuthLog.useQuery({
    page: pageIndex,
    limit: pageSize,
    date: dateRange,
  });

  const columns = useMemo<ColumnDef<LoggerRow, string | { email: string }>[]>(
    () => [
      {
        header: "Type",
        accessorKey: "type",
        cell: (props) => <Type type={props.getValue() as string} />,
        size: 40,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (props) =>
          dayjs(props.getValue() as unknown as Date).format(
            "DD/MM/YYYY HH:mm:ss"
          ),
      },
      {
        header: "Email / Username",
        accessorKey: "user.email",
        cell: (props) => <span>{props.getValue() as string}</span>,
      },
      {
        header: "IP Address",
        accessorKey: "ip_address",
      },
    ],
    []
  );

  const authLogsCSV = trpc.loggers.exportAuthLoggerCSV.useQuery(
    {
      date: dateRange,
    },
    {
      enabled: !!dateRange,
    }
  );

  const exportCSV = () => {
    let csvString = "Type,Date,Email / Username,IP Address\n";
    authLogsCSV.data?.forEach((log) => {
      csvString += `${log.type},${dayjs(log.date).format(
        "DD/MM/YYYY HH:mm:ss"
      )},${log.user.email},${log.ip_address}\n`;
    });

    const startDate = dayjs(dateRange.from);
    const endDate = dayjs(dateRange.to);
    const csvBlob = new Blob([csvString], { type: "text/csv" });
    let fileName = `${startDate.format("DD_MM_YYYY")}_${endDate.format(
      "DD_MM_YYYY"
    )}_auth_log.csv`;
    if (startDate.diff(endDate, "day") === 0) {
      fileName = `${startDate.format("DD_MM_YYYY")}_auth_log.csv`;
    }

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(csvBlob);
    link.download = fileName;
    link.click();
  };

  return (
    <Layout title="Logger">
      <Table
        isLoading={authLogs.isLoading}
        data={authLogs.data?.authLogger ?? []}
        columns={columns}
        defaultSortingState={{ id: "date", desc: true }}
        pageCount={authLogs.data?.pageCount ?? 0}
        onPaginationChange={setPagination}
        {...{ pagination }}
      >
        <div className="flex flex-col items-end p-2 ">
          <button
            onClick={exportCSV}
            className="flex items-center w-fit gap-2 rounded-lg bg-sand-12 p-2 text-sand-1 shadow active:bg-sand-11"
          >
            <Icon icon="solar:document-text-line-duotone" />
            Export as CSV
          </button>
          <div className="flex flex-col justify-between gap-2 mt-2 md:flex-row">
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
    </Layout>
  );
}

export default Logger;
