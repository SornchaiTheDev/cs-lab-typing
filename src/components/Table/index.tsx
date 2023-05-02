import { useState } from "react";
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
  defaultSortingState?: ColumnSort | null;
}
function Table({
  data,
  columns,
  className,
  defaultSortingState = null,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortingState ? [defaultSortingState] : []
  );
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div className="max-w-full overflow-x-auto">
      <table className={clsx("w-full text-sm", className)}>
        <thead className="bg-sand-3">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 w-fit" style={{width : header.getSize()}}>
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
  );
}

export default Table;
