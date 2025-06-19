"use client"

import * as React from "react"
import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import { DataTablePagination } from "./data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onSearch: (term: string) => void
  searchTerm: string
  pageSize: number
  onPageSizeChange: (size: number) => void
  currentPage: number
  onPageChange: (page: number) => void
  totalRows: number
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onSearch,
  searchTerm,
  pageSize,
  onPageSizeChange,
  currentPage,
  onPageChange,
  totalRows,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  
  // Calculate total pages based on total rows and page size
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize))

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1, // TanStack Table uses 0-based indexing
        pageSize,
      },
    },
    pageCount: totalPages,
    manualPagination: true, // Tell the table we're handling pagination manually
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    // Handle page size change
    onPaginationChange: (updater) => {
      const newPagination = typeof updater === 'function' 
        ? updater(table.getState().pagination) 
        : updater;
        
      if (newPagination.pageSize !== pageSize) {
        onPageSizeChange(newPagination.pageSize);
      }
      
      if (newPagination.pageIndex !== currentPage - 1) {
        onPageChange(newPagination.pageIndex + 1);
      }
    },
  })

  return (
    <div className="space-y-4 w-full">
      <DataTableToolbar table={table} onSearch={onSearch} searchTerm={searchTerm} />
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
            {/* First header row with main groupings */}
            <TableRow>
            <TableHead rowSpan={2} className='text-center'>
                No.
              </TableHead>
              <TableHead colSpan={3} className="text-center">
                Lokasi
              </TableHead>
              <TableHead rowSpan={2} className="text-center">
                Tahun Tanam
              </TableHead>
              <TableHead colSpan={3} className="text-center">
                Analisis Masalah
              </TableHead>
              <TableHead rowSpan={2} className="text-center">
                Blok
              </TableHead>
              <TableHead rowSpan={2} className="text-center">
                Value PI
              </TableHead>
              <TableHead rowSpan={2} className="text-center">
                Keterangan
              </TableHead>
              <TableHead colSpan={6} className="text-center">
                Corrective Actions
              </TableHead>
              <TableHead rowSpan={2} className="text-center">
                Weekly Progress
              </TableHead>
              <TableHead rowSpan={2} className="text-center">
                Detail Progress
              </TableHead>
            </TableRow>

            {/* Second header row with individual column headers */}
            <TableRow>
              {/* Lokasi sub-headers */}
              <TableHead className="text-center">Regional</TableHead>
              <TableHead className="text-center">Kebun</TableHead>
              <TableHead className="text-center">Afdeling</TableHead>

              {/* Analisis Masalah sub-headers */}
              <TableHead className="text-center">Why 1</TableHead>
              <TableHead className="text-center">Why 2</TableHead>
              <TableHead className="text-center">Why 3</TableHead>

              {/* Corrective Actions sub-headers */}
              <TableHead className="text-center">Action</TableHead>
              <TableHead className="text-center">Value</TableHead>
              <TableHead className="text-center">Start Date</TableHead>
              <TableHead className="text-center">End Date</TableHead>
              <TableHead className="text-center">Budget</TableHead>
              <TableHead className="text-center">Images</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {searchTerm ? `No results found for "${searchTerm}"` : "No results."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DataTablePagination 
        table={table} 
        totalRows={totalRows} 
        pageSize={pageSize} 
        currentPage={currentPage}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  )
}
