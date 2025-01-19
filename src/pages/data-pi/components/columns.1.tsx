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
    accessorKey: 'w1',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='w1' />
    ),
    cell: ({ row }) => <span>{row.getValue('w1')}</span>,
  },
  {
    accessorKey: 'w2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='w2' />
    ),
    cell: ({ row }) => <span>{row.getValue('w2')}</span>,
  },
  {
    accessorKey: 'w3',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='w3' />
    ),
    cell: ({ row }) => <span>{row.getValue('w3')}</span>,
  },
 
  {
    accessorKey: 'measurement',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='measurement' />
    ),
    cell: ({ row }) => <span>{row.getValue('measurement')}</span>,
  },
 

]
