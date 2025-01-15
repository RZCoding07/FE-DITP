import { ColumnDef } from '@tanstack/react-table'
import { Vegetatif } from './columns'
import { DataTableColumnHeader } from './data-table-column-header'


// regional: string
// kebun: string
// afdeling: string
// blok: string
// tahun_tanam: string
// varietas: string
// luas_ha: string
// jumlah_pokok_awal_tanam: string
// jumlah_pokok_sekarang: string
// tinggi_tanaman_cm: string
// jumlah_pelepah_bh: string
// panjang_rachis_cm: string
// lebar_petiola_cm: string
// tebal_petiola_cm: string
// jad_1_sisi: string
// rerata_panjang_anak_daun: string
// rerata_lebar_anak_daun: string
// lingkar_batang_cm: string

export const columns: ColumnDef<Vegetatif>[] = [
  {
    accessorKey: 'regional',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Regional' />
    ),
    cell: ({ row }) => <span>{row.getValue('regional')}</span>,
  },
  {
    accessorKey: 'kebun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kebun' />
    ),
    cell: ({ row }) => <span>{row.getValue('kebun')}</span>,
  },
  {
    accessorKey: 'afdeling',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Afdeling' />
    ),
    cell: ({ row }) => <span>{row.getValue('afdeling')}</span>,
  },
  {
    accessorKey: 'blok',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Blok' />
    ),
    cell: ({ row }) => <span>{row.getValue('blok')}</span>,
  },
  {
    accessorKey: 'tahun_tanam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun Tanam' />
    ),
    cell: ({ row }) => <span>{row.getValue('tahun_tanam')}</span>,
  },
  {
    accessorKey: 'varietas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Varietas' />
    ),
    cell: ({ row }) => <span>{row.getValue('varietas')}</span>,
  },
  {
    accessorKey: 'luas_ha',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Luas (Ha)' />
    ),
    cell: ({ row }) => <span>{row.getValue('luas_ha')}</span>,
  },
  {
    accessorKey: 'jumlah_pokok_awal_tanam',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Jumlah Pokok Awal Tanam (pkk)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('jumlah_pokok_awal_tanam')}</span>
    ),
  },
  {
    accessorKey: 'jumlah_pokok_sekarang',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Jumlah Pokok Sekarang (pkk)'
      />
    ),
    cell: ({ row }) => (
      
      <span>{row.getValue('jumlah_pokok_sekarang')}</span>
    ),
},
{
    accessorKey: 'tinggi_tanaman_cm',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tinggi Tanaman (cm)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('tinggi_tanaman_cm')}</span>
    ),
  },
  {
    accessorKey: 'jumlah_pelepah_bh',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Jumlah Pelepah (Bh)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('jumlah_pelepah_bh')}</span>
    ),
  },
  {
    accessorKey: 'panjang_rachis_cm',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Panjang Rachis (cm)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('panjang_rachis_cm')}</span>
    ),
  },
  {
    accessorKey: 'lebar_petiola_cm',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Lebar Petiola (cm)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('lebar_petiola_cm')}</span>
    ),
  },
  {
    accessorKey: 'tebal_petiola_cm',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tebal Petiola (cm)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('tebal_petiola_cm')}</span>
    ),
  },
  {
    accessorKey: 'jad_1_sisi',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Jad 1 Sisi'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('jad_1_sisi')}</span>
    ),
  },
  {
    accessorKey: 'rerata_panjang_anak_daun',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='
Rerata Panjang Anak Daun'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('rerata_panjang_anak_daun')}</span>
    ),
  },
  {
    accessorKey: 'rerata_lebar_anak_daun',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Rerata Lebar Anak Daun'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('rerata_lebar_anak_daun')}</span>
    ),
  },
  {
    accessorKey: 'lingkar_batang_cm',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Lingkar Batang (cm)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('lingkar_batang_cm')}</span>
    ),
  },
{
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tahun'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('tahun')}</span>
    ),
  },
  {
    accessorKey: 'bulan',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Bulan'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('bulan')}</span>
    ),
  },

]
