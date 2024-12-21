import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface Peogress {
  id: string
  sub_investasi: string
  hps: string
  total_tekpol: string
  pengadaan: string
  sppbj: string
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
        <div className=" text-white px-2 py-1 rounded">
          <DataTableColumnHeader column={column} title='Sub Investasi' />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('sub_investasi')}</div>,
    },
    {
      accessorKey: 'hps',
      header: ({ column }) => (
        <div className=" text-white px-2 py-1 rounded">
          <DataTableColumnHeader column={column} title='HPS' />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('hps')} PAKET</div>,
    },
    {
      accessorKey: 'total_tekpol',
      header: ({ column }) => (
        <div className=" text-white px-2 py-1 rounded">
          <DataTableColumnHeader column={column} title='TekPol' />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('total_tekpol')} PAKET</div>,
    },
    {
      accessorKey: 'pengadaan',
      header: ({ column }) => (
        <div className=" text-white px-2 py-1 rounded">
          <DataTableColumnHeader column={column} title='Pengadaan' />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('pengadaan')} PAKET</div>,
    },
    {
      accessorKey: 'sppbj',
      header: ({ column }) => (
        <div className=" text-white px-2 py-1 rounded">
          <DataTableColumnHeader column={column} title='Terbit SPPBJ' />
        </div>
      ),
      cell: ({ row }) => <div>{row.getValue('sppbj')} PAKET</div>,
    },
    {
      accessorKey: 'value_sppbj',
      header: ({ column }) => (
        <div className=" text-white px-2 py-1 rounded">
          <DataTableColumnHeader column={column} title='Nilai SPPBJ' />
        </div>
      ),
      cell: ({ row }) => <div>{formatRupiah(parseFloat(row.getValue('value_sppbj')))}</div>,
    }
  ]
  