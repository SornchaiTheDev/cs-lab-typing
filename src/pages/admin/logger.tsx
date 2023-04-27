import { useMemo } from "react";
import Layout from "@/Layout";
import Table from "@/components/Table";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import clsx from "clsx";

interface LoggerRow {
  type: string;
  date: string;
  username: string;
  ip: string;
}

const Type = ({ type }: { type: string }) => {
  return (
    <div
      className={clsx(
        "px-2 text-sm font-bold text-white rounded-full w-fit",
        type === "LOGIN" && " bg-lime-9",
        type === "LOGOUT" && "bg-amber-9",
        type === "FAILED-LOGIN" && "bg-red-9"
      )}
    >
      {type}
    </div>
  );
};

function Logger() {
  const columnHelper = createColumnHelper();

  const data: LoggerRow[] = useMemo(
    () => [
      {
        type: "LOGIN",
        date: "2023-04-27 10:25:13+07:00",
        username: "john.doe@example.com",
        ip: "192.168.0.1",
      },
      {
        type: "LOGOUT",
        date: "2023-04-27 11:03:47+07:00",
        username: "jane.doe@example.com",
        ip: "10.0.0.1",
      },
      {
        type: "FAILED-LOGIN",
        date: "2023-04-27 12:42:19+07:00",
        username: "admin@example.com",
        ip: "172.16.0.1",
      },
      {
        type: "LOGIN",
        date: "2023-04-27 13:18:33+07:00",
        username: "user1@example.com",
        ip: "192.168.1.100",
      },
      {
        type: "LOGOUT",
        date: "2023-04-27 14:53:11+07:00",
        username: "user2@example.com",
        ip: "10.0.0.2",
      },
      {
        type: "FAILED-LOGIN",
        date: "2023-04-27 15:27:45+07:00",
        username: "user3@example.com",
        ip: "172.16.0.2",
      },
      {
        type: "LOGIN",
        date: "2023-04-27 16:10:28+07:00",
        username: "user4@example.com",
        ip: "192.168.2.50",
      },
      {
        type: "LOGOUT",
        date: "2023-04-27 17:39:02+07:00",
        username: "user5@example.com",
        ip: "10.0.0.3",
      },
      {
        type: "FAILED-LOGIN",
        date: "2023-04-27 18:14:57+07:00",
        username: "user6@example.com",
        ip: "172.16.0.3",
      },
      {
        type: "LOGIN",
        date: "2023-04-27 19:00:49+07:00",
        username: "user7@example.com",
        ip: "192.168.3.75",
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

  return (
    <Layout title="Logger">
      <div className="overflow-hidden bg-white border rounded-xl border-sand-6">
        <div className="p-2">
          <h4 className="text-lg font-bold">Filter</h4>
          Date Type
        </div>
        <Table
          data={data}
          columns={columns}
          defaultSortingState={{ id: "date", desc: true }}
        />
      </div>
    </Layout>
  );
}

export default Logger;
