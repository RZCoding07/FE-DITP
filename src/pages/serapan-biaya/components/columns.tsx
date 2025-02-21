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
  bulan: string;
  tahun: number;
}

function formatNumber(number: number) {
  return new Intl.NumberFormat('id-ID').format(number);
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
    cell: ({ row }) => <span>{formatNumber(row.getValue('real_sd'))}</span>,
  },
  {
    accessorKey: 'rkap_sd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='RKAP SD' />
    ),
    cell: ({ row }) => <span>{formatNumber(row.getValue('rkap_sd'))}</span>,
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
    cell: ({ row }) => <span>{formatNumber(row.getValue('rp_ha'))}</span>,
  },
  {
    accessorKey: 'bulan',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Bulan' />
    ),
    cell: ({ row }) => <span>{row.getValue('bulan')}</span>,
  },
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun' />
    ),
    cell: ({ row }) => <span>{row.getValue('tahun')}</span>,
  },

];