import * as React from 'react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import { DataTablePagination } from '../components/data-table-pagination'
import { DataTableToolbar } from '../components/data-table-toolbar'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}


export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
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
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <div className='rounded-md border'>
        <Table>
        <thead className='from-blue-500 to-green-500 bg-gradient-to-r text-white'>
          <tr>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Entitas</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Kebun</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Afd</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Tahun Tanam</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Blok</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Luas (Ha)</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">SPH</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Varietas</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Lingkar Batang (cm)</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Tinggi Batang (cm)</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Jumlah Pelepah (Bh)</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">Panjang Rachis (cm)</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">Lebar Petiola (cm)</th>
            <th rowSpan={2} className="border border-gray-300 px-4 py-2">JAD (Helai)</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">1</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">2</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">3</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">4</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">5</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">6</th>
            <th colSpan={2} className="border border-gray-300 px-4 py-2">Rerata</th>
          </tr>
          <tr>
            <th className="border border-gray-300 px-4 py-2">L</th>
            <th className="border border-gray-300 px-4 py-2">T</th>
            <th className="border border-gray-300 px-4 py-2">P</th>
            <th className="border border-gray-300 px-4 py-2">L</th>
            <th className="border border-gray-300 px-4 py-2">P</th>
            <th className="border border-gray-300 px-4 py-2">L</th>
            <th className="border border-gray-300 px-4 py-2">P</th>
            <th className="border border-gray-300 px-4 py-2">L</th>
            <th className="border border-gray-300 px-4 py-2">P</th>
            <th className="border border-gray-300 px-4 py-2">L</th>
            <th className="border border-gray-300 px-4 py-2">P</th>
            <th className="border border-gray-300 px-4 py-2">L</th>
            <th className="border border-gray-300 px-4 py-2">P</th>
            <th className="border border-gray-300 px-4 py-2">L</th>
            <th className="border border-gray-300 px-4 py-2">P</th>
            <th className="border border-gray-300 px-4 py-2">L</th>
          </tr>
        </thead>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
