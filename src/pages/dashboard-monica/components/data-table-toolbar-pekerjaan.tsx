import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbarPekerjaan<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().globalFilter !== undefined

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Cari Data...'
          value={(table.getState().globalFilter as string) ?? ''}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />

        {/* select option  */}
        <Select>
        <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Pilih Sub Investasi" />
      </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Pilih Sub Investasi</SelectLabel>
              <SelectItem value="Mesin & Instalasi">Mesin & Instalasi</SelectItem>
              <SelectItem value="Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)">Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)</SelectItem>
              <SelectItem value="Bangunan Perumahan">Bangunan Perumahan</SelectItem>
              <SelectItem value="Bangunan Perusahaan">Bangunan Perusahaan</SelectItem>
              <SelectItem value="Jalan, Jembatan & Saluran Air">Jalan, Jembatan & Saluran Air</SelectItem>
              <SelectItem value="Alat Pengangkutan (Transportasi)">Alat Pengangkutan (Transportasi)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.setGlobalFilter('')}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
