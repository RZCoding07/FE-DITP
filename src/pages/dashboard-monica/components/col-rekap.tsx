import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface Peogress {
  id: string
  sub_investasi: string
  hps: string
  tekpol: string
  pengadaan: string
  terbit_sppbj: string
}

const formatRupiah = (value: number) => {
    if (!value) return 'Rp. 0' // Jika nilai kosong atau null
    const numericValue = typeof value === 'number' ? value : parseFloat(value)
    if (isNaN(numericValue)) return 'Rp. 0' // Jika nilai bukan angka
    return `Rp. ${numericValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
  }

export const columns: ColumnDef<Peogress>[] = [
  {
    id: 'number',
    header: 'No.',
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'sub_investasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sub Investasi' />
    ),
    cell: ({ row }) => <div>{row.getValue('sub_investasi')}</div>,
  },
  {
    accessorKey: 'hps',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='HPS' />
    ),
    cell: ({ row }) => <div>{row.getValue('hps')} PAKET</div>,
  },
  {
    accessorKey: 'tekpol',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='TekPol' />
    ),
    cell: ({ row }) => <div>{row.getValue('tekpol')} PAKET</div>,
  },
  {
    accessorKey: 'pengadaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pengadaan' />
    ),
    cell: ({ row }) => <div>{row.getValue('pengadaan')} PAKET</div>,
  },
  {
    accessorKey: 'terbit_sppbj',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Terbit SPPBJ' />
    ),
    cell: ({ row }) => <div>{row.getValue('terbit_sppbj')} PAKET</div>,
  },
  {
    accessorKey: 'value_sppbj',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Terbit SPPBJ' />
    ),
    cell: ({ row }) => <div>{formatRupiah(parseFloat(row.getValue('value_sppbj')))}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
