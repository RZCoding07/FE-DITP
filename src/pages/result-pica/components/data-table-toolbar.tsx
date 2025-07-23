"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { Download, FileSpreadsheet } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSearch: (term: string) => void
  searchTerm: string
  onDownload?: () => void
  onDownloadDetailed?: () => void
}

export function DataTableToolbar<TData>({
  table,
  onSearch,
  searchTerm,
  onDownload,
  onDownloadDetailed,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Search all columns..."
          value={searchTerm}
          onChange={(event) => onSearch(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button variant="ghost" onClick={() => table.resetColumnFilters()} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <div className="flex items-center space-x-2">
        {(onDownload || onDownloadDetailed) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 bg-transparent">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {onDownload && (
                <DropdownMenuItem onClick={onDownload}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Standard Export
                </DropdownMenuItem>
              )}
              {onDownloadDetailed && (
                <DropdownMenuItem onClick={onDownloadDetailed}>
                  <FileSpreadsheet className="mr-2 h-4 w-4" />
                  Detailed Export
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  )
}
