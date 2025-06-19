import { ColumnDef } from '@tanstack/react-table'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface ArealData {
  id: any
  kode_kebun: any
  tahun_tbm: any
  luasan: any
  bulan: any
  tahun: any
}

export const columns: ColumnDef<ArealData>[] = [
  {
    accessorKey: 'no',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No" />
    ),
    cell: ({ row }) => <div>{row.index + 1}</div>,
  },
  {
    accessorKey: 'kode_kebun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Kode Kebun" />
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('kode_kebun')}</div>,
  },
  {
    accessorKey: 'tahun_tbm',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tahun TBM" />
    ),
    cell: ({ row }) => <div>{row.getValue('tahun_tbm')}</div>,
  },
  {
    accessorKey: 'luasan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Luasan (Ha)" />
    ),
    cell: ({ row }) => {
      const luasan = parseFloat(row.getValue('luasan'))
      return <div>{luasan}</div>
    },
  },
  {
    accessorKey: 'bulan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bulan" />
    ),
    cell: ({ row }) => <div>{row.getValue('bulan')}</div>,
  },
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Tahun" />
    ),
    cell: ({ row }) => <div>{row.getValue('tahun')}</div>,
  },

]
