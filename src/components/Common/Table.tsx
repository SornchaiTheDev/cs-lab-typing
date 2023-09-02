import { useState, type ReactNode, useMemo, useEffect } from "react";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnSort,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
} from "@tanstack/react-table";
import clsx from "clsx";
import { Icon } from "@iconify/react";
import { useDrag, useDrop } from "react-dnd";
import Button from "./Button";

interface DragAndDropProps {
  row: Row<any>;
  reorderRow: (draggedRowIndex: number, targetRowIndex: number) => void;
}
const DraggableRow = ({ row, reorderRow }: DragAndDropProps) => {
  const [, dropRef] = useDrop({
    accept: "row",
    drop: (draggedRow: Row<any>) => reorderRow(draggedRow.index, row.index),
  });

  const [{ isDragging }, dragRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => row,
    type: "row",
  });

  return (
    <tr
      ref={dragRef}
      className="hover:bg-sand-4"
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <td ref={dropRef}>
        <button className="text-xl text-sand-10 active:text-sand-12">
          <Icon icon="ic:baseline-drag-indicator" />
        </button>
      </td>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id} className="p-3">
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </td>
      ))}
    </tr>
  );
};

interface Props {
  data: any[];
  columns: any[];
  className?: string;
  defaultSortingState?: ColumnSort | undefined;
  children?: ReactNode;
  isLoading?: boolean;
  draggabled?: boolean;
  pageCount?: number;
  pagination?: PaginationState;
  onPaginationChange?: OnChangeFn<PaginationState> | undefined;
  onDrag?: (data: any[]) => void;
  searchString?: string;
  onSearchChange?: (searchString: string) => void;
}

function Table({
  data,
  columns,
  className,
  defaultSortingState,
  children,
  isLoading,
  draggabled,
  onDrag,
  pageCount = -1,
  pagination,
  onPaginationChange,
  searchString,
  onSearchChange,
}: Props) {
  const [sorting, setSorting] = useState<SortingState>(
    defaultSortingState ? [defaultSortingState] : []
  );

  const [tableData, setTableData] = useState<typeof data>([]);

  const reorderRow = (draggedRowIndex: number, targetRowIndex: number) => {
    const _tableData = [...tableData];
    const [draggedItem] = _tableData.splice(draggedRowIndex, 1);
    _tableData.splice(targetRowIndex, 0, draggedItem);
    setTableData([..._tableData]);
    onDrag && onDrag([..._tableData]);
  };

  useEffect(() => {
    if (isLoading) {
      setTableData(Array(8).fill({}));
    } else {
      setTableData(data);
    }
  }, [isLoading, data]);

  const tableColumns = useMemo(
    () =>
      isLoading
        ? columns.map((column) => ({
            ...column,
            cell: (
              <div className="h-4 w-full animate-pulse rounded bg-gradient-to-r from-sand-6 to-sand-4"></div>
            ),
          }))
        : columns,

    [isLoading, columns]
  );

  const _pagination = useMemo(() => {
    if (pagination === undefined) return undefined;
    const { pageIndex, pageSize } = pagination;
    return {
      pageIndex,
      pageSize,
    };
  }, [pagination]);

  const table = useReactTable({
    data: tableData,
    columns: tableColumns,
    pageCount,
    state: {
      sorting,
      pagination: _pagination,
    },
    manualPagination: true,
    onSortingChange: setSorting,
    onPaginationChange,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <div
      className={clsx(
        "my-6 flex-1 rounded-xl border border-sand-6 bg-sand-1 text-sand-12",
        className
      )}
    >
      {!!children && (
        <div className="flex flex-col justify-between p-2 md:flex-row gap-2">
          {searchString !== undefined && (
            <div className="flex h-full items-center gap-2 rounded-lg border border-sand-6 p-2">
              <Icon icon="carbon:search" className="text-sand-10" />
              <input
                value={searchString}
                onChange={(e) =>
                  onSearchChange && onSearchChange(e.target.value)
                }
                className="w-full bg-transparent text-sand-12 outline-none placeholder:text-sand-8"
                placeholder="Search"
              />
            </div>
          )}
          {children}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-sand-3">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {draggabled && <th style={{ width: 20 }} />}

                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="w-fit p-3"
                    style={{ width: header.getSize() }}
                  >
                    {header.isPlaceholder ? null : (
                      <button
                        className="flex w-full items-center  gap-2"
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
            {table.getRowModel().rows.map((row) => {
              if (draggabled)
                return (
                  <DraggableRow
                    key={row.id}
                    row={row}
                    reorderRow={reorderRow}
                  />
                );

              return (
                <tr key={row.id} className="hover:bg-sand-4">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
        {!!_pagination && (
          <div className="flex w-full justify-end gap-2 border-t border-sand-6 p-2">
            <Button
              className="hover:bg-sand-4"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <Icon icon="solar:alt-arrow-left-line-duotone" />
            </Button>
            <Button
              className="hover:bg-sand-4"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <Icon icon="solar:alt-arrow-right-line-duotone" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Table;
