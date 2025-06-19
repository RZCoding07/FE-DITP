import { toast } from 'react-hot-toast'
import { useCallback, useState } from 'react'

export const useBulkDeleteVegetatif = () => {
    const apiUrl = import.meta.env.VITE_API_IMMATURE
    const [isDeleting, setIsDeleting] = useState(false)

    const bulkDelete = useCallback(async (ids: string[]) => {
        if (!ids.length) return false

        setIsDeleting(true)
        let successCount = 0

        try {
            // Send bulk delete request to API
            const response = await fetch(`${apiUrl}/vegetatif/bulk`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ids }),
            })

            // Check for successful response
            if (!response.ok) {
                const errorData = await response.json()
                toast.error(`Error: ${errorData.message || 'Failed to delete items'}`)
                return false
            } else {
                setTimeout(() => {
                    toast.success('Bulk delete successful')
                }, 1000)
                setTimeout(() => {
                    window.location.reload()
                }, 1200)
            }

        } catch (error) {
            console.error('Error during bulk delete:', error)
            toast.error('Error during bulk delete operation')
            return false
        } finally {
            setIsDeleting(false)
        }
    }, [apiUrl])

    return {
        bulkDelete,
        isDeleting,
    }
}
