import { ColumnDef } from '@tanstack/react-table'
import { cn } from '@/lib/utils'
import { Vegetatif } from './columns'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '@/components/ui/checkbox'
// Helper function to format numbers with 2 decimal places
const formatNumber = (value: any) => {
  const num = parseFloat(value);
  return isNaN(num) ? value : num.toFixed(2);
};

export const columns: ColumnDef<Vegetatif>[] = [
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
    meta: {
      className: cn(
        'sticky md:table-cell left-0 z-10 rounded-tl',
        'bg-background transition-colors duration-200 group-hover/row:bg-muted group-data-[state=selected]/row:bg-muted'
      ),
    },
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
    accessorKey: 'bulan_tanam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bulan Tanam' />
    ),
    cell: ({ row }) => <span>{row.getValue('bulan_tanam')}</span>,
  },
  {
    accessorKey: 'tahun_tanam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun Tanam' />
    ),
    cell: ({ row }) => <span>{row.getValue('tahun_tanam')}</span>,
  },
  {
    accessorKey: 'umur_saat_ini_bulan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Umur' />
    ),
    cell: ({ row }) => <span>{row.getValue('umur_saat_ini_bulan')}</span>,
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
    cell: ({ row }) => <span>{formatNumber(row.getValue('luas_ha'))}</span>,
  },
  {
    accessorKey: 'pkk_ha_awal_tanam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PKK (Ha) Awal Tanam' />
    ),
    cell: ({ row }) => <span>{formatNumber(row.getValue('pkk_ha_awal_tanam'))}</span>,
  },
  {
    accessorKey: 'pkk_ha_saat_ini',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='PKK (Ha) Saat Ini' />
    ),
    cell: ({ row }) => <span>{formatNumber(row.getValue('pkk_ha_saat_ini'))}</span>,
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
      <span>{formatNumber(row.getValue('jumlah_pokok_awal_tanam'))}</span>
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
      <span>{formatNumber(row.getValue('jumlah_pokok_sekarang'))}</span>
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
      <span>{formatNumber(row.getValue('tinggi_tanaman_cm'))}</span>
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
      <span>{formatNumber(row.getValue('jumlah_pelepah_bh'))}</span>
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
      <span>{formatNumber(row.getValue('panjang_rachis_cm'))}</span>
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
      <span>{formatNumber(row.getValue('lebar_petiola_cm'))}</span>
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
      <span>{formatNumber(row.getValue('tebal_petiola_cm'))}</span>
    ),
  },
  {
    accessorKey: 'jumlah_anak_daun',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Jumlah Anak Daun 1 Sisi'
      />
    ),
    cell: ({ row }) => (
      <span>{formatNumber(row.getValue('jumlah_anak_daun'))}</span>
    ),
  },
  {
    accessorKey: 'rerata_panjang_anak_daun',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Rerata Panjang Anak Daun'
      />
    ),
    cell: ({ row }) => (
      <span>{formatNumber(row.getValue('rerata_panjang_anak_daun'))}</span>
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
      <span>{formatNumber(row.getValue('rerata_lebar_anak_daun'))}</span>
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
      <span>{formatNumber(row.getValue('lingkar_batang_cm'))}</span>
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
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tanggal Update'
      />
    ),
    cell: ({ row }) => (
      <span>{new Date(row.getValue('updatedAt')).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })}</span>
    ),
  },
  // {
  //   id: 'actions',
  //   header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
];