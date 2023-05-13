import type { ReactNode } from "react";
import { ColumnSort } from "@tanstack/react-table";
import Table from "./Table";

interface Props<T> {
  columns: any[];
  data: T[];
  isLoading: boolean;
  defaultSortingState?: ColumnSort;
  children: ReactNode;
}

function AsyncTable<T>({
  columns,
  data,
  isLoading,
  defaultSortingState,
  children,
}: Props<T>) {
  if (isLoading) data = [{ id: "loading" }] as any;

  console.log(data)
  return (
    <Table
      columns={columns}
      data={data}
      defaultSortingState={defaultSortingState}
    >
      {children}
    </Table>
  );
}

export default AsyncTable;
