import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

import { SeleksiHasiliBibitan } from '../data/schema-nursery-selection'

export const columns: ColumnDef<SeleksiHasiliBibitan>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'user_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User ID' />
    ),
    cell: ({ row }) => <div className='truncate'>{row.getValue('user_id')}</div>,
  },
  {
    accessorKey: 'reg',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Reg' />
    ),
    cell: ({ row }) => <div>{row.getValue('reg')}</div>,
  },
  {
    accessorKey: 'kebun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kebun' />
    ),
    cell: ({ row }) => <div>{row.getValue('kebun')}</div>,
  },
  {
    accessorKey: 'batch',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Batch' />
    ),
    cell: ({ row }) => <div>{row.getValue('batch')}</div>,
  },
  {
    accessorKey: 'varietas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Varietas' />
    ),
    cell: ({ row }) => <div>{row.getValue('varietas')}</div>,
  },
  {
    accessorKey: 'tgl_kecambah_datang',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tgl Kecambah Datang' />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue('tgl_kecambah_datang')).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: 'tgl_kecambah_ditanam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tgl Kecambah Ditanam' />
    ),
    cell: ({ row }) => (
      <div>{new Date(row.getValue('tgl_kecambah_ditanam')).toLocaleDateString()}</div>
    ),
  },
  {
    accessorKey: 'jumlah_kecambah_diterima',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Kecambah Diterima' />
    ),
    cell: ({ row }) => <div>{row.getValue('jumlah_kecambah_diterima')}</div>,
  },
  {
    accessorKey: 'kecambah',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kecambah' />
    ),
    cell: ({ row }) => <div>{row.getValue('kecambah')}</div>,
  },
  {
    accessorKey: 'bulan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bulan' />
    ),
    cell: ({ row }) => <div>{row.getValue('bulan')}</div>,
  },
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun' />
    ),
    cell: ({ row }) => <div>{row.getValue('tahun')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
