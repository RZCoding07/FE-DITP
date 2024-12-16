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
    accessorKey: 'no_pk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='No. PK' />
    ),
    cell: ({ row }) => <span>{row.getValue('no_pk')}</span>,
  },
  {
    accessorKey: 'judul_pk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Judul PK' />
    ),
    cell: ({ row }) => <span>{row.getValue('judul_pk')}</span>,
  },
  {
    accessorKey: 'dibuat_oleh',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Dibuat Oleh' />
    ),
    cell: ({ row }) => <span>{row.getValue('dibuat_oleh')}</span>,
  },
  {
    accessorKey: 'fungsi_teknis',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Fungsi Teknis' />
    ),
    cell: ({ row }) => <span>{row.getValue('fungsi_teknis')}</span>,
  },
  {
    accessorKey: 'total_nilai',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Nilai' />
    ),
    cell: ({ row }) => (
      <span>{formatRupiah(parseFloat(row.getValue('total_nilai')))}</span>
    ),
  },
  {
    accessorKey: 'tgl_create_pk',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tgl. Create PK' />
    ),
    cell: ({ row }) => <span>{row.getValue('tgl_create_pk')}</span>,
  },
  {
    accessorKey: 'tgl_submit_pk_ke_hps',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tgl. Submit PK ke HPS' />
    ),
    cell: ({ row }) => <span>{row.getValue('tgl_submit_pk_ke_hps')}</span>,
  },
  {
    accessorKey: 'nilai_hps',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai HPS' />
    ),
    cell: ({ row }) => (
      <span>{formatRupiah(parseFloat(row.getValue('nilai_hps')))}</span>
    ),
  },
  {
    accessorKey: 'nama_panitia_hps',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Panitia HPS' />
    ),
    cell: ({ row }) => <span>{row.getValue('nama_panitia_hps')}</span>,
  },
  {
    accessorKey: 'tgl_submit_ke_pengadaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tgl. Submit ke Pengadaan' />
    ),
    cell: ({ row }) => <span>{row.getValue('tgl_submit_ke_pengadaan')}</span>,
  },
  {
    accessorKey: 'panitia_pelaksana_pengadaan',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Panitia Pelaksana Pengadaan'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('panitia_pelaksana_pengadaan')}</span>
    ),
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => (
      <Badge color='success'>{row.getValue('status')}</Badge>
    ),
  },
  {
    accessorKey: 'pengadaan_bersama',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Pengadaan Bersama' />
    ),
    cell: ({ row }) => <span>{row.getValue('pengadaan_bersama')}</span>,
  },
  {
    accessorKey: 'sumber_dana',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sumber Dana' />
    ),
    cell: ({ row }) => <span>{row.getValue('sumber_dana')}</span>,
  },
  {
    accessorKey: 'sub_investasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Sub Investasi' />
    ),
    cell: ({ row }) => <span>{row.getValue('sub_investasi')}</span>,
  },
  {
    accessorKey: 'peruntukan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Peruntukan' />
    ),
    cell: ({ row }) => <span>{row.getValue('peruntukan')}</span>,
  },
  {
    accessorKey: 'tahun_anggaran',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun Anggaran' />
    ),
    cell: ({ row }) => <span>{row.getValue('tahun_anggaran')}</span>,
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
