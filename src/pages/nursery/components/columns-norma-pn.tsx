import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';


interface masterData {
  user_id: string
   no_rekg: string
   uraian_pekerjaan: string
   satuan: string
   norma_standart: string
   is_main: number
   is_category: number
   is_subcategory: number
   is_checked: number
 }

export const columns: ColumnDef<masterData>[] = [
//   {
//     accessorKey: 'user_id',
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="User ID" />
//     ),
//     cell: ({ row }) => <div>{row.getValue('user_id')}</div>,
//   },
  {
    accessorKey: 'no_rekg',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="No. Rekg." />
    ),
    cell: ({ row }) => <div>{row.getValue('no_rekg')}</div>,
  },
  {
    accessorKey: 'uraian_pekerjaan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uraian Pekerjaan" />
    ),
    cell: ({ row }) => <div>{row.getValue('uraian_pekerjaan')}</div>,
  },
  {
    accessorKey: 'satuan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Satuan" />
    ),
    cell: ({ row }) => <div>{row.getValue('satuan')}</div>,
  },
  {
    accessorKey: 'norma_standart',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Norma Standart" />
    ),
    cell: ({ row }) => <div>{row.getValue('norma_standart')}</div>,
  },
  {
    accessorKey: 'is_main',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Main" />
    ),
    cell: ({ row }) => <div>{row.getValue('is_main') === 1 ? 'Yes' : 'No'}</div>,
  },
  {
    accessorKey: 'is_category',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Category" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('is_category') === 1 ? 'Yes' : 'No'}</div>
    ),
  },
  {
    accessorKey: 'is_subcategory',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is SubCategory" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('is_subcategory') === 1 ? 'Yes' : 'No'}</div>
    ),
  },
  {
    accessorKey: 'is_checked',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is Checked" />
    ),
    cell: ({ row }) => (
      <div>{row.getValue('is_checked') === 1 ? 'Yes' : 'No'}</div>
    ),
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
