import SectionLayout from "~/Layout/SectionLayout";
import Table from "~/components/Common/Table";
import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";
import { useMemo, useEffect, useState } from "react";
import { trpc } from "~/helpers";
import { useRouter } from "next/router";
import { roles, users } from "@prisma/client";
import Skeleton from "~/components/Common/Skeleton";
import AddUser from "~/features/Users/AddUserToSection";
import toast from "react-hot-toast";
import Toast from "~/components/Common/Toast";
import { Icon } from "@iconify/react";
import Badge from "~/components/Common/Badge";

type StudentRow = {
  id: string;
  name: string;
};

function Sections() {
  const router = useRouter();
  const columnHelper = createColumnHelper<users>();

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
            onClick={
              () => {}
              // setSelectedObj({
              //   selected: props.row.getValue("email"),
              //   type: getUserType(props.row.original),
              // })
            }
            className="text-xl rounded-xl text-sand-12"
          >
            <Icon icon="solar:pen-2-line-duotone" />
          </button>
        ),
      }),
    ],
    [columnHelper]
  );

  const { sectionId } = router.query;
  const section = trpc.sections.getSectionById.useQuery({
    id: parseInt(sectionId as string),
  });

  const instructors =
    section.data?.instructors.map((user) => user.full_name) ?? [];

  const students = section.data?.students;

  const studentLength = students?.length ?? 0;

  const TAs = section.data?.tas ?? [];

  return (
    <SectionLayout title={section.data?.name!} isLoading={section.isLoading}>
      <div className="p-4">
        <h4 className="text-2xl">Section Information</h4>

        <h5 className="mt-4 mb-2 font-bold">Semester</h5>
        {section.isLoading ? (
          <Skeleton width={"10rem"} height={"2rem"} />
        ) : (
          <h4 className="text-lg">{`${section.data?.semester.year}/${section.data?.semester.term}`}</h4>
        )}
        <h5 className="mt-4 mb-2 font-bold">Note</h5>
        {section.isLoading ? (
          <Skeleton width={"10rem"} height={"2rem"} />
        ) : (
          <h4 className="text-lg">{section.data?.note}</h4>
        )}

        <h5 className="mt-4 mb-2 font-bold">Instructor(s)</h5>
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
        <h5 className="mt-4 mb-2 font-bold">TA(s)</h5>
        <div className="flex gap-2">
          {section.isLoading ? (
            <>
              <Skeleton width={"10rem"} height={"2rem"} />
              <Skeleton width={"10rem"} height={"2rem"} />
              <Skeleton width={"10rem"} height={"2rem"} />
            </>
          ) : TAs.length === 0 ? (
            <span>-</span>
          ) : (
            TAs.map(({ full_name }) => (
              <Badge key={full_name}>{full_name}</Badge>
            ))
          )}
        </div>
        <h5 className="mt-4 mb-2 font-bold">Students ({studentLength})</h5>
      </div>
      <Table
        data={students ?? []}
        isLoading={section.isLoading}
        columns={columns}
        className="mx-4 mb-2 md:w-1/2"
      >
        <AddUser sectionId={parseInt(sectionId as string)} />
      </Table>
    </SectionLayout>
  );
}

export default Sections;
