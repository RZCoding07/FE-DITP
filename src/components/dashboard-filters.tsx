"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Check, ChevronsUpDown, Filter, RefreshCw, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { format, subDays } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { DashboardFilters, DMonevRegion, DMonevUnit, DMonevAfdeling } from "@/types/api"
import { DateRange } from "react-day-picker"
import cookie from "js-cookie"

interface DashboardFiltersEnhancedProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  regionals: DMonevRegion[]
  kebuns: DMonevUnit[]
  afdelings: DMonevAfdeling[]
  loading?: boolean
  onRefresh?: () => void
}

export function DashboardFiltersEnhanced({
  filters,
  onFiltersChange,
  regionals,
  kebuns,
  afdelings,
  loading = false,
  onRefresh,
}: DashboardFiltersEnhancedProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (filters.dari_tanggal && filters.sampai_tanggal) {
      return {
        from: new Date(filters.dari_tanggal),
        to: new Date(filters.sampai_tanggal),
      }
    }
    return undefined
  })
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Get RPC from cookie
  const user = cookie.get('user')
  const rpc = user ? JSON.parse(user).rpc : ''

  // Apply RPC to regional filter if available
  useEffect(() => {
    if (rpc && rpc !== '' && filters.regional !== rpc) {
      onFiltersChange({
        ...filters,
        regional: rpc,
        kode_unit: "",
        afdeling: "",
        blok: "",
      })
    }
  }, [rpc])

  const selectedRegional = regionals.find((r) => r.kode_regional === filters.regional)
  const selectedKebun = kebuns.find((k) => k.kode_unit === filters.kode_unit)
  const selectedAfdeling = afdelings.find((a) => a.afdeling === filters.afdeling)

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      onFiltersChange({
        ...filters,
        dari_tanggal: format(range.from, "yyyy-MM-dd"),
        sampai_tanggal: format(range.to, "yyyy-MM-dd"),
      })
    }
  }

  const clearFilters = () => {
    const clearedFilters: DashboardFilters = {
      dari_tanggal: filters.dari_tanggal,
      sampai_tanggal: filters.sampai_tanggal,
      regional: rpc !== '' ? rpc : "",
      kode_unit: "",
      afdeling: "",
      blok: "",
    }
    onFiltersChange(clearedFilters)
  }

  const activeFiltersCount = [
    rpc !== '' && filters.regional !== rpc ? filters.regional : null,
    filters.kode_unit, 
    filters.afdeling, 
    filters.blok
  ].filter(Boolean).length

  return (
    <Card className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-slate-700 shadow-2xl">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-blue-400" />
            <CardTitle className="text-white">Filter Dashboard</CardTitle>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="bg-blue-600 text-white">
                {activeFiltersCount} filter aktif
              </Badge>
            )}
            {rpc && (
              <Badge variant="outline" className="border-green-500 text-green-400">
                RPC: {rpc}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRefresh}
                disabled={loading}
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
              >
                <RefreshCw className={cn("h-4 w-4 mr-2", loading && "animate-spin")} />
                Refresh
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-slate-300 hover:bg-slate-700"
            >
              {isExpanded ? "Sembunyikan" : "Tampilkan"} Filter
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Date Range - Always visible */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  variant="outline"
                  className={cn(
                    "w-[300px] justify-start text-left font-normal bg-slate-800 border-slate-700 hover:bg-slate-700",
                    !dateRange && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "LLL dd, y", { locale: id })} -{" "}
                        {format(dateRange.to, "LLL dd, y", { locale: id })}
                      </>
                    ) : (
                      format(dateRange.from, "LLL dd, y", { locale: id })
                    )
                  ) : (
                    <span>Pilih rentang tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange?.from}
                  selected={dateRange}
                  onSelect={handleDateRangeChange}
                  numberOfMonths={2}
                  className="bg-slate-800 text-white"
                />
              </PopoverContent>
            </Popover>

            {/* ... (date range buttons remain the same) ... */}
          </div>
        </div>

        {/* Additional Filters - Collapsible */}
        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
            {/* Regional Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Regional</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={rpc !== ''} // Disable if RPC is set
                    className={cn(
                      "w-full justify-between border-slate-600 bg-slate-800 text-white hover:bg-slate-700",
                      rpc !== '' && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    {selectedRegional ? selectedRegional.regional : "Pilih Regional..."}
                    {rpc === '' && <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />}
                  </Button>
                </PopoverTrigger>
                {rpc === '' && (
                  <PopoverContent className="w-full p-0 bg-slate-800 border-slate-600">
                    <Command className="bg-slate-800">
                      <CommandInput placeholder="Cari regional..." className="text-white" />
                      <CommandEmpty className="text-slate-400">Regional tidak ditemukan.</CommandEmpty>
                      <CommandGroup>
                        <CommandList>
                          {regionals.map((regional) => (
                            <CommandItem
                              key={regional.kode_regional}
                              value={regional.regional}
                              onSelect={() => {
                                onFiltersChange({
                                  ...filters,
                                  regional: regional.kode_regional,
                                  kode_unit: "",
                                  afdeling: "",
                                  blok: "",
                                })
                              }}
                              className="text-white hover:bg-slate-700"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  filters.regional === regional.kode_regional ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {regional.regional}
                            </CommandItem>
                          ))}
                        </CommandList>
                      </CommandGroup>
                    </Command>
                  </PopoverContent>
                )}
              </Popover>
              {rpc !== '' && (
                <p className="text-xs text-green-400">Regional terkunci berdasarkan RPC</p>
              )}
            </div>


            {/* Kebun Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Kebun</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!filters.regional || kebuns.length === 0}
                    className="w-full justify-between border-slate-600 bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
                  >
                    {selectedKebun ? selectedKebun.nama_unit : "Pilih Kebun..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-slate-800 border-slate-600">
                  <Command className="bg-slate-800">
                    <CommandInput placeholder="Cari kebun..." className="text-white" />
                    <CommandEmpty className="text-slate-400">Kebun tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {kebuns.map((kebun) => (
                          <CommandItem
                            key={kebun.kode_unit}
                            value={kebun.nama_unit}
                            onSelect={() => {
                              onFiltersChange({
                                ...filters,
                                kode_unit: kebun.kode_unit,
                                afdeling: "",
                                blok: "",
                              })
                            }}
                            className="text-white hover:bg-slate-700"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                filters.kode_unit === kebun.kode_unit ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {kebun.nama_unit}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Afdeling Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Afdeling</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    disabled={!filters.kode_unit || afdelings.length === 0}
                    className="w-full justify-between border-slate-600 bg-slate-800 text-white hover:bg-slate-700 disabled:opacity-50"
                  >
                    {selectedAfdeling ? selectedAfdeling.afdeling : "Pilih Afdeling..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0 bg-slate-800 border-slate-600">
                  <Command className="bg-slate-800">
                    <CommandInput placeholder="Cari afdeling..." className="text-white" />
                    <CommandEmpty className="text-slate-400">Afdeling tidak ditemukan.</CommandEmpty>
                    <CommandGroup>
                      <CommandList>
                        {afdelings.map((afdeling) => (
                          <CommandItem
                            key={afdeling.afdeling}
                            value={afdeling.afdeling}
                            onSelect={() => {
                              onFiltersChange({
                                ...filters,
                                afdeling: afdeling.afdeling,
                                blok: "",
                              })
                            }}
                            className="text-white hover:bg-slate-700"
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                filters.afdeling === afdeling.afdeling ? "opacity-100" : "opacity-0",
                              )}
                            />
                            {afdeling.afdeling}
                          </CommandItem>
                        ))}
                      </CommandList>
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Clear Filters Button */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">Aksi</label>
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
                className="w-full border-red-600 text-red-400 hover:bg-red-600 hover:text-white disabled:opacity-50"
              >
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}