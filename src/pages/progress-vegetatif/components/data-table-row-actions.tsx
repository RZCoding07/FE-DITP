import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/custom/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { toast } from 'react-hot-toast'
import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

interface DataTableRowActionsProps {
  row: {
    original: {
      id: string
    }
  }
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const apiUrl = import.meta.env.VITE_API_IMMATURE;

  const navigate = useNavigate()
  const handleDelete = useCallback(async (id: string) => {
    try {
      const response = await fetch(`${apiUrl}/vegetatif/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        toast.success('Deleted successfully')
        location.reload()
      } else {
        console.error('Failed to delete inventory')
        toast.error('Failed to delete inventory')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      toast.error('Error deleting inventory')
    }
  }, [apiUrl])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'>
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        <DropdownMenuItem onSelect={() => navigate(`/edit-vegetatif/${row.original.id}`)}>
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => handleDelete(row.original.id)}>
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
