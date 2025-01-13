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

import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbarPekerjaan } from './data-table-toolbar-pekerjaan'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  sub_investasi: string;
}


export function DataTablePekerjaan<TData, TValue>({
  columns,
  data,
  sub_investasi,
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
      <DataTableToolbarPekerjaan table={table} />
      <div className='rounded-md border'>
        <Table>
        <thead className='from-blue-500 to-green-500 bg-gradient bg-gradient-to-r text-white'>
            <tr>
            <th rowSpan={3} className='border'>
                Regional
              </th>
              <th colSpan={6} className='border py-2'>
                {sub_investasi}
              </th>
            </tr>
            <tr>
              <th colSpan={2} className='tg-bcrq border py-1'>
                RKAP
              </th>
              <th className='tg-bcrq border py-1'>Tekpol</th>
              <th className='tg-bcrq border py-1'>HPS</th>
              <th className='tg-bcrq border py-1'>Pengadaan</th>
              <th colSpan={2} className='tg-bcrq border py-1'>
                SPPBJ
              </th>
            </tr>
            <tr>
              <th className='tg-bcrq border'>Rp. M</th>
              <th className='tg-bcrq border'>Paket</th>
              <th className='tg-bcrq border'>Paket</th>
              <th className='tg-bcrq border'>Paket</th>
              <th className='tg-bcrq border'>Paket</th>
              <th className='tg-bcrq border'>Rp. M</th>
              <th className='tg-bcrq border'>Paket</th>
            </tr>
          </thead>
          <TableBody className='text-center'>
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
