import { useMemo } from "react";
import SectionLayout from "@/Layout/SectionLayout";
import Table from "@/components/Common/Table";
import { ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";
import RangePicker from "@/components/Forms/DatePicker/RangePicker";
import TimePickerRange from "@/components/TimePickerRange";
import { Icon } from "@iconify/react";

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

function SectionLog() {
  const data: LoggerRow[] = useMemo(
    () => [
      {
        type: "LOGIN",
        date: "2022-09-16 12:31:22+07:00",
        username: "lalita.b@ku.th",
        ip: "255.255.255.255",
      },
      {
        type: "LOGOUT",
        date: "2022-09-16 16:45:33+07:00",
        username: "john.doe@gmail.com",
        ip: "192.168.1.1",
      },
      {
        type: "LOGIN",
        date: "2022-09-17 08:12:01+07:00",
        username: "jane.smith@yahoo.com",
        ip: "10.0.0.1",
      },
      {
        type: "FAILED-LOGIN",
        date: "2022-09-17 10:21:15+07:00",
        username: "admin",
        ip: "172.16.0.1",
      },
      {
        type: "LOGOUT",
        date: "2022-09-17 14:30:59+07:00",
        username: "johndoe@example.com",
        ip: "10.0.0.2",
      },
      {
        type: "LOGIN",
        date: "2022-09-18 09:15:27+07:00",
        username: "bob.johnson@hotmail.com",
        ip: "192.168.0.1",
      },
      {
        type: "LOGOUT",
        date: "2022-09-18 15:20:45+07:00",
        username: "jane.smith@yahoo.com",
        ip: "10.0.0.1",
      },
      {
        type: "FAILED-LOGIN",
        date: "2022-09-19 11:59:10+07:00",
        username: "user123",
        ip: "172.16.0.2",
      },
      {
        type: "LOGIN",
        date: "2022-09-19 13:08:53+07:00",
        username: "johndoe@example.com",
        ip: "10.0.0.2",
      },
      {
        type: "LOGOUT",
        date: "2022-09-19 17:45:27+07:00",
        username: "bob.johnson@hotmail.com",
        ip: "192.168.0.1",
      },
      {
        type: "LOGIN",
        date: "2022-09-16 12:31:22+07:00",
        username: "lalita.b@ku.th",
        ip: "255.255.255.255",
      },
      {
        type: "LOGOUT",
        date: "2022-09-16 16:45:33+07:00",
        username: "john.doe@gmail.com",
        ip: "192.168.1.1",
      },
      {
        type: "LOGIN",
        date: "2022-09-17 08:12:01+07:00",
        username: "jane.smith@yahoo.com",
        ip: "10.0.0.1",
      },
      {
        type: "FAILED-LOGIN",
        date: "2022-09-17 10:21:15+07:00",
        username: "admin",
        ip: "172.16.0.1",
      },
      {
        type: "LOGOUT",
        date: "2022-09-17 14:30:59+07:00",
        username: "johndoe@example.com",
        ip: "10.0.0.2",
      },
      {
        type: "LOGIN",
        date: "2022-09-18 09:15:27+07:00",
        username: "bob.johnson@hotmail.com",
        ip: "192.168.0.1",
      },
      {
        type: "LOGOUT",
        date: "2022-09-18 15:20:45+07:00",
        username: "jane.smith@yahoo.com",
        ip: "10.0.0.1",
      },
      {
        type: "FAILED-LOGIN",
        date: "2022-09-19 11:59:10+07:00",
        username: "user123",
        ip: "172.16.0.2",
      },
      {
        type: "LOGIN",
        date: "2022-09-19 13:08:53+07:00",
        username: "johndoe@example.com",
        ip: "10.0.0.2",
      },
      {
        type: "LOGOUT",
        date: "2022-09-19 17:45:27+07:00",
        username: "bob.johnson@hotmail.com",
        ip: "192.168.0.1",
      },
    ],
    []
  );

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
        accessorKey: "username",
      },
      {
        header: "IP Address",
        accessorKey: "ip",
      },
    ],
    []
  );

  const exportCSV = () => {
    //TODO
  };

  return (
    <SectionLayout title="12 (F 15 - 17)">
      <Table
        data={data}
        columns={columns}
        defaultSortingState={{ id: "date", desc: true }}
        className="mt-6"
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
          {/* <RangePicker onChange={(range) => {}} />
          <TimePickerRange onApply={(startTime, endTime) => {}} /> */}
        </div>
      </Table>
    </SectionLayout>
  );
}

export default SectionLog;
