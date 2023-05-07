import SectionLayout from "@/Layout/SectionLayout";
import Table from "@/components/Common/Table";
import type { ColumnDef } from "@tanstack/react-table";
import { useMemo, useRef } from "react";

const istructors = ["Sornchai TheDev", "SaacSOS"];

const TA = ["Jgogo01", "Teerut26"];

type StudentRow = {
  id: string;
  name: string;
};

function Sections() {
  const columns = useMemo<ColumnDef<StudentRow, string>[]>(
    () => [
      {
        header: "Student ID",
        accessorKey: "id",
      },
      {
        header: "Name",
        accessorKey: "name",
      },
    ],
    []
  );
  return (
    <SectionLayout title="12 (F 15 - 17)">
      <div className="p-4">
        <h4 className="text-2xl">Section Information</h4>

        <h5 className="mt-4 mb-2 font-bold">Instructor(s)</h5>
        <div className="flex gap-2">
          {istructors.map((instructor) => (
            <div
              key={instructor}
              className="flex items-center px-2 py-1 text-sm font-semibold text-white rounded-md bg-sand-12"
            >
              <h5>{instructor}</h5>
            </div>
          ))}
        </div>
        <h5 className="mt-4 mb-2 font-bold">TA(s)</h5>
        <div className="flex gap-2">
          {TA.map((instructor) => (
            <div
              key={instructor}
              className="flex items-center px-2 py-1 text-sm font-semibold text-white rounded-md bg-sand-12"
            >
              <h5>{instructor}</h5>
            </div>
          ))}
        </div>
        <h5 className="mt-4 mb-2 font-bold">Students (20)</h5>

        <Table data={[]} columns={columns} className="w-1/2">
          <div className="flex flex-col justify-between gap-2 p-2 md:flex-row">
            {/* <AddUserBtn title="Student" pattern="student-id" /> */}
          </div>
        </Table>
      </div>
    </SectionLayout>
  );
}

export default Sections;
