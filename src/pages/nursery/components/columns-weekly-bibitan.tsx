// SELECT
//     `id`
//     , `reg`
//     , `b`
//     , `c`
//     , `d`
//     , `e`
//     , `e2`
//     , `f`
//     , `g`
//     , `h`
//     , `i`
//     , `j`
//     , `k`
//     , `l`
//     , `keterangan`
//     , `createdAt`
//     , `updatedAt`
//     , `user_id`
//     , `dari_tanggal`
//     , `sampai_tanggal`
// FROM
//     `weekly_report`;


import { ColumnDef } from '@tanstack/react-table';

import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';


interface masterData {
//     , `reg`
//     , `b`
//     , `c`
//     , `d`
//     , `e`
//     , `e2`
//     , `f`
//     , `g`
//     , `h`
//     , `i`
//     , `j`
//     , `k`
//     , `l`
//     , `keterangan`
//     , `createdAt`
//     , `updatedAt`
//     , `user_id`
//     , `dari_tanggal`
//     , `sampai_tanggal`

    reg: string
    b: string
    c: string
    d: string
    e: string
    e2: string
    f: string
    g: string
    h: string   
    i: string
    j: string
    k: string
    l: string
    keterangan: string
    dari_tanggal: string
    sampai_tanggal: string
    }

export const columns: ColumnDef<masterData>[] = [
  {
    accessorKey: 'reg',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Reg" />
    ),
    cell: ({ row }) => <div>{row.getValue('reg')}</div>,
  },
  {
    accessorKey: 'b',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="B" />
    ),
    cell: ({ row }) => <div>{row.getValue('b')}</div>,
  },
  {
    accessorKey: 'c',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="C" />
    ),
    cell: ({ row }) => <div>{row.getValue('c')}</div>,
  },
  {
    accessorKey: 'd',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="D" />
    ),
    cell: ({ row }) => <div>{row.getValue('d')}</div>,
  },
  {
    accessorKey: 'e',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E" />
    ),
    cell: ({ row }) => <div>{row.getValue('e')}</div>,
  },
  {
    accessorKey: 'e2',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="E2" />
    ),
    cell: ({ row }) => <div>{row.getValue('e2')}</div>,
  },
  {
    accessorKey: 'f',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="F" />
    ),
    cell: ({ row }) => <div>{row.getValue('f')}</div>,
  },
  {
    accessorKey: 'g',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="G" />
    ),
    cell: ({ row }) => <div>{row.getValue('g')}</div>,
  },
  {
    accessorKey: 'h',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="H" />
    ),
    cell: ({ row }) => <div>{row.getValue('h')}</div>,
  },
  {
    accessorKey: 'i',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="I" />
    ),
    cell: ({ row }) => <div>{row.getValue('i')}</div>,
    },
    {
        accessorKey: 'j',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="J" />
        ),
        cell: ({ row }) => <div>{row.getValue('j')}</div>,
      },
      {
        accessorKey: 'k',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="K" />
        ),
        cell: ({ row }) => <div>{row.getValue('k')}</div>,
      },
      {
        accessorKey: 'l',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="L" />
        ),
        cell: ({ row }) => <div>{row.getValue('l')}</div>,
      },
      {
        accessorKey: 'keterangan',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Keterangan" />
        ),
        cell: ({ row }) => <div>{row.getValue('keterangan')}</div>,
      },
      {
        accessorKey: 'dari_tanggal',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Dari Tanggal" />
        ),
        cell: ({ row }) => <div>{row.getValue('dari_tanggal')}</div>
      },
      
      {
        accessorKey: 'sampai_tanggal',
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title="Sampai Tanggal" />
        ),
        cell: ({ row }) => <div>{row.getValue('sampai_tanggal')}</div>,
      },
    {
    accessorKey: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
    },
];
