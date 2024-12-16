import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface Peogress {
  id: string;
  no_pk: string;
  judul_pk: string;
  dibuat_oleh: string;
  fungsi_teknis: string;
  total_nilai: string;
  tgl_create_pk: string;
  tgl_submit_pk_ke_hps: string;
  nilai_hps: string;
  nama_panitia_hps: string;
  tgl_submit_ke_pengadaan: string;
  panitia_pelaksana_pengadaan: string;
  status_pk: string;
  pengadaan_bersama: string;
  sumber_dana: string;
  sub_investasi: string;
  peruntukan: string;
  tahun_anggaran: string;
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
    accessorKey: 'no_pk',
    header: ({ column }) => <DataTableColumnHeader column={column} title='No. PK' />,
    cell: ({ row }) => <div>{row.getValue('no_pk')}</div>,
  },
  {
    accessorKey: 'judul_pk',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Judul PK' />,
    cell: ({ row }) => <div>{row.getValue('judul_pk')}</div>,
  },
  {
    accessorKey: 'dibuat_oleh',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Dibuat Oleh' />,
    cell: ({ row }) => <div>{row.getValue('dibuat_oleh')}</div>,
  },
  {
    accessorKey: 'fungsi_teknis',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Fungsi Teknis' />,
    cell: ({ row }) => <div>{row.getValue('fungsi_teknis')}</div>,
  },
  {
    accessorKey: 'total_nilai',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Total Nilai' />,
    cell: ({ row }) => <div>{row.getValue('total_nilai')}</div>,
  },
  {
    accessorKey: 'tgl_create_pk',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tgl Create PK' />,
    cell: ({ row }) => <div>{row.getValue('tgl_create_pk')}</div>,
  },
  {
    accessorKey: 'tgl_submit_pk_ke_hps',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tgl Submit PK ke HPS' />,
    cell: ({ row }) => <div>{row.getValue('tgl_submit_pk_ke_hps')}</div>,
  },
  {
    accessorKey: 'nilai_hps',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nilai HPS' />,
    cell: ({ row }) => <div>{row.getValue('nilai_hps')}</div>
  },
  {
    accessorKey: 'nama_panitia_hps',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Nama Panitia HPS' />,
    cell: ({ row }) => <div>{row.getValue('nama_panitia_hps')}</div>,
  },
  {
    accessorKey: 'tgl_submit_ke_pengadaan',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tgl Submit ke Pengadaan' />,
    cell: ({ row }) => <div>{row.getValue('tgl_submit_ke_pengadaan')}</div>,
  },
  {
    accessorKey: 'panitia_pelaksana_pengadaan',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Panitia Pelaksana Pengadaan' />,
    cell: ({ row }) => <div>{row.getValue('panitia_pelaksana_pengadaan')}</div>,
  },
  {
    accessorKey: 'status_pk',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status PK' />,
    cell: ({ row }) => <div>{row.getValue('status_pk')}</div>,
  },
  {
    accessorKey: 'pengadaan_bersama',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Pengadaan Bersama' />,
    cell: ({ row }) => <div>{row.getValue('pengadaan_bersama')}</div>,
  },
  {
    accessorKey: 'sumber_dana',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sumber Dana' />,
    cell: ({ row }) => <div>{row.getValue('sumber_dana')}</div>,
  },
  {
    accessorKey: 'sub_investasi',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Sub Investasi' />,
    cell: ({ row }) => <div>{row.getValue('sub_investasi')}</div>,
  },
  {
    accessorKey: 'peruntukan',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Peruntukan' />,
    cell: ({ row }) => <div>{row.getValue('peruntukan')}</div>,
  },
  {
    accessorKey: 'tahun_anggaran',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tahun Anggaran' />,
    cell: ({ row }) => <div>{row.getValue('tahun_anggaran')}</div>,
  },

      {

    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions row={row} />
    ),
  },
];
