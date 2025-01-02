import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface Peogress {
  rpc_code: string
  n43: string
  n44: string
  n45: string
  n46: string
  n47: string
  n48: string
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
    accessorKey: 'rpc_code',
    header: ({ column }) => (
      <div className=' rounded px-2 py-1 text-white'>
        <DataTableColumnHeader column={column} title='RPC Code' />
      </div>
    ),
    cell: ({ row }) => <div>{(row.getValue('rpc_code') as string).toUpperCase()}</div>,
  },
  {
    accessorKey: 'n43',
    header: ({ column }) => (
      <div className=' rounded px-2 py-1 text-white'>
        <DataTableColumnHeader column={column} title='Bangunan Perumahan' />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue('n43')} PAKET</div>,
  },
  {
    accessorKey: 'n44',
    header: ({ column }) => (
      <div className=' rounded px-2 py-1 text-white'>
        <DataTableColumnHeader column={column} title='Bangunan Perusahaan' />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue('n44')} PAKET</div>,
  },
  {
    accessorKey: 'n45',
    header: ({ column }) => (
      <div className=' rounded px-2 py-1 text-white'>
        <DataTableColumnHeader column={column} title='Mesin & Instalasi' />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue('n45')} PAKET</div>,
  },
  {
    accessorKey: 'n46',
    header: ({ column }) => (
      <div className=' rounded px-2 py-1 text-white'>
        <DataTableColumnHeader column={column} title='Jalan, Jembatan & Saluran Air' />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue('n46')} PAKET</div>,
  },
  {
    accessorKey: 'n47',
    header: ({ column }) => (
      <div className=' rounded px-2 py-1 text-white'>
        <DataTableColumnHeader column={column} title='Alat Pengangkutan (Transportasi)' />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue('n47')} PAKET</div>,
  },
  {
    accessorKey: 'n48',
    header: ({ column }) => (
      <div className=' rounded px-2 py-1 text-white'>
        <DataTableColumnHeader column={column} title='Investasi Kecil' />
      </div>
    ),
    cell: ({ row }) => <div>{row.getValue('n48')} PAKET</div>,
  },
]
