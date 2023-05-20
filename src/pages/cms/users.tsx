import Layout from "~/Layout";
import Table from "~/components/Common/Table";
import { Icon } from "@iconify/react";
import { createColumnHelper } from "@tanstack/react-table";
import { useCallback, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Button from "~/components/Common/Button";
import { useOnClickOutside } from "usehooks-ts";
import Modal from "~/components/Common/Modal";
import Codemirror from "~/codemirror";
import { addUserTheme } from "~/codemirror/theme";
import { trpc } from "~/helpers";
import type { users as Users } from "@prisma/client";
import { toast } from "react-hot-toast";
import Toast from "~/components/Common/Toast";
import clsx from "clsx";
import EditKUStudent from "~/features/Users/EditKUStudent";
import EditNonKUStudent from "~/features/Users/EditNonKUStudent";
import { getUserType } from "~/helpers/getUserType";
import EditTeacher from "~/features/Users/EditTeacher";
import { useDeleteAffectStore } from "~/store/deleteAffect";
import { useDropzone } from "react-dropzone";
import { TRPCClientError } from "@trpc/client";

dayjs.extend(relativeTime);

type Role = "admin" | "teacher" | "student";

interface Props {
  title: string;
  role: Role;
  pattern: string;
}

function Admin({ title, pattern }: Props) {
  const [selectedObj, setSelectedObj] = useDeleteAffectStore((state) => [
    state.selectedObj,
    state.setSelectedObj,
  ]);
  const columnHelper = createColumnHelper<Users>();
  const columns = useMemo(
    () => [
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
        size: 50,
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
    ],
    [columnHelper, setSelectedObj]
  );

  const [value, setValue] = useState("");

  const modalRef = useRef<HTMLDivElement>(null);

  const onClose = () => {
    setIsShow(false);
    setValue("");
    setIsError(false);
  };

  useOnClickOutside(modalRef, onClose);

  const users = trpc.users.getUserPagination.useQuery({
    limit: 50,
    page: 1,
  });

  const [isShow, setIsShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync } = trpc.users.addUser.useMutation();

  const handleAddUser = async () => {
    setIsSubmitting(true);
    try {
      await mutateAsync({ users: value.split("\n") });
      toast.custom((t) => (
        <Toast {...t} msg="Added users successfully" type="success" />
      ));
      users.refetch();
      setValue("");
      setIsShow(false);
      setIsError(false);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        setIsError(true);
        toast.custom((t) => <Toast {...t} msg={errMsg} type="error" />);
      }
    }
    setIsSubmitting(false);
  };

  const handleFileUpload = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result;
        if (typeof text === "string") {
          setValue(text.trim());
        }
      };
      reader.readAsText(file);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleFileUpload,
      accept: {
        "text/csv": [".csv"],
      },
    });

  return (
    <>
      {selectedObj && (
        <>
          {selectedObj.type === "KUStudent" && <EditKUStudent />}
          {selectedObj.type === "NonKUStudent" && <EditNonKUStudent />}
          {selectedObj.type === "Teacher" && <EditTeacher />}
        </>
      )}

      <Modal
        isOpen={isShow}
        onClose={onClose}
        title="Add/Edit User"
        className="md:w-[40rem] flex flex-col gap-4"
      >
        <div>
          <Codemirror
            autoFocus
            theme={addUserTheme}
            value={value}
            onChange={(value) => setValue(value)}
            height="20rem"
            className={clsx(
              "overflow-hidden text-sm border rounded-md",
              isError ? "border-red-500" : "border-sand-6"
            )}
          />
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <div className="w-full h-[0.5px] bg-sand-9"></div>
          <h4>or</h4>
          <div className="w-full h-[0.5px] bg-sand-9"></div>
        </div>

        <div
          {...getRootProps()}
          className={clsx(
            "flex justify-center p-4 border-2 border-dashed rounded-lg cursor-pointer",

            isDragReject
              ? "border-red-9 text-red-9"
              : isDragActive
              ? "border-lime-9 text-lime-11"
              : "border-sand-6 text-sand-11"
          )}
        >
          <input {...getInputProps()} />
          {isDragReject
            ? "This file is not CSV"
            : isDragActive
            ? "You can now drop the file here"
            : "Click or Drop a CSV file here"}
        </div>

        <Button
          onClick={handleAddUser}
          disabled={isSubmitting}
          icon="solar:user-plus-rounded-line-duotone"
          className="shadow text-sand-1 active:bg-sand-11 bg-sand-12 disabled:bg-sand-8 disabled:text-sand-1"
        >
          Add User
        </Button>
      </Modal>

      <Layout title="Users">
        <Table
          isLoading={users.isLoading}
          data={users.data ?? []}
          columns={columns}
        >
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
