import Layout from "@/Layout";
import Table from "@/components/Common/Table";
import { Icon } from "@iconify/react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GetStaticProps } from "next";
import DeleteAffect from "@/components/DeleteAffect";
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

dayjs.extend(relativeTime);

type Role = "admin" | "teacher" | "student";

interface Props {
  title: string;
  role: Role;
  pattern: string;
}

function Admin({ title, role, pattern }: Props) {
  const columnHelper = createColumnHelper<Users>();
  const columns = useMemo<ColumnDef<Users, string>[]>(
    () => [
      {
        header: "Student ID",
        accessorKey: "student_id",
      },
      {
        header: "Full name",
        accessorKey: "full_name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        cell: (props) => dayjs(props.getValue()).toNow(true),
      },
      {
        header: "Last Logined",
        accessorKey: "last_logined",
        cell: (props) => {
          if (props.getValue()) {
            return dayjs(props.getValue()).toNow(true);
          }
          return "-";
        },
      },
      columnHelper.display({
        id: "actions",
        header: "Delete",
        cell: (props) => (
          <button
            onClick={() => setSelected(props.row.getValue("email"))}
            className="text-xl rounded-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-minimalistic-line-duotone" />
          </button>
        ),
      }),
    ],
    [columnHelper]
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

  const [selected, setSelected] = useState<string | null>(null);
  const [isShow, setIsShow] = useState(false);
  const [isError, setIsError] = useState(false);

  const { mutate } = trpc.users.addUser.useMutation({
    onSuccess() {
      toast.custom((t) => (
        <Toast {...t} title="Added users successfully" type="success" />
      ));
      users.refetch();
      setValue("");
      setIsShow(false);
    },
    onError(err) {
      setIsError(true);
      console.log(err.message);
      if (err.message === "INVALID_INPUT") {
        toast.custom((t) => (
          <Toast
            {...t}
            title={`Some ${title} has invalid form.`}
            type="error"
          />
        ));
      }
      if (err.message === "DUPLICATED_USER") {
        toast.custom((t) => (
          <Toast
            {...t}
            title={`Some ${title} has already added.`}
            type="error"
          />
        ));
      }
    },
  });

  return (
    <>
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
          onClick={() => mutate({ role, users: value.split("\n") })}
          icon="solar:user-plus-rounded-line-duotone"
          className="shadow text-sand-1 active:bg-sand-11 bg-sand-12 disabled:bg-sand-8 disabled:text-sand-1"
        >
          Add {title}
        </Button>
      </Modal>

      <Layout title={title}>
        {selected && (
          <DeleteAffect
            type="user"
            isOpen={selected !== null}
            selected={selected!}
            onClose={() => setSelected(null)}
          />
        )}

        <Table data={users.data ?? []} columns={columns}>
          <Button
            onClick={() => setIsShow(true)}
            icon="solar:user-plus-rounded-line-duotone"
            className="m-2 shadow text-sand-1 active:bg-sand-11 bg-sand-12"
          >
            Add {title}
          </Button>
        </Table>
      </Layout>
    </>
  );
}

export default Admin;

export const getStaticPaths = async () => {
  return {
    paths: [
      { params: { role: "admin" } },
      { params: { role: "student" } },
      { params: { role: "teacher" } },
    ],
    fallback: false,
  };
};

export const getStaticProps: GetStaticProps<Props, { role: Role }> = async ({
  params,
}) => {
  let title = "";
  let pattern = "";

  switch (params?.role) {
    case "admin":
      title = "Administrator";
      pattern = "import by Email or create by email,fullname";
      break;
    case "teacher":
      title = "Teacher";
      pattern = "email,fullname";
      break;
    case "student":
      title = "Student";
      pattern =
        "student-id,email,ชื่อ นามสกุล) / Non-KU (username,password,email,ชื่อ นามสกุล)";
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
