import { useState, ReactNode, useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type { ColumnSort, SortingState } from "@tanstack/react-table";
import clsx from "clsx";
import { Icon } from "@iconify/react";

interface Props {
  data: any[];
  columns: any[];
  className?: string;
  defaultSortingState?: ColumnSort | undefined;
  children?: ReactNode;
  isLoading?: boolean;
}
function Table({
  data,
  columns,
  className,
  defaultSortingState,
  children,
  isLoading,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortingState ? [defaultSortingState] : []
  );

  const tableData = useMemo(
    () => (isLoading ? Array(8).fill({}) : data),
    [isLoading, data]
  );
  const tableColumns = useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: (
              <div className="w-full h-4 rounded from-sand-6 to-sand-4 bg-gradient-to-r animate-pulse"></div>
            ),
          }))
        : columns,
    [isLoading, columns]
  );

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={clsx(
        "flex-1 border bg-sand-1 text-sand-12 rounded-xl border-sand-6 overflow-hidden",
        className
      )}
    >
      {children}
      <div className="max-w-full overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sand-3">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 w-fit"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className="flex items-center justify-center w-full gap-2"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: (
                            <Icon
                              icon="solar:sort-from-top-to-bottom-bold-duotone"
                              className="text-xl"
                            />
                          ),
                          desc: (
                            <Icon
                              icon="solar:sort-from-bottom-to-top-bold-duotone"
                              className="text-xl"
                            />
                          ),
                        }[header.column.getIsSorted() as string] ?? null}
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="text-center hover:bg-sand-4">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.footer,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </div>
  );
}

export default Table;
