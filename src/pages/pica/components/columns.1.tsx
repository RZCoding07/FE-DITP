import { ColumnDef } from '@tanstack/react-table'
import { Vegetatif } from './columns'
import { DataTableColumnHeader } from './data-table-column-header'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import { FaPencilAlt } from 'react-icons/fa'

export const columns: ColumnDef<Vegetatif>[] = [

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
    accessorKey: 'luas',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Luas (Ha)'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('luas')}</span>
    ),
  },
  {
    accessorKey: 'tahunTanam',
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title='Tahun Tanam'
      />
    ),
    cell: ({ row }) => (
      <span>{row.getValue('tahunTanam')}</span>
    ),
  },

  {
    accessorKey: 'scoreJumlahPelepah',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Jumlah Pelepah' />
    ),
    cell: ({ row }) => <span>{row.getValue('scoreJumlahPelepah')}</span>,
  },
  {
    accessorKey: 'scoreKerapatanPokok',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Kerapatan Pokok' />
    ),
    cell: ({ row }) => <span>{(row.getValue('scoreKerapatanPokok') as number).toFixed(2)}</span>,
  },
  {
    accessorKey: 'scoreLingkarBatang',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Lingkar Batang' />
    ),
    cell: ({ row }) => <span>{row.getValue('scoreLingkarBatang')}</span>,
  },

  {
    accessorKey: 'scoreTinggiBatang',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Tinggi Batang' />
    ),
    cell: ({ row }) => <span>{row.getValue('scoreTinggiBatang')}</span>,
  },
  {
    accessorKey: 'totalSeleksian',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Nilai Vegetatif' />
    ),
    cell: ({ row }) => <span>{(row.getValue('totalSeleksian') as number).toFixed(2)}</span>,
  },
  {
    accessorKey: 'colorCategory',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Kategori Warna' />
    ),
    cell: ({ row }) =>  {
      const color = row.getValue('colorCategory') as string
      return (
        <Button
          size='sm'
          variant='default'
          className={` text-white`}
          style={{
            backgroundColor: color === 'red' ? '#DC143C' : 'rgba(15, 23, 42, 0.95)',
          }}
        >
          {color === 'red' ? 'MERAH' : 'HITAM'}
        </Button>
      )
    },
    
  },
  {
    accessorKey: 'aksi',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Aksi' />
    ),
    cell: ({ row }) => 
    <div className='flex space-x-2'>
      <Link to={`/data-vegetatif/${row.original.id}`}>
        <Button size='sm' variant='default'>
          <FaPencilAlt /> &nbsp; IDENTIFIKASI MASALAH
        </Button>
      </Link>
    </div>,
  },
  

]
