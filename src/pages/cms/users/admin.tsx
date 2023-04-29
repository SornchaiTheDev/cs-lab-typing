import Layout from "@/Layout";
import Table from "@/components/Table";
import { Icon } from "@iconify/react";
import { ColumnDef } from "@tanstack/react-table";
import React, { useMemo } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AddUserBtn from "@/components/AddUser";

dayjs.extend(relativeTime);

interface UserRole {
  username: string;
  password: string;
  email: string;
  isOAuthEnabled: boolean;
  created_at: string;
  last_logined: string;
}

function Admin() {
  const columns = useMemo<ColumnDef<UserRole, string>[]>(
    () => [
      {
        header: "Username",
        accessorKey: "username",
      },
      {
        header: "Password",
        accessorKey: "password",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Created At",
        accessorKey: "created_at",
      },
      {
        header: "Last Logined",
        accessorKey: "last_logined",
        cell: (props) => dayjs(props.getValue()).toNow(true),
      },
      {
        header: "KU Goes Google",
        accessorKey: "isOAuthEnabled",
        cell: (props) => (
          <div className="text-2xl">
            {props.getValue() && (
              <Icon
                icon="solar:verified-check-bold-duotone"
                className="text-lime-9"
              />
            )}
          </div>
        ),
      },
    ],
    []
  );

  const data = useMemo<UserRole[]>(
    () => [
      {
        username: "johndoe",
        password: "123456",
        email: "johndoe@example.com",
        isOAuthEnabled: true,
        created_at: "2021-09-30T05:46:41.983Z",
        last_logined: "2021-01-19T09:14:04.588Z",
      },
      {
        username: "janedoe",
        password: "654321",
        email: "janedoe@example.com",
        isOAuthEnabled: false,
        created_at: "2022-01-09T06:43:13.567Z",
        last_logined: "2022-10-16T06:42:57.192Z",
      },
      {
        username: "bobsmith",
        password: "password123",
        email: "bobsmith@example.com",
        isOAuthEnabled: true,
        created_at: "2021-05-14T04:05:29.511Z",
        last_logined: "2022-11-08T09:49:39.021Z",
      },
      {
        username: "sallyjones",
        password: "passw0rd",
        email: "sallyjones@example.com",
        isOAuthEnabled: false,
        created_at: "2020-09-11T11:57:02.827Z",
        last_logined: "2020-12-14T06:48:01.541Z",
      },
      {
        username: "mikebrown",
        password: "p@ssword",
        email: "mikebrown@example.com",
        isOAuthEnabled: true,
        created_at: "2022-06-12T00:54:08.048Z",
        last_logined: "2020-04-14T01:40:22.001Z",
      },
      {
        username: "jennybrown",
        password: "p@ssword",
        email: "jennybrown@example.com",
        isOAuthEnabled: true,
        created_at: "2022-04-24T19:09:12.121Z",
        last_logined: "2021-08-27T13:54:35.619Z",
      },
      {
        username: "jasonlee",
        password: "qwerty123",
        email: "jasonlee@example.com",
        isOAuthEnabled: false,
        created_at: "2021-11-03T16:43:47.452Z",
        last_logined: "2021-11-22T16:27:04.884Z",
      },
      {
        username: "amysmith",
        password: "ilovecats",
        email: "amysmith@example.com",
        isOAuthEnabled: true,
        created_at: "2020-07-08T16:24:22.945Z",
        last_logined: "2022-04-23T03:47:24.754Z",
      },
      {
        username: "davidwilliams",
        password: "1q2w3e4r",
        email: "davidwilliams@example.com",
        isOAuthEnabled: false,
        created_at: "2022-05-12T12:32:48.202Z",
        last_logined: "2021-08-04T18:27:00.765Z",
      },
      {
        username: "laurajones",
        password: "letmein",
        email: "laurajones@example.com",
        isOAuthEnabled: true,
        created_at: "2020-07-17T03:35:56.813Z",
        last_logined: "2021-05-24T07:07:52.845Z",
      },
    ],
    []
  );

  return (
    <Layout title="Administrator">
      <div className="min-h-screen overflow-hidden border bg-sand-1 text-sand-12 rounded-xl border-sand-6">
        <div className="m-2">
          <AddUserBtn />
        </div>
        <Table data={data} columns={columns} />
      </div>
    </Layout>
  );
}

export default Admin;
