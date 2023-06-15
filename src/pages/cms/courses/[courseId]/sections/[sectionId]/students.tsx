import { Icon } from "@iconify/react";
import type { users } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import { TRPCClientError } from "@trpc/client";
import { useRouter } from "next/router";
import React, { useMemo, useState } from "react";
import SectionLayout from "~/Layout/SectionLayout";
import Alert from "~/components/Common/Alert";
import Button from "~/components/Common/Button";
import Table from "~/components/Common/Table";
import AddUser from "~/features/Users/AddUserToSection";
import { sanitizeFilename, trpc } from "~/helpers";
import { callToast } from "~/services/callToast";

function Students() {
  const router = useRouter();

  const columnHelper = createColumnHelper<users>();

  const { sectionId } = router.query;

  const section = trpc.sections.getSectionById.useQuery({
    id: sectionId as string,
  });

  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  const deleteStudent = trpc.sections.deleteStudent.useMutation();
  const deleteSelectRow = async () => {
    try {
      await deleteStudent.mutateAsync({
        sectionId: sectionId as string,
        student_id: selectedUser as string,
      });
      await section.refetch();
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
        header: "Delete",
        size: 50,
        cell: (props) => (
          <button
            onClick={() => setSelectedUser(props.row.original.student_id)}
            className="rounded-xl text-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-trash-line-duotone" />
          </button>
        ),
      }),
    ],
    [columnHelper]
  );

  const students = section.data?.students ?? [];

  const exportCSV = () => {
    let csvString = "Student Id,Full Name\n";
    students.forEach(({ student_id, full_name }) => {
      csvString += `${student_id},${full_name}\n`;
    });

    const csvBlob = new Blob([csvString], { type: "text/csv" });
    const fileName = sanitizeFilename(
      `${section.data?.name}_enrolled_students.csv`
    );

    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(csvBlob);
    link.download = fileName;
    link.click();
  };
  return (
    <>
      <Alert
        isOpen={!!selectedUser}
        onCancel={() => setSelectedUser(null)}
        onConfirm={deleteSelectRow}
      />
      <SectionLayout
        title={section.data?.name as string}
        isLoading={section.isLoading}
      >
        <Table
          data={students ?? []}
          isLoading={section.isLoading}
          columns={columns}
          className="mx-4"
        >
          <div className="flex items-center justify-between p-1">
            <AddUser sectionId={sectionId as string} />
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
