import { ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable


 } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

interface Peogress {
  id: string
  sub_investasi: string
  hps: string
  total_tekpol: string
  pengadaan: string
  sppbj: string
}

type HousingData = {
  rpc_code: string
  rkap_nilai_proyek: number
  rkap_jumlah_paket: number
  hps: string
  pengadaan: number
  hpsPackage: number
  sppbj: string
  value_sppbj: number
}


const formatRupiah = (value: number) => {
  if (!value) return 'Rp. 0' // Jika nilai kosong atau null
  const numericValue = typeof value === 'number' ? value : parseFloat(value)
  if (isNaN(numericValue)) return 'Rp. 0' // Jika nilai bukan angka
  return `Rp. ${numericValue.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
}

const columnHelper = createColumnHelper<HousingData>()

  export const columns = [
    columnHelper.group({
      id: 'rpc_code',
      header: () => null,
      columns: [
        columnHelper.accessor('rpc_code', {
          header: 'rpc_code',
          cell: (info) => {
            return (
              <td rowSpan={3} className="p-2 align-middle">
                <div className="flex items-center space-x-2">
                  <span>{info.getValue().toUpperCase()}</span>
                </div>
              </td>
            );
          },
        }),
      ],
    }),
    columnHelper.group({
      header: 'Bangunan Perumahan',
      columns: [
        columnHelper.group({
          header: 'RKAP',
          columns: [
            columnHelper.accessor('rkap_nilai_proyek', {
              header: 'Rp. M',
              cell: info => info.getValue(),
            }),
            columnHelper.accessor('rkap_jumlah_paket', {
              header: 'Paket',
              cell: info => info.getValue() + ' PAKET',
            }),
          ],
        }),
        columnHelper.group({
          header: 'HPS',
          columns: [
            columnHelper.accessor('hps', {
              header: 'Paket',
              cell: info => info.getValue() + ' PAKET',
            })
          ],
        }),
        columnHelper.group({
          header: 'Pengadaan',
          columns: [
            columnHelper.accessor('pengadaan', {
              header: 'Paket',
              cell: info => info.getValue() + ' PAKET',
            })
          ],
        }),
        columnHelper.group({
          header: 'SPPBJ',
          columns: [
            columnHelper.accessor('value_sppbj', {
              header: 'Rp. M',
              cell: info => formatRupiah(info.getValue()),
            }),
            columnHelper.accessor('sppbj', {
              header: 'Paket',
              cell: info => info.getValue() + ' PAKET',
            }),
          ],
        }),
      ]
    })
  ]

  
  

  