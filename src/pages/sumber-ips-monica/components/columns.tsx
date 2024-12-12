import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface InvesAwal {
  id: string
  kode: string
  unit : string
  parent : string
  nama_investasi : string
  nomor_ppab_pp : string
  nomor_pk : string
  tgl_create_pk : string
  tgl_submit_ke_pengadaan : string
  nomor_sppbj : string
  no_rekg : string
  rencaana : string
  realisasi : string
  tahun : string
  user_id : string
}

const formatRupiah = (value: number) => {
  if (!value) return 'Rp. 0' // Jika nilai kosong atau null
  const numericValue = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(numericValue)) return 'Rp. 0' // Jika nilai bukan angka
  return `Rp. ${numericValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

export const columns: ColumnDef<InvesAwal>[] = [
  {
    accessorKey: 'kode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('kode')}</span>,
  },
  {
    accessorKey: 'unit',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Unit' />
    ),
    cell: ({ row }) => <span>{row.getValue('unit')}</span>,
  },
  {
    accessorKey: 'parent',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Parent' />
    ),
    cell: ({ row }) => <span>{row.getValue('parent')}</span>,
  },
  {
    accessorKey: 'nama_investasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('nama_investasi')}</span>,
  },
  {
    accessorKey: 'nomor_ppab_pp',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nomor PPAB/PP' />
    ),
    cell: ({ row }) => <span>{row.getValue('nomor_ppab_pp')}</span>,
  },
  {
    accessorKey: 'nomor_pk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nomor PK' />
    ),
    cell: ({ row }) => <span>{row.getValue('nomor_pk')}</span>,
  },
  {
    accessorKey: 'tgl_create_pk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tgl Create PK' />
    ),
    cell: ({ row }) => <span>{row.getValue('tgl_create_pk')}</span>,
  },
  {
    accessorKey: 'tgl_submit_ke_pengadaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tgl Submit ke Pengadaan' />
    ),
    cell: ({ row }) => <span>{row.getValue('tgl_submit_ke_pengadaan')}</span>,
  },
  {
    accessorKey: 'nomor_sppbj',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nomor SPPBJ' />
    ),
    cell: ({ row }) => <span>{row.getValue('nomor_sppbj')}</span>,
  },
  {
    accessorKey: 'no_rekg',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No Rekg' />
    ),
    cell: ({ row }) => <span>{row.getValue('no_rekg')}</span>,
  },
  // {
  //   accessorKey: 'rencaana',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Rencaana' />
  //   ),
  //   cell: ({ row }) => <span>{row.getValue('rencaana')}</span>,
  // },
  // {
  //   accessorKey: 'realisasi',
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title='Realisasi' />
  //   ),
  //   cell: ({ row }) => <span>{row.getValue('realisasi')}</span>,
  // },
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun' />
    ),
    cell: ({ row }) => <span>{row.getValue('tahun')}</span>,
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
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Actions' />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  }
]
