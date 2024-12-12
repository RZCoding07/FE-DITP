import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface Data {
  id: string
  no_pk: string
  judul_pk: string
  dibuat_oleh: string
  fungsi_teknis: string
  total_nilai: string
  tgl_create_pk: string
  tgl_submit_pk_ke_hps: string
  nilai_hps: string
  nama_panitia_hps: string
  tgl_submit_ke_pengadaan: string
  panitia_pelaksana_pengadaan: string
  status: string
  pengadaan_bersama: string
  sumber_dana: string
  sub_investasi: string
  peruntukan: string
  tahun_anggaran: string
  user_id: string
}

const formatRupiah = (value: number) => {
  if (!value) return 'Rp. 0' // Jika nilai kosong atau null
  const numericValue = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(numericValue)) return 'Rp. 0' // Jika nilai bukan angka
  return `Rp. ${numericValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

export const columns: ColumnDef<Data>[] = [
  {
    id: 'number',
    header: 'No.',
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'no_ref',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No. Ref' />
    ),
    cell: ({ row }) => <span>{row.getValue('no_ref')}</span>,
  },
  {
    accessorKey: 'no_pk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No. PK' />
    ),
    cell: ({ row }) => <span>{row.getValue('no_pk')}</span>,
  },
  {
    accessorKey: 'no_sppbj',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No. SPPBJ' />
    ),
    cell: ({ row }) => <span>{row.getValue('no_sppbj')}</span>,
  },
  {
    accessorKey: 'title',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ row }) => <span>{row.getValue('title')}</span>,
  },
  {
    accessorKey: 'vendor',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Vendor' />
    ),
    cell: ({ row }) => <span>{row.getValue('vendor')}</span>,
  },
  {
    accessorKey: 'value',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Value' />
    ),
    cell: ({ row }) => (
      <span>{formatRupiah(Number(row.getValue('value')))}</span>
    ),
  },
  {
    accessorKey: 'tgl_approval_sppbj',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tgl Approval SPPBJ' />
    ),
    cell: ({ row }) => <span>{row.getValue('tgl_approval_sppbj')}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge color='primary' className='text-xs'>
        {row.getValue('status')}
      </Badge>
    ),
  },
  {
    accessorKey: 'panitia_pengadaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Panitia Pengadaan' />
    ),
    cell: ({ row }) => <span>{row.getValue('panitia_pengadaan')}</span>,
  },
  {
    accessorKey: 'user_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User ID' />
    ),
    cell: ({ row }) => <span>{row.getValue('user_id')}</span>,
  },
  {
    accessorKey: 'actions',
    header: 'Actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
