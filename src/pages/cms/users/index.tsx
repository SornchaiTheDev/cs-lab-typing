import Layout from "@/Layout";
import Table from "@/components/Common/Table";
import { Icon } from "@iconify/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Button from "@/components/Common/Button";
import { useOnClickOutside } from "usehooks-ts";
import Modal from "@/components/Common/Modal";
import Codemirror from "@/codemirror";
import { addUserTheme } from "@/codemirror/theme";
import { trpc } from "@/helpers";
import type { users as Users } from "@prisma/client";
import { toast } from "react-hot-toast";
import Toast from "@/components/Common/Toast";
import clsx from "clsx";
import EditKUStudent from "@/features/Users/EditKUStudent";
import EditNonKUStudent from "@/features/Users/EditNonKUStudent";
import { getUserType } from "@/helpers/getUserType";
import EditTeacher from "@/features/Users/EditTeacher";
import { useDeleteAffectStore } from "@/store/deleteAffect";

dayjs.extend(relativeTime);

type Role = "admin" | "teacher" | "student";

interface Props {
  title: string;
  role: Role;
  pattern: string;
}

function Admin({ title, role = "student", pattern }: Props) {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const columnHelper = createColumnHelper<Users>();
  const columns = useMemo(
    () =>
      [
        columnHelper.accessor("student_id", {
          header: "Student ID",
        }),
        columnHelper.accessor("full_name", {
          header: "Full name",
        }),
        columnHelper.accessor("email", {
          header: "Email",
        }),
        columnHelper.accessor("created_at", {
          header: "Created At",
          cell: (props: any) => dayjs(props.getValue()).toNow(true),
        }),
        columnHelper.accessor("last_logined", {
          header: "Last Logined",
          cell: (props: any) => {
            if (props.getValue()) {
              return dayjs(props.getValue()).toNow(true);
            }
            return "-";
          },
        }),
        columnHelper.display({
          id: "actions",
          header: "Edit",
          cell: (props) => (
            <button
              onClick={() =>
                setSelectedObj({
                  selected: props.row.getValue("email"),
                  type: getUserType(props.row.original),
                })
              }
              className="text-xl rounded-xl text-sand-12"
            >
              <Icon icon="solar:pen-2-line-duotone" />
            </button>
          ),
        }),
      ].filter((column) => {
        if (role !== "student") {
          return column.header !== "Student ID";
        }
        return true;
      }),
    [columnHelper, role, setSelectedObj]
  );

  const [value, setValue] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setIsShow(false);
  };

  useOnClickOutside(modalRef, onClose);

  const users = trpc.users.getUserPagination.useQuery({
    role,
    limit: 50,
    page: 1,
  });

  const [isShow, setIsShow] = useState(false);
  const [isError, setIsError] = useState(false);

  const { mutate } = trpc.users.addUser.useMutation({
    onSuccess() {
      toast.custom((t) => (
        <Toast {...t} msg="Added users successfully" type="success" />
      ));
      users.refetch();
      setValue("");
      setIsShow(false);
      setIsError(false);
    },
    onError(err) {
      setIsError(true);
      toast.custom((t) => <Toast {...t} msg={err.message} type="error" />);
    },
  });
  type SelectedUser = {
    email: string;
    type: "KUStudent" | "NonKUStudent" | "Teacher" | "Admin";
  };

  return (
    <>
      {selectedObj && (
        <>
          {selectedObj.type === "KUStudent" && (
            <EditKUStudent onClose={() => setSelectedObj(null)} />
          )}
          {selectedObj.type === "NonKUStudent" && (
            <EditNonKUStudent onClose={() => setSelectedObj(null)} />
          )}
          {selectedObj.type === "Teacher" && (
            <EditTeacher onClose={() => setSelectedObj(null)} />
          )}
        </>
      )}

      <Modal
        isOpen={isShow}
        onClose={onClose}
        title={`Add/Edit ${title}`}
        description={`( ${pattern} )`}
        className="w-[95%] md:w-[40rem] flex flex-col gap-4"
      >
        <div>
          <Codemirror
            autoFocus
            theme={addUserTheme}
            value={value}
            onChange={(value) => setValue(value)}
            height="30rem"
            className={clsx(
              "overflow-hidden h-[30rem] text-sm border rounded-md",
              isError ? "border-red-500" : "border-sand-6"
            )}
          />
        </div>
        <Button
          onClick={() => mutate({ users: value.split("\n") })}
          icon="solar:user-plus-rounded-line-duotone"
          className="shadow text-sand-1 active:bg-sand-11 bg-sand-12 disabled:bg-sand-8 disabled:text-sand-1"
        >
          Add User
        </Button>
      </Modal>

      <Layout title="Users">
        <Table data={users.data ?? []} columns={columns}>
          <div className="flex justify-end">
            <Button
              onClick={() => setIsShow(true)}
              icon="solar:user-plus-rounded-line-duotone"
              className="m-2 shadow text-sand-1 active:bg-sand-11 bg-sand-12"
            >
              Add User
            </Button>
          </div>
        </Table>
      </Layout>
    </>
  );
}

export default Admin;
