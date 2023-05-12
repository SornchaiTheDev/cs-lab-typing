import { useMemo, useState } from "react";
import Layout from "@/Layout";
import Table from "@/components/Common/Table";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import TimePickerRange from "@/components/TimePickerRange";
import { Icon } from "@iconify/react";
import RangePicker from "@/components/Forms/DatePicker/RangePicker";
import { trpc } from "@/helpers/trpc";
import { DateRange } from "react-day-picker";

interface LoggerRow {
  type: string;
  date: string;
  username: string;
  ip: string;
}

const Type = ({ type }: { type: string }) => {
  return (
    <div className="flex justify-center w-full">
      <button
        className={clsx(
          "px-2 text-sm font-medium rounded-md",
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
    from: today,
    to: today,
  });

  const authLogs = trpc.logger.getAuthLog.useQuery({
    limit: 10,
    page: 1,
    date: dateRange,
  });

  const columns = useMemo<ColumnDef<LoggerRow, string>[]>(
    () => [
      {
        header: "Type",
        accessorKey: "type",
        cell: (props) => <Type type={props.getValue()} />,
        size: 40,
      },
      {
        header: "Date",
        accessorKey: "date",
      },
      {
        header: "Email / Username",
        accessorKey: "user.email",
      },
      {
        header: "IP Address",
        accessorKey: "ip_address",
      },
    ],
    []
  );

  const exportCSV = () => {
    let csvString = "Type,Date,Email / Username,IP Address\n";
    authLogs.data?.forEach((log) => {
      csvString += `${log.type},${log.date},${log.user.email},${log.ip_address}\n`;
    });
    const csvBlob = new Blob([csvString], { type: "text/csv" });

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(csvBlob);
    link.download = new Date().toISOString() + "-auth-log.csv";
    link.click();
  };

  return (
    <Layout title="Logger">
      <Table
        data={authLogs.data ?? []}
        columns={columns}
        defaultSortingState={{ id: "date", desc: true }}
      >
        <div className="flex justify-end p-2 ">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 p-2 rounded-lg shadow bg-sand-12 text-sand-1 active:bg-sand-11"
          >
            <Icon icon="solar:document-text-line-duotone" />
            Export as CSV
          </button>
        </div>
        <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
          <RangePicker value={dateRange} onChange={setDateRange} />

          <TimePickerRange
            date={dateRange}
            onApply={({ from, to }) => {
              console.log(from, to);
              setDateRange({
                from,
                to,
              });
            }}
          />
        </div>
      </Table>
    </Layout>
  );
}

export default Logger;
