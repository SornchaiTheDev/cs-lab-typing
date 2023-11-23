import { Icon } from "@iconify/react";
import type { users } from "@prisma/client";
import {
  type PaginationState,
  createColumnHelper,
} from "@tanstack/react-table";
import { TRPCClientError } from "@trpc/client";
import { TRPCError } from "@trpc/server";
import { debounce } from "lodash";
import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import SectionLayout from "~/Layout/SectionLayout";
import Alert from "~/components/Common/Alert";
import Button from "~/components/Common/Button";
import Table from "~/components/Common/Table";
import AddUser from "~/features/Users/AddUserToSection";
import { convertToThousand, sanitizeFilename, trpc } from "~/helpers";
import { createTrpcHelper } from "~/helpers/createTrpcHelper";
import { callToast } from "~/services/callToast";

function Students() {
  const router = useRouter();

  const columnHelper = createColumnHelper<users>();

  const { sectionId } = router.query;

  const section = trpc.sections.getSectionById.useQuery(
    {
      id: sectionId as string,
    },
    {
      enabled: !!sectionId,
    }
  );

  const students = trpc.sections.getStudentsBySectionId.useQuery({
    sectionId: sectionId as string,
  });

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const { pageIndex, pageSize } = pagination;
  const [searchString, setSearchString] = useState("");

  const handleOnSearchChange = (value: string) => {
    setSearchString(value);
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
    }));
  };

  const fetchStudents = useMemo(
    () => debounce(() => studentsPagination.refetch(), 500),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    fetchStudents();
  }, [searchString, fetchStudents, pagination]);

  const studentsPagination = trpc.sections.getStudentPagination.useQuery(
    {
      sectionId: sectionId as string,
      page: pageIndex,
      limit: pageSize,
      search: searchString,
    },
    {
      enabled: false,
    }
  );

  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const ctx = trpc.useContext();
  const deleteStudent = trpc.sections.deleteStudent.useMutation();
  const deleteSelectRow = async () => {
    try {
      await deleteStudent.mutateAsync({
        sectionId: sectionId as string,
        id: selectedUser as number,
      });
      await studentsPagination.refetch();
      await ctx.sections.getStudentsBySectionId.invalidate();
      callToast({
        msg: "Delete Student from Section successfully",
        type: "success",
      });
      setSelectedUser(null);
    } catch (err) {
      if (err instanceof TRPCClientError) {
        callToast({ msg: err.message, type: "error" });
      }
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor("student_id", {
        header: "Student ID",
      }),
      columnHelper.accessor("full_name", {
        header: "Full name",
      }),
      columnHelper.display({
        id: "actions",
        header: "Remove",
        size: 50,
        cell: (props) => (
          <button
            onClick={() => setSelectedUser(props.row.original.id)}
            className="rounded-xl text-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-trash-line-duotone" />
          </button>
        ),
      }),
    ],
    [columnHelper]
  );

  const allStudents = studentsPagination.data?.allStudents ?? [];

  const exportCSV = () => {
    let csvString = "Student Id,Full Name\n";
    allStudents.forEach(({ student_id, full_name }) => {
      csvString += `${student_id},${full_name}\n`;
    });

    const csvBlob = new Blob([csvString], { type: "text/csv" });
    const fileName = sanitizeFilename(
      `${section.data?.name}_enrolled_students`
    );

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(csvBlob);
    link.download = fileName;
    link.click();
  };

  return (
    <>
      <Alert
        type="student"
        isOpen={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        onConfirm={deleteSelectRow}
      />
      <SectionLayout
        title={section.data?.name as string}
        isLoading={section.isLoading}
      >
        <h4 className="mt-4 text-2xl font-bold text-sand-12">
          Students ({convertToThousand(students.data ?? 0)})
        </h4>
        <Table
          columns={columns}
          isLoading={studentsPagination.isLoading}
          data={studentsPagination.data?.students ?? []}
          pageCount={studentsPagination.data?.pageCount ?? 0}
          onPaginationChange={setPagination}
          {...{ pagination, searchString }}
          onSearchChange={handleOnSearchChange}
        >
          <div className="mt-2 flex items-center justify-between gap-2 md:mt-0">
            <AddUser
              sectionId={sectionId as string}
              onAdded={() => studentsPagination.refetch()}
            />
            <Button
              onClick={exportCSV}
              icon="solar:document-text-line-duotone"
              className="bg-sand-12 p-2 text-sand-1 shadow active:bg-sand-11"
            >
              Export as CSV
            </Button>
          </div>
        </Table>
      </SectionLayout>
    </>
  );
}

export default Students;

export const getServerSideProps: GetServerSideProps = async ({
  req,
  res,
  query,
}) => {
  const { helper } = await createTrpcHelper({ req, res });

  const { courseId, sectionId } = query;

  try {
    await helper.courses.getCourseById.fetch({
      courseId: courseId as string,
    });
    await helper.sections.getSectionById.fetch({
      id: sectionId as string,
    });
  } catch (err) {
    if (err instanceof TRPCError) {
      return {
        notFound: true,
      };
    }
  }

  return {
    props: {},
  };
};
