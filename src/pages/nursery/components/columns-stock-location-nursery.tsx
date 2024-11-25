import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

import { StokLokasiBibitan } from '../data/schema-nursery'

export const columns: ColumnDef<StokLokasiBibitan>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='ID' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'user_id',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='User ID' />
    ),
    cell: ({ row }) => <div className='truncate'>{row.getValue('user_id')}</div>,
  },
  {
    accessorKey: 'regional',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Regional' />
    ),
    cell: ({ row }) => <div>{row.getValue('regional')}</div>,
  },
  {
    accessorKey: 'kebun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kebun' />
    ),
    cell: ({ row }) => <div>{row.getValue('kebun')}</div>,
  },
  {
    accessorKey: 'varietas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Varietas' />
    ),
    cell: ({ row }) => <div>{row.getValue('varietas')}</div>,
  },
  {
    accessorKey: 'lokasi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lokasi' />
    ),
    cell: ({ row }) => <div>{row.getValue('lokasi')}</div>,
  },

  {
    accessorKey: 'nursery_month_1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 1' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_1')}</div>,
  },
  {
    accessorKey: 'nursery_month_2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 2' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_2')}</div>,
  },
  {
    accessorKey: 'nursery_month_3',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 3' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_3')}</div>,
  },
  {
    accessorKey: 'nursery_month_4',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 4' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_4')}</div>,
  },
  {
    accessorKey: 'nursery_month_5',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 5' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_5')}</div>,
  },
  {
    accessorKey: 'nursery_month_6',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 6' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_6')}</div>,
  },
  {
    accessorKey: 'nursery_month_7',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 7' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_7')}</div>,
  },
  {
    accessorKey: 'nursery_month_8',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 8' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_8')}</div>,
  },
  {
    accessorKey: 'nursery_month_9',
    header: ({ column }) => ( 
      <DataTableColumnHeader column={column} title='Nursery Month 9' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_9')}</div>,
  },
  {
    accessorKey: 'nursery_month_10',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 10' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_10')}</div>,
  },
  {
    accessorKey: 'nursery_month_11',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 11' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_11')}</div>,
  },
  {
    accessorKey: 'nursery_month_12',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 12' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_12')}</div>,
  },
  {
    accessorKey: 'nursery_month_13',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 13' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_13')}</div>,
  },
  {
    accessorKey: 'nursery_month_14',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 14' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_14')}</div>,
  },
  {
    accessorKey: 'nursery_month_15',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 15' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_15')}</div>,
  },
  {
    accessorKey: 'nursery_month_16',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 16' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_16')}</div>,
  },
  {
    accessorKey: 'nursery_month_17',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 17' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_17')}</div>,
  },
  {
    accessorKey: 'nursery_month_18',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 18' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_18')}</div>,
  },
  {
    accessorKey: 'nursery_month_19',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 19' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_19')}</div>,
  },
  {
    accessorKey: 'nursery_month_20',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 20' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_20')}</div>,
  },
  {
    accessorKey: 'nursery_month_21',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 21' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_21')}</div>,
  },
  {
    accessorKey: 'nursery_month_22',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 22' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_22')}</div>,
  },
  {
    accessorKey: 'nursery_month_23',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 23' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_23')}</div>,
  },
  {
    accessorKey: 'nursery_month_24',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 24' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_24')}</div>,
  },
  {
    accessorKey: 'nursery_month_25',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 25' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_25')}</div>,
  },
  {
    accessorKey: 'nursery_month_26',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 26' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_26')}</div>,
  },
  {
    accessorKey: 'nursery_month_27',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 27' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_27')}</div>,
  },
  {
    accessorKey: 'nursery_month_28',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 28' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_28')}</div>,
  },
  {
    accessorKey: 'nursery_month_29',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 29' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_29')}</div>,
  },
  {
    accessorKey: 'nursery_month_30_plus',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nursery Month 30+' />
    ),
    cell: ({ row }) => <div>{row.getValue('nursery_month_30_plus')}</div>,
  },
  {
    accessorKey: 'jumlah',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah' />
    ),
    cell: ({ row }) => <div>{row.getValue('jumlah')}</div>,
  },
  {
    accessorKey: 'jumlah_siap_salur',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Siap Salur' />
    ),
    cell: ({ row }) => <div>{row.getValue('jumlah_siap_salur')}</div>,
  },
  {
    accessorKey: 'bulan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bulan' />
    ),
    cell: ({ row }) => <div>{row.getValue('bulan')}</div>,
  },
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun' />
    ),
    cell: ({ row }) => <div>{row.getValue('tahun')}</div>,
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
