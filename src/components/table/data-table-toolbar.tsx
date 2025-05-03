"use client";

import React from "react";
import { type ColumnFiltersState, type Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "./data-table-view-options";
import { Input } from "../ui/input";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export function DataTableToolbar<TData>({
  table,
  filter,
}: DataTableToolbarProps<TData> & { filter: React.ReactNode }) {
  const [searchTerm, setSearchTerm] = React.useState<string>("");

  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative w-full">
          <Input
            placeholder="Search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="h-8 w-full rounded-[8px] border-[1px] pl-8"
            style={{ boxShadow: "0px 1px 2px 0px #00000014" }}
          />
        </div>
      </div>
      {filter}
      <DataTableViewOptions table={table} />
    </div>
  );
}
