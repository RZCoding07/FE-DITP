import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<any>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // {
  //   accessorKey: 'id',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='ID' />
  //   ),
  //   cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
  //   enableSorting: true,
  //   enableHiding: false,
  // },
  {
    accessorKey: 'bidang_tanaman',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bidang Tanaman' />
    ),
    cell: ({ row }) => <div className='max-w-32 truncate'>{row.getValue('bidang_tanaman')}</div>,
  },
  {
    accessorKey: 'jenis_pekerjaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis Pekerjaan' />
    ),
    cell: ({ row }) => <div className='max-w-32 truncate'>{row.getValue('jenis_pekerjaan')}</div>,
  },
  {
    accessorKey: 'satuan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Satuan' />
    ),
    cell: ({ row }) => <div className='max-w-32 truncate'>{row.getValue('satuan')}</div>,
  },
  {
    accessorKey: 'norma_tp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Norma TP' />
    ),
    cell: ({ row }) => <div>{row.getValue('norma_tp')}</div>,
  },
  {
    accessorKey: 'norma_ts',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Norma TS' />
    ),
    cell: ({ row }) => <div>{row.getValue('norma_ts')}</div>,
  },
  {
    accessorKey: 'pedoman',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pedoman' />
    ),
    cell: ({ row }) => <div className='max-w-32 truncate'>{row.getValue('pedoman')}</div>,
  },
  {
    accessorKey: 'jenis_tbm',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis TBM' />
    ),
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
