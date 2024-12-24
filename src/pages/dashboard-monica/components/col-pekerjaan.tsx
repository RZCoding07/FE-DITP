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
  regional: string
  rkapAmount: number
  rkapPackage: number
  hpsAmount: string
  hpsPackage: number
  sppbjAmount: string
  sppbjPackage: number
}

const columnHelper = createColumnHelper<HousingData>()

  export const columns = [
    columnHelper.group({
      id: 'regional',
      header: () => null,
      columns: [
        columnHelper.accessor('regional', {
          header: 'Regional',
          cell: (info) => {
            return (
              <td rowSpan={3} className="p-2 align-middle">
                <div className="flex items-center space-x-2">
                  <span>{info.getValue()}</span>
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
            columnHelper.accessor('rkapAmount', {
              header: 'Rp. M',
              cell: info => info.getValue().toFixed(2),
            }),
            columnHelper.accessor('rkapPackage', {
              header: 'Paket',
              cell: info => info.getValue(),
            }),
          ],
        }),
        columnHelper.group({
          header: 'HPS',
          columns: [
            columnHelper.accessor('hpsAmount', {
              header: 'Paket',
              cell: info => info.getValue(),
            }),
            columnHelper.accessor('hpsPackage', {
              header: 'Paket',
              cell: info => info.getValue() || '-',
            }),
          ],
        }),
        columnHelper.group({
          header: 'SPPBJ',
          columns: [
            columnHelper.accessor('sppbjAmount', {
              header: 'Rp. M',
              cell: info => info.getValue(),
            }),
            columnHelper.accessor('sppbjPackage', {
              header: 'Paket',
              cell: info => info.getValue(),
            }),
          ],
        }),
      ]
    })
  ]

  
  

  