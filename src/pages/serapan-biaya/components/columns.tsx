import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from './data-table-column-header';

interface SerapanBiaya {
  id: number;
  regional: string;
  kebun: string;
  luas: number;
  real_sd: number;
  rkap_sd: number;
  persen_serapan: number;
  rp_ha: number;
  nilai_vegetatif: number;
}

export const columns: ColumnDef<SerapanBiaya>[] = [
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
    accessorKey: 'luas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Luas' />
    ),
    cell: ({ row }) => <span>{row.getValue('luas')}</span>,
  },
  {
    accessorKey: 'real_sd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Real SD' />
    ),
    cell: ({ row }) => <span>{row.getValue('real_sd')}</span>,
  },
  {
    accessorKey: 'rkap_sd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='RKAP SD' />
    ),
    cell: ({ row }) => <span>{row.getValue('rkap_sd')}</span>,
  },
  {
    accessorKey: 'persen_serapan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Persen Serapan' />
    ),
    cell: ({ row }) => <span>{row.getValue('persen_serapan')}</span>,
  },
  {
    accessorKey: 'rp_ha',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='RP/HA' />
    ),
    cell: ({ row }) => <span>{row.getValue('rp_ha')}</span>,
  },
  {
    accessorKey: 'nilai_vegetatif',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Vegetatif' />
    ),
    cell: ({ row }) => <span>{row.getValue('nilai_vegetatif')}</span>,
  },
];