import SectionLayout from "~/Layout/SectionLayout";
import Table from "~/components/Common/Table";
import { createColumnHelper } from "@tanstack/react-table";
import { useMemo, useCallback } from "react";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import type { users } from "@prisma/client";
import Skeleton from "~/components/Common/Skeleton";
import AddUser from "~/features/Users/AddUserToSection";
import { Icon } from "@iconify/react";
import Badge from "~/components/Common/Badge";
import { callToast } from "~/services/callToast";
import { TRPCClientError } from "@trpc/client";

function Sections() {
  const router = useRouter();
  const columnHelper = createColumnHelper<users>();

  const { sectionId } = router.query;
  const sectionIdInt = parseInt(sectionId as string);
  const section = trpc.sections.getSectionById.useQuery({
    id: sectionIdInt,
  });

  const deleteStudent = trpc.sections.deleteStudent.useMutation();
  const deleteSelectRow = useCallback(
    async (id: string) => {
      try {
        await deleteStudent.mutateAsync({
          sectionId: sectionIdInt,
          student_id: id,
        });
        await section.refetch();
        callToast({
          msg: "Delete Student from Section successfully",
          type: "success",
        });
      } catch (err) {
        if (err instanceof TRPCClientError) {
          callToast({ msg: err.message, type: "error" });
        }
      }
    },
    [deleteStudent, sectionIdInt, section]
  );

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
            onClick={() => deleteSelectRow(props.row.original.student_id)}
            className="rounded-xl text-xl text-sand-12"
          >
            <Icon icon="solar:trash-bin-trash-line-duotone" />
          </button>
        ),
      }),
    ],
    [columnHelper, deleteSelectRow]
  );

  const instructors =
    section.data?.instructors.map((user) => user.full_name) ?? [];

  const students = section.data?.students;

  const studentLength = students?.length ?? 0;

  return (
    <SectionLayout
      title={section.data?.name as string}
      isLoading={section.isLoading}
    >
      <div className="p-4">
        <h4 className="text-2xl">Section Information</h4>

        <h5 className="mb-2 mt-4 font-bold">Semester</h5>
        {section.isLoading ? (
          <Skeleton width={"10rem"} height={"2rem"} />
        ) : (
          <h4 className="text-lg">{`${section.data?.semester.year as string}/${
            section.data?.semester.term as string
          }`}</h4>
        )}
        <h5 className="mb-2 mt-4 font-bold">Note</h5>
        {section.isLoading ? (
          <Skeleton width={"10rem"} height={"2rem"} />
        ) : (
          <h4 className="text-lg">{section.data?.note}</h4>
        )}

        <h5 className="mb-2 mt-4 font-bold">Instructor(s)</h5>
        <div className="flex gap-2">
          {section.isLoading ? (
            <>
              <Skeleton width={"10rem"} height={"2rem"} />
              <Skeleton width={"10rem"} height={"2rem"} />
            </>
          ) : (
            instructors.map((instructor) => (
              <Badge key={instructor}>{instructor}</Badge>
            ))
          )}
        </div>
        <h5 className="mt-4 font-bold">Students ({studentLength})</h5>
      </div>
      <Table
        data={students ?? []}
        isLoading={section.isLoading}
        columns={columns}
        className="mx-4 md:w-1/2"
      >
        <AddUser sectionId={parseInt(sectionId as string)} />
      </Table>
    </SectionLayout>
  );
}

export default Sections;
