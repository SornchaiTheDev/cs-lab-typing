import Layout from "~/Layout";
import Table from "~/components/Common/Table";
import { Icon } from "@iconify/react";
import {
  type PaginationState,
  createColumnHelper,
} from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Button from "~/components/Common/Button";
import { useOnClickOutside } from "usehooks-ts";
import Modal from "~/components/Common/Modal";
import Codemirror from "~/codemirror";
import { addUserDarkTheme, addUserLightTheme } from "~/codemirror/theme";
import { trpc } from "~/helpers";
import type { users as Users } from "@prisma/client";
import clsx from "clsx";
import EditKUStudent from "~/features/Users/EditKUStudent";
import EditNonKUStudent from "~/features/Users/EditNonKUStudent";
import { getUserType } from "~/helpers/getUserType";
import EditTeacher from "~/features/Users/EditTeacher";
import { useDeleteAffectStore } from "~/store/deleteAffect";
import { useDropzone } from "react-dropzone";
import { TRPCClientError } from "@trpc/client";
import { callToast } from "~/services/callToast";
import useTheme from "~/hooks/useTheme";
import { debounce } from "lodash";

dayjs.extend(relativeTime);

function Users() {
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
        cell: (props: { getValue: () => Date }) =>
          dayjs(props.getValue()).toNow(true),
      }),
      columnHelper.accessor("last_logined", {
        header: "Last Logined",
        cell: (props: { getValue: () => Date | null }) => {
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
                selected: {
                  display: props.row.original.email,
                  id: props.row.original.id,
                },
                type: getUserType(props.row.original),
              })
            }
            className="rounded-xl text-xl text-sand-12"
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

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 20,
  });

  const [searchString, setSearchString] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchUser = useMemo(() => debounce(() => users.refetch(), 500), []);

  useEffect(() => {
    fetchUser();
  }, [searchString, fetchUser]);

  const { pageIndex, pageSize } = pagination;

  const users = trpc.users.getUserPagination.useQuery(
    {
      limit: pageSize,
      page: pageIndex,
      search: searchString,
    },
    { enabled: false }
  );

  const [isShow, setIsShow] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutateAsync } = trpc.users.addUser.useMutation();

  const handleAddUser = async () => {
    setIsSubmitting(true);
    try {
      await mutateAsync({ users: value.split("\n") });
      callToast({ msg: "Added users successfully", type: "success" });

      await users.refetch();
      setValue("");
      setIsShow(false);
      setIsError(false);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        const errMsg = err.message;
        setIsError(true);
        callToast({ msg: errMsg, type: "error" });
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

  useEffect(() => {
    users.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop: handleFileUpload,
      accept: {
        "text/csv": [".csv"],
      },
    });

  const { theme } = useTheme();

  const handleOnChange = (value: string) => {
    setIsError(false);
    setValue(value);
  };

  const handleOnSearchChange = (value: string) => {
    setSearchString(value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const usersAmount = trpc.users.getAllUsersAmount.useQuery();

  return (
    <>
      {selectedObj && (
        <>
          {selectedObj.type === "KUStudent" && (
            <EditKUStudent onUpdate={() => users.refetch()} />
          )}
          {selectedObj.type === "NonKUStudent" && (
            <EditNonKUStudent onUpdate={() => users.refetch()} />
          )}
          {selectedObj.type === "Teacher" && (
            <EditTeacher onUpdate={() => users.refetch()} />
          )}
        </>
      )}

      <Modal
        isOpen={isShow}
        onClose={onClose}
        title="Add/Edit User"
        className="flex flex-col gap-4 md:w-[40rem]"
      >
        <div>
          <Codemirror
            placeHolder={`Example format
Teacher
john@ku.th,John Doe
Student
6510405814,sornchai.som@ku.th,ศรชัย สมสกุล
POSN Student
posn001,passw0rd001,smart.sobdai@whatever.com,สามารถ สอบได้
`}
            autoFocus
            theme={theme === "light" ? addUserLightTheme : addUserDarkTheme}
            value={value}
            onChange={handleOnChange}
            height="20rem"
            className={clsx(
              "overflow-hidden rounded-md border text-sm",
              isError ? "border-red-500" : "border-sand-6"
            )}
          />
        </div>
        <div className="flex items-center justify-center gap-2 ">
          <div className="h-[0.5px] w-full bg-sand-9"></div>
          <h4 className="text-sand-12">or</h4>
          <div className="h-[0.5px] w-full bg-sand-9"></div>
        </div>

        <div
          {...getRootProps()}
          className={clsx(
            "flex cursor-pointer justify-center rounded-lg border-2 border-dashed p-4",

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
          className="bg-sand-12 text-sand-1 shadow active:bg-sand-11 disabled:bg-sand-8 disabled:text-sand-1"
        >
          Add User
        </Button>
      </Modal>

      <Layout title={`Users (${usersAmount.data ?? 0})`}>
        <Table
          isLoading={users.isLoading}
          data={users.data?.users ?? []}
          pageCount={users.data?.pageCount ?? 0}
          columns={columns}
          {...{
            pagination,
            searchString,
          }}
          onPaginationChange={setPagination}
          onSearchChange={handleOnSearchChange}
        >
          <Button
            onClick={() => setIsShow(true)}
            icon="solar:user-plus-rounded-line-duotone"
            className="bg-sand-12 text-sand-1 shadow active:bg-sand-11"
          >
            Add User
          </Button>
        </Table>
      </Layout>
    </>
  );
}

export default Users;
