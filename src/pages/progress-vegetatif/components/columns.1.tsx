import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';
import { Vegetatif } from './columns';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';
import { Checkbox } from '@/components/ui/checkbox';

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
    accessorKey: 'Jenis TBM',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jenis TBM' />
    ),
    cell: ({ row }) => <span>{String(row.getValue('Jenis TBM')).toUpperCase()}</span>,
  },
  {
    accessorKey: 'Regional',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Regional' />
    ),
    cell: ({ row }) => <span>{row.getValue('Regional')}</span>,
  },
  {
    accessorKey: 'Kode Kebun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kode Kebun' />
    ),
    cell: ({ row }) => <span>{row.getValue('Kode Kebun')}</span>,
  },
  {
    accessorKey: 'Nama Kebun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nama Kebun' />
    ),
    cell: ({ row }) => <span>{row.getValue('Nama Kebun')}</span>,
  },
  {
    accessorKey: 'Luasan Input Vegetatif',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Luasan Input Vegetatif' />
    ),
    cell: ({ row }) => <span>{formatNumber(row.getValue('Luasan Input Vegetatif'))}</span>,
  },
  {
    accessorKey: 'Total Luas Kebun Areal',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Total Luas Kebun Areal' />
    ),
    cell: ({ row }) => <span>{formatNumber(row.getValue('Total Luas Kebun Areal'))}</span>,
  },
  {
    accessorKey: 'Progress (%)',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Progress (%)' />
    ),
    cell: ({ row }) => <span>{formatNumber(row.getValue('Progress (%)'))}</span>,
  },
  {
    id: 'actions',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Actions" />,
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];