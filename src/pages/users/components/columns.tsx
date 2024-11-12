import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface User {
  id: string;
  email?: string;
  fullname?: string;
  avatar?: string;
  username: string;
  password: string;
  role: string;
  rpc?: string;
  kebun?: string;
  afdeling?: string;
  refreshToken?: string;
  lastLogin?: string;
  account_type?: string;
  createdAt: string;
  updatedAt: string;
}

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='ID' />,
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Username' />,
    cell: ({ row }) => <span>{row.getValue('username')}</span>,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => <span>{row.getValue('email')}</span>,
  },
  {
    accessorKey: 'fullname',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Full Name' />,
    cell: ({ row }) => <span>{row.getValue('fullname')}</span>,
  },
  {
    accessorKey: 'avatar',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Avatar' />,
    cell: ({ row }) => (
      <img src={ '/' +  row.getValue('avatar') || 'default.png'} alt='Avatar' className='w-10 h-10 rounded-full' />
    ),
  },

  {
    accessorKey: 'role',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Role' />,
    cell: ({ row }) => <Badge variant='outline'>{row.getValue('role')}</Badge>,
  },
  {
    accessorKey: 'rpc',
    header: ({ column }) => <DataTableColumnHeader column={column} title='RPC' />,
    cell: ({ row }) => <span>{row.getValue('rpc')}</span>,
  },
  {
    accessorKey: 'kebun',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Kebun' />,
    cell: ({ row }) => <span>{row.getValue('kebun')}</span>,
  },
  {
    accessorKey: 'afdeling',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Afdeling' />,
    cell: ({ row }) => <span>{row.getValue('afdeling')}</span>,
  },
  {
    accessorKey: 'lastLogin',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Last Login' />,
    cell: ({ row }) => (
      <span>{row.getValue('lastLogin') ? new Date(row.getValue('lastLogin')).toLocaleString() : '-'}</span>
    ),
  },
  {
    accessorKey: 'account_type',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Account Type' />,
    cell: ({ row }) => <span>{row.getValue('account_type')}</span>,
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Created At' />,
    cell: ({ row }) => <span>{new Date(row.getValue('createdAt')).toLocaleDateString()}</span>,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Updated At' />,
    cell: ({ row }) => <span>{new Date(row.getValue('updatedAt')).toLocaleDateString()}</span>,
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DataTableRowActions row={row} />
    ),
  },
];
