import { ColumnDef } from '@tanstack/react-table'
import { Vegetatif } from './columns'
import { DataTableColumnHeader } from './data-table-column-header'

const formatNumber = (value: any) => {
  const num = parseFloat(value);
  return isNaN(num) ? value : num.toFixed(2);
};

const getScoreColor = (score: number) => {
  if (score >= 100) return 'bg-yellow-500 text-white';
  if (score >= 90) return 'bg-green-500 text-white';
  if (score >= 0) return 'bg-red-500 text-white';
  return '';
};

export const columns: ColumnDef<Vegetatif>[] = [
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
    accessorKey: 'afdeling',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Afdeling' />
    ),
    cell: ({ row }) => <span>{row.getValue('afdeling')}</span>,
  },
  {
    accessorKey: 'blok',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Blok' />
    ),
    cell: ({ row }) => <span>{row.getValue('blok')}</span>,
  },
  {
    accessorKey: 'tahun_tanam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun Tanam' />
    ),
    cell: ({ row }) => <span>{row.getValue('tahun_tanam')}</span>,
  },
  {
    accessorKey: 'varietas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Varietas' />
    ),
    cell: ({ row }) => <span>{row.getValue('varietas')}</span>,
  },
  {
    accessorKey: 'luas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Luas (Ha)' />
    ),
    cell: ({ row }) => <span>{row.getValue('luas')}</span>,
  },
  {
    accessorKey: 'jumlah_pokok_awal_tanam',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Jumlah Pokok Awal Tanam (pkk)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('jumlah_pokok_awal_tanam')}</span>
    ),
  },
  {
    accessorKey: 'jumlah_pokok_sekarang',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Jumlah Pokok Sekarang (pkk)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('jumlah_pokok_sekarang')}</span>
    ),
  },
  {
    accessorKey: 'tinggi_tanaman_cm',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tinggi Tanaman (cm)'
      />
    ),
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded">{formatNumber(row.getValue('tinggi_tanaman_cm'))}</span>
    ),
  },
  {
    accessorKey: 'jumlah_pelepah_bh',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Jumlah Pelepah (Bh)'
      />
    ),
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded">{formatNumber(row.getValue('jumlah_pelepah_bh'))}</span>
    ),
  },
  {
    accessorKey: 'lingkar_batang_cm',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Lingkar Batang (cm)'
      />
    ),
    cell: ({ row }) => (
      <span className="px-2 py-1 rounded">{formatNumber(row.getValue('lingkar_batang_cm'))}</span>
    ),
  },
  {
    accessorKey: 'ascoreKerapatanPokok',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Skor Kerapatan Pokok'
      />
    ),
    cell: ({ row }) => {
      const score = parseFloat(row.getValue('ascoreKerapatanPokok')) || 0;
      return (
        <span className={`px-2 py-1 rounded ${getScoreColor(score)}`}>
          {formatNumber(score)}
        </span>
      );
    },
  },
  {
    accessorKey: 'ascoreTinggiBatang',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Skor Tinggi Tanaman'
      />
    ),
    cell: ({ row }) => {
      const score = parseFloat(row.getValue('ascoreTinggiBatang')) || 0;
      return (
        <span className={`px-2 py-1 rounded ${getScoreColor(score)}`}>
          {formatNumber(score)}
        </span>
      );
    },
  },
  {
    accessorKey: 'ascoreJumlahPelepah',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Skor Jumlah Pelepah'
      />
    ),
    cell: ({ row }) => {
      const score = parseFloat(row.getValue('ascoreJumlahPelepah')) || 0;
      return (
        <span className={`px-2 py-1 rounded ${getScoreColor(score)}`}>
          {formatNumber(score)}
        </span>
      );
    },
  },
  {
    accessorKey: 'ascoreLingkarBatang',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Skor Lingkar Batang'
      />
    ),
    cell: ({ row }) => {
      const score = parseFloat(row.getValue('ascoreLingkarBatang')) || 0;
      return (
        <span className={`px-2 py-1 rounded ${getScoreColor(score)}`}>
          {formatNumber(score)}
        </span>
      );
    },
  },
  {
    accessorKey: 'tahun',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tahun'
      />
    ),
    cell: ({ row }) => (
      <span>{Number(row.getValue('tahun'))}</span>
    ),
  },
  {
    accessorKey: 'bulan',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Bulan'
      />
    ),
    cell: ({ row }) => (
      <span>{Number(row.getValue('bulan'))}</span>
    ),
  },
];