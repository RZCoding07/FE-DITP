import { ColumnDef } from '@tanstack/react-table'
import { Vegetatif } from './columns'
import { DataTableColumnHeader } from './data-table-column-header'

export const columns: ColumnDef<Vegetatif>[] = [
  {
    accessorKey: 'entitas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Entitas' />
    ),
    cell: ({ row }) => <span>{row.getValue('entitas')}</span>,
  },
  {
    accessorKey: 'kebun',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kebun' />
    ),
    cell: ({ row }) => <span>{row.getValue('kebun')}</span>,
  },
  {
    accessorKey: 'afd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Afd' />
    ),
    cell: ({ row }) => <span>{row.getValue('afd')}</span>,
  },
  {
    accessorKey: 'tahunTanam',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tahun Tanam' />
    ),
    cell: ({ row }) => <span>{row.getValue('tahunTanam')}</span>,
  },
  {
    accessorKey: 'blok',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Blok' />
    ),
    cell: ({ row }) => <span>{row.getValue('blok')}</span>,
  },
  {
    accessorKey: 'luas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Luas (Ha)' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('luas')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'sph',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='SPH' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('sph')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'varietas',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Varietas' />
    ),
    cell: ({ row }) => <span>{row.getValue('varietas')}</span>,
  },
  {
    accessorKey: 'lingkarBatang',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lingkar Batang (cm)' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('lingkarBatang')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'tinggiBatang',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Tinggi Batang (cm)' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('tinggiBatang')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'jumlahPelepah',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Jumlah Pelepah' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('jumlahPelepah')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'panjangRachis',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Panjang Rachis (cm)' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('panjangRachis')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'lebarPetiolaL',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lebar Petiola (cm)' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('lebarPetiolaL')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'lebarPetiolaT',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Lebar Petiola (cm)' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('lebarPetiolaT')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'jad',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='JAD (Helai)' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('jad')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'measurement1P',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='1P' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement1P')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'measurement1L',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='1L' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement1L')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'measurement2P',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='2P' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement2P')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'measurement2L',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='2L' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement2L')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'measurement3P',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='3P' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement3P')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'measurement3L',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='3L' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement3L')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'measurement4P',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='4P' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement4P')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'measurement4L',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='4L' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement4L')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },

  {
    accessorKey: 'measurement5P',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='5P' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement5P')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },

  {
    accessorKey: 'measurement5L',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='5L' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement5L')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },

  {
    accessorKey: 'measurement6P',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='6P' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement6P')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },

  {
    accessorKey: 'measurement6L',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='6L' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('measurement6L')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },

  {
    accessorKey: 'rerataP',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rerata' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('rerataP')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },
  },
  {
    accessorKey: 'rerataL',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Rerata' />
    ),
    cell: ({ row }) => {
      const value = row.getValue<string>('rerataL')
      const formattedValue =
        value && value !== '' ? parseFloat(value).toFixed(2) : '-'
      return <span>{formattedValue}</span>
    },

  }

]
