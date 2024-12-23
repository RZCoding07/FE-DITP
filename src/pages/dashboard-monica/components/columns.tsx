import { ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface Peogress {
//   id: string;
//   no_pk: string;
//   judul_pk: string;
//   dibuat_oleh: string;
//   fungsi_teknis: string;
//   total_nilai: string;
//   tgl_create_pk: string;
//   tgl_submit_pk_ke_hps: string;
//   nilai_hps: string;
//   nama_panitia_hps: string;
//   tgl_submit_ke_pengadaan: string;
//   panitia_pelaksana_pengadaan: string;
//   status_pk: string;
//   pengadaan_bersama: string;
//   sumber_dana: string;
//   sub_investasi: string;
//   peruntukan: string;
//   tahun_anggaran: string;

rpc_code: string;
n43 : string;
n44 : string;
n45   : string;
n46 : string;
n47 : string;
n48 : string;
}

export const columns: ColumnDef<Peogress>[] = [
  {
    id: 'number',
    header: 'No.',
    cell: ({ row }) => <span>{row.index + 1}</span>,
    enableSorting: false,
    enableHiding: false,
  },
  {
        accessorKey: 'rpc_code',
        header: ({ column }) => (
                <div className=" text-white px-2 py-1 rounded">
        <DataTableColumnHeader column={column} title='RPC Code' />
                </div>),
        cell: ({ row }) => <div>{row.getValue('rpc_code')}</div>,
        },
        {       
        accessorKey: 'n43',
        header: ({ column }) => (
                <div className=" text-white px-2 py-1 rounded">
        <DataTableColumnHeader column={column} title='43' />
                </div>),
        cell: ({ row }) => <div>{row.getValue('n43')} PAKET</div>,
        },
        {
        accessorKey: 'n44',
        header: ({ column }) => (
                <div className=" text-white px-2 py-1 rounded">
        <DataTableColumnHeader column={column} title='44' />
                
                </div>),        
        cell: ({ row }) => <div>{row.getValue('n44')} PAKET</div>,
        },
        {
        accessorKey: 'n45',
        header: ({ column }) => (
                <div className=" text-white px-2 py-1 rounded">
        <DataTableColumnHeader column={column} title='45' />
                </div>),
        cell: ({ row }) => <div>{row.getValue('n45')} PAKET</div>,
        },
        {
        accessorKey: 'n46',
        header: ({ column }) => (
                <div className=" text-white px-2 py-1 rounded">
        <DataTableColumnHeader column={column} title='46' />   
                </div>),
        cell: ({ row }) => <div>{row.getValue('n46')} PAKET</div>,
        },
        {
        accessorKey: 'n47',
        header: ({ column }) => (
                <div className=" text-white px-2 py-1 rounded">
        <DataTableColumnHeader column={column} title='47' />
                </div>),
        cell: ({ row }) => <div>{row.getValue('n47')} PAKET</div>,
        },
        {
        accessorKey: 'n48',
        header: ({ column }) => (
                <div className=" text-white px-2 py-1 rounded">
        <DataTableColumnHeader column={column} title='48' />
                </div>),
        cell: ({ row }) => <div>{row.getValue('n48')} PAKET</div>,
        }








//   {
//     accessorKey: 'no_pk',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='No. PK' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('no_pk')} PAKET</div>,
//   },
//   {
//     accessorKey: 'judul_pk',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Judul PK' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('judul_pk')} PAKET</div>,
//   },
//   {
//     accessorKey: 'dibuat_oleh',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Dibuat Oleh' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('dibuat_oleh')} PAKET</div>,
//   },
//   {
//     accessorKey: 'fungsi_teknis',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Fungsi Teknis' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('fungsi_teknis')} PAKET</div>,
//   },
//   {
//     accessorKey: 'total_nilai',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Total Nilai' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('total_nilai')} PAKET</div>,
//   },
//   {
//     accessorKey: 'tgl_create_pk',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Tgl Create PK' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('tgl_create_pk')} PAKET</div>,
//   },
//   {
//     accessorKey: 'tgl_submit_pk_ke_hps',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Tgl Submit PK ke HPS' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('tgl_submit_pk_ke_hps')} PAKET</div>,
//   },
//   {
//     accessorKey: 'nilai_hps',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Nilai HPS' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('nilai_hps')}</div>
//   },
//   {
//     accessorKey: 'nama_panitia_hps',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Nama Panitia HPS' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('nama_panitia_hps')} PAKET</div>,
//   },
//   {
//     accessorKey: 'tgl_submit_ke_pengadaan',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Tgl Submit ke Pengadaan' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('tgl_submit_ke_pengadaan')} PAKET</div>,
//   },
//   {
//     accessorKey: 'panitia_pelaksana_pengadaan',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Panitia Pelaksana Pengadaan' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('panitia_pelaksana_pengadaan')} PAKET</div>,
//   },
//   {
//     accessorKey: 'status_pk',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Status PK' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('status_pk')} PAKET</div>,
//   },
//   {
//     accessorKey: 'pengadaan_bersama',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Pengadaan Bersama' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('pengadaan_bersama')} PAKET</div>,
//   },
//   {
//     accessorKey: 'sumber_dana',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Sumber Dana' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('sumber_dana')} PAKET</div>,
//   },
//   {
//     accessorKey: 'sub_investasi',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Sub Investasi' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('sub_investasi')} PAKET</div>,
//   },
//   {
//     accessorKey: 'peruntukan',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Peruntukan' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('peruntukan')} PAKET</div>,
//   },
//   {
//     accessorKey: 'tahun_anggaran',
//     header: ({ column }) => (
//             <div className=" text-white px-2 py-1 rounded">
//     <DataTableColumnHeader column={column} title='Tahun Anggaran' />
//             </div>),
//     cell: ({ row }) => <div>{row.getValue('tahun_anggaran')} PAKET</div>,
//   },

//       {

//     id: 'actions',
//     cell: ({ row }) => (
//       <DataTableRowActions row={row} />
//     ),
//   },
];
