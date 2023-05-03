import Layout from "@/Layout";
import Table from "@/components/Table";
import { Icon } from "@iconify/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import React, { useMemo, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import AddUserBtn from "@/components/Users/AddUser";
import { GetStaticProps } from "next";
import DeleteAffect from "@/components/DeleteAffect";

dayjs.extend(relativeTime);

interface UserRole {
  username: string;
  password: string;
  email: string;
  isOAuthEnabled: boolean;
  created_at: string;
  last_logined: string;
}

interface Props {
  title: string;
  role: string;
  pattern: string;
}

function Admin({ title, role, pattern }: Props) {
  const columnHelper = createColumnHelper<UserRole>();
  const columns = useMemo<ColumnDef<UserRole, string>[]>(
    () => [
      {
        header: "Username",
        accessorKey: "username",
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
        header: "OAuth",
        accessorKey: "isOAuthEnabled",
        size: 30,
        cell: (props) => (
          <div className="flex justify-center text-2xl">
            {props.getValue() && (
              <Icon
                icon="solar:verified-check-bold-duotone"
                className="text-lime-9"
              />
            )}
          </div>
        ),
      },
      columnHelper.display({
        id: "actions",
        header: "Delete",
        cell: (props) => (
          <button
            onClick={() => setSelected(props.row.getValue("username"))}
            className="text-xl rounded-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </button>
        ),
      }),
    ],
    [columnHelper]
  );

  const [selected, setSelected] = useState<string | null>(null);

  return (
    <Layout title={title}>
      {selected !== null && (
        <DeleteAffect
          type="user"
          selected={selected}
          onClose={() => setSelected(null)}
          onDelete={() => setSelected(null)}
        />
      )}

      <div className="min-h-screen overflow-hidden border bg-sand-1 text-sand-12 rounded-xl border-sand-6">
        <AddUserBtn pattern={pattern} title={title} />
        <Table
          data={[
            {
              username: "johndoe",
              password: "123456",
              email: "johndoe@example.com",
              isOAuthEnabled: true,
              created_at: "2021-01-14T11:52:00.958Z",
              last_logined: "2020-02-18T10:37:54.116Z",
            },
            {
              username: "janedoe",
              password: "654321",
              email: "janedoe@example.com",
              isOAuthEnabled: false,
              created_at: "2020-11-10T12:44:43.106Z",
              last_logined: "2022-08-27T07:36:08.691Z",
            },
            {
              username: "bobsmith",
              password: "password123",
              email: "bobsmith@example.com",
              isOAuthEnabled: true,
              created_at: "2022-09-25T04:24:54.135Z",
              last_logined: "2022-05-01T01:57:59.544Z",
            },
            {
              username: "sallyjones",
              password: "passw0rd",
              email: "sallyjones@example.com",
              isOAuthEnabled: false,
              created_at: "2021-04-18T07:06:14.586Z",
              last_logined: "2022-08-09T10:51:01.489Z",
            },
            {
              username: "mikebrown",
              password: "p@ssword",
              email: "mikebrown@example.com",
              isOAuthEnabled: true,
              created_at: "2021-12-16T02:00:38.165Z",
              last_logined: "2020-03-05T03:54:57.518Z",
            },
            {
              username: "jennybrown",
              password: "p@ssword",
              email: "jennybrown@example.com",
              isOAuthEnabled: true,
              created_at: "2020-11-29T22:08:04.191Z",
              last_logined: "2021-03-11T15:50:11.320Z",
            },
            {
              username: "jasonlee",
              password: "qwerty123",
              email: "jasonlee@example.com",
              isOAuthEnabled: false,
              created_at: "2021-12-04T06:36:16.697Z",
              last_logined: "2022-08-19T15:49:57.956Z",
            },
            {
              username: "amysmith",
              password: "ilovecats",
              email: "amysmith@example.com",
              isOAuthEnabled: true,
              created_at: "2021-09-17T01:00:10.871Z",
              last_logined: "2020-03-12T13:02:20.796Z",
            },
            {
              username: "davidwilliams",
              password: "1q2w3e4r",
              email: "davidwilliams@example.com",
              isOAuthEnabled: false,
              created_at: "2021-12-24T20:42:19.942Z",
              last_logined: "2020-07-10T15:23:04.673Z",
            },
            {
              username: "laurajones",
              password: "letmein",
              email: "laurajones@example.com",
              isOAuthEnabled: true,
              created_at: "2020-10-25T13:42:24.555Z",
              last_logined: "2022-01-24T23:12:19.606Z",
            },
          ]}
          columns={columns}
        />
      </div>
    </Layout>
  );
}

export default Admin;

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { role: "admin" } },
      { params: { role: "student" } },
      { params: { role: "teacher" } },
      { params: { role: "non-ku-student" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<
  Props,
  { role: "admin" | "teacher" | "student" | "non-ku-student" }
> = async ({ params }) => {
  let title = "";
  let pattern = "";

  switch (params?.role) {
    case "admin":
      title = "Administrator";
      pattern = "username,password,email";
      break;
    case "teacher":
      title = "Teacher";
      pattern = "email,fullname";
      break;
    case "student":
      title = "Student";
      pattern = "student-id,email,ชื่อ นามสกุล";
      break;
    case "non-ku-student":
      title = "Non-KU Student";
      pattern = "username,password,email,ชื่อ นามสกุล";
      break;
  }

  return {
    props: {
      title,
      role: params?.role!,
      pattern,
    },
  };
};
