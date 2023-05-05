import { useMemo } from "react";
import LabLayout from "@/Layout/LabLayout";
import Table from "@/components/Table";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import RangePicker from "@/components/DatePicker/RangePicker";
import TimePickerRange from "@/components/TimePickerRange";
import { Icon } from "@iconify/react";

interface LoggerRow {
  date: string;
  username: string;
  action: string;
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

function History() {
  const data: LoggerRow[] = useMemo(
    () => [
      {
        date: "2022-09-16 12:31:22+07:00",
        username: "lalita.b@ku.th",
        action: "Create Course",
      },
    ],
    []
  );

  const columns = useMemo<ColumnDef<LoggerRow, string>[]>(
    () => [
      {
        header: "Date/Time",
        accessorKey: "date",
      },
      {
        header: "Username",
        accessorKey: "username",
      },
      {
        header: "Action",
        accessorKey: "action",
      },
    ],
    []
  );

  const exportCSV = () => {
    //TODO
  };

  return (
    <LabLayout title="Test">
      <Table
        data={data}
        columns={columns}
        defaultSortingState={{ id: "date", desc: true }}
        className="mt-4 "
      >
        <div className="flex justify-end p-2">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 p-2 rounded-lg shadow bg-sand-12 text-sand-1 active:bg-sand-11"
          >
            <Icon icon="solar:document-text-line-duotone" />
            Export as CSV
          </button>
        </div>
        <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
          <RangePicker onChange={(range) => {}} />
          <TimePickerRange onApply={(startTime, endTime) => {}} />
        </div>
      </Table>
    </LabLayout>
  );
}

export default History;
