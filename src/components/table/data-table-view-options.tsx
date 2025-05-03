"use client";

import { type MouseEvent } from "react";
import { type Column, type ColumnMeta, type Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toTitlecase } from "@/lib/utils";
import { ChevronsUpDown } from "lucide-react";

interface CustomColumnMeta<TData> extends ColumnMeta<TData, unknown> {
  title: string;
}

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>;
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  const handleClick = (
    e: MouseEvent<HTMLDivElement>,
    column: Column<TData, unknown>,
  ) => {
    e.preventDefault();
    column.toggleVisibility();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden h-8 lg:flex"
        >
          <ChevronsUpDown className="mr-2 h-4 w-4" />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-[400px] overflow-auto">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllFlatColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide(),
          )
          .map((column) => {
            const displayName =
              (column.columnDef.meta as CustomColumnMeta<unknown>)?.title ??
              toTitlecase(column.id);
            if (!displayName) return null;
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onClick={(e) => handleClick(e, column)}
              >
                {displayName}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
