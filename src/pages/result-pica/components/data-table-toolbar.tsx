"use client"

import { Cross2Icon } from "@radix-ui/react-icons"
import type { Table } from "@tanstack/react-table"
import { Button } from "@/components/custom/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { useEffect, useState, useCallback } from "react"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onSearch: (term: string) => void
  searchTerm: string
}

// Custom hook for debounced search
function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export function DataTableToolbar<TData>({ table, onSearch, searchTerm }: DataTableToolbarProps<TData>) {
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const debouncedSearchTerm = useDebounce(localSearchTerm, 500) // 500ms delay
  const isFiltered = localSearchTerm !== ""

  // Sync local search term with parent when parent changes
  useEffect(() => {
    if (searchTerm !== localSearchTerm) {
      setLocalSearchTerm(searchTerm)
    }
  }, [searchTerm])

  // Trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm !== searchTerm) {
      onSearch(debouncedSearchTerm)
    }
  }, [debouncedSearchTerm, onSearch, searchTerm])

  const handleReset = useCallback(() => {
    setLocalSearchTerm("")
    onSearch("")
  }, [onSearch])

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
        <Input
          placeholder="Cari Data..."
          value={localSearchTerm}
          onChange={(event) => setLocalSearchTerm(event.target.value)}
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button variant="ghost" onClick={handleReset} className="h-8 px-2 lg:px-3">
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
