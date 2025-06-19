import React from 'react'
import {useState, useEffect } from 'react'
import { Cross2Icon, TrashIcon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { DataTableViewOptions } from '../components/data-table-view-options'
import { useToast } from '@/components/ui/use-toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onBulkDelete?: (selectedRows: TData[]) => Promise<void> | void
}

export function DataTableToolbar<TData>({
  table,
  onBulkDelete,
}: DataTableToolbarProps<TData>) {
  const { toast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const isFiltered = table.getState().globalFilter !== undefined
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original)
  const hasSelectedRows = selectedRows.length > 0

  const handleConfirmDelete = async () => {
    console.log('Selected rows:', selectedRows)
    try {
      await onBulkDelete?.(selectedRows)
      table.resetRowSelection()
      toast({
        title: "Berhasil",
        description: `${selectedRows.length} data berhasil dihapus.`,
      })
    } catch (error) {
      toast({
        title: "Gagal",
        description: "Terjadi kesalahan saat menghapus data.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <div className='flex items-center justify-between'>
        <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
          <Input
            placeholder='Cari Data...'
            value={(table.getState().globalFilter as string) ?? ''}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
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
        
        <div className="flex items-center space-x-2">
          {hasSelectedRows && (
            <Button
              variant="destructive"
              size="sm"
              className="h-8"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Hapus ({selectedRows.length})
            </Button>
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
            <AlertDialogDescription>
              Aksi ini akan menghapus {selectedRows.length} data yang dipilih.
              Data yang sudah dihapus tidak dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}