import { ColumnDef } from '@tanstack/react-table'
import { Vegetatif } from './columns'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'



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
 
  {
    accessorKey: 'approval',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='approval' />
    ),
    cell: ({ row }) => <span>{row.getValue('approval')}</span>,
  },
 
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='status' />
    ),
    cell: ({ row }) => <span>{row.getValue('status')}</span>,
  },
  //  {
  //    id: 'actions',
  //    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
  //    cell: ({ row }) => <DataTableRowActions row={row} />,
  //  },
 

]
