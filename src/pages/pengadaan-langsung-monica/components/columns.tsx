import { ColumnDef } from '@tanstack/react-table'

import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface masterData {
  id: string
  uraian_pekerjaan: string
  jenis_pekerjaan: string
}


export const columns: ColumnDef<masterData>[] = [
  {
    accessorKey: 'uraian_pekerjaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uraian Pekerjaan" />
    ),
    cell: ({ row }) => <div>{row.getValue('uraian_pekerjaan')}</div>,
  },
  {
    accessorKey: 'jenis_pekerjaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Jenis Pekerjaan" />
    ),
    cell: ({ row }) => <div>{row.getValue('jenis_pekerjaan')}</div>,
  },
  {
    accessorKey: 'actions',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Actions" />
    ),
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]