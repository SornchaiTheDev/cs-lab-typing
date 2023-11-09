import type { Prisma } from "@prisma/client";
import { createColumnHelper } from "@tanstack/react-table";
import TypeBadge from "~/components/Table/TypeBadge";
import dayjs from "dayjs";

type LabLoggerWithUser = Prisma.lab_loggersGetPayload<{
  select: {
    date: true;
    ip_address: true;
    type: true;
    user: {
      select: {
        student_id: true;
      };
    };
    sectionId: true;
    taskId: true;
  };
}>;

const columnHelper = createColumnHelper<LabLoggerWithUser>();

export const sectionLogsColumns = [
  columnHelper.accessor((row) => row.type, {
    id: "type",
    header: "Type",
    cell: (info) => <TypeBadge type={info.renderValue()} />,
  }),
  columnHelper.accessor((row) => row.date, {
    id: "date",
    header: "Date",
    cell: (info) => dayjs(info.renderValue()).format("DD/MM/YYYY HH:mm:ss"),
  }),
  columnHelper.accessor((row) => row.user, {
    id: "user",
    header: "Email / Username",
    cell: (info) => info.renderValue()?.student_id,
  }),
  columnHelper.accessor((row) => row.taskId, {
    id: "taskId",
    header: "TaskId",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor((row) => row.sectionId, {
    id: "sectionId",
    header: "SectionId",
    cell: (info) => info.renderValue(),
  }),
  columnHelper.accessor((row) => row.ip_address, {
    id: "ip_address",
    header: "IP Address",
    cell: (info) => info.renderValue(),
  }),
];
