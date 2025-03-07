import { ColumnDef } from '@tanstack/react-table'
import { Vegetatif } from './columns'
import { DataTableColumnHeader } from './data-table-column-header'

export const columns: ColumnDef<Vegetatif>[] = [
  {
    id: 'number',
    header: 'No.',
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
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
      <span>{Number(row.getValue('tinggi_tanaman_cm')).toFixed(2)}</span>
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
      <span>{Number(row.getValue('jumlah_pelepah_bh')).toFixed(2)}</span>
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
