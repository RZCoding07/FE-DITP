"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, MapPin, BadgeIcon as IdCard, TrendingUp, Award, Search, ArrowUpDown } from "lucide-react"
import type { JobPositionData } from "@/types/api"
import { Input } from "@/components/ui/input"
import { useState, useMemo } from "react"

interface EmployeeDialogProps {
  data: JobPositionData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

type SortField = 'nik_sap' | 'nama' | 'nama_unit' | 'bobot' | 'total_nilai' | 'jabatan'
type SortDirection = 'asc' | 'desc'

export function EmployeeDialog({ data, open, onOpenChange }: EmployeeDialogProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState<{ field: SortField; direction: SortDirection } | null>(null)

  // Pindahkan semua hook ke atas sebelum conditional return
  const employeeGroups = useMemo(() => {
    if (!data) return {}
    
    return data.karyawans.reduce(
      (acc, employee) => {
        const key = `${employee.nik_sap}-${employee.nama}`
        if (!acc[key]) {
          acc[key] = {
            nik_sap: employee.nik_sap,
            nama: employee.nama,
            nama_unit: employee.nama_unit,
            kode_unit: employee.kode_unit,
            jabatan: employee.jabatan,
            total_nilai: employee.total_nilai,
            bobot: employee.bobot,
            records: [{
              tanggal: employee.tanggal,
              kode_blok: employee.kode_blok
            }]
          }
        } else {
          acc[key].records.push({
            tanggal: employee.tanggal,
            kode_blok: employee.kode_blok
          })
        }
        return acc
      },
      {} as Record<string, any>,
    )
  }, [data])

  const employeeList = useMemo(() => Object.values(employeeGroups), [employeeGroups])

  // Apply search filter
  const filteredEmployees = useMemo(() => {
    if (!employeeList.length) return []
    if (!searchTerm) return employeeList
    
    const term = searchTerm.toLowerCase()
    return employeeList.filter((employee: any) => 
      employee.nik_sap.toLowerCase().includes(term) ||
      employee.nama.toLowerCase().includes(term) ||
      employee.nama_unit.toLowerCase().includes(term) ||
      employee.jabatan.toLowerCase().includes(term)
    )
  }, [employeeList, searchTerm])

  // Apply sorting
  const sortedEmployees = useMemo(() => {
    if (!filteredEmployees.length) return filteredEmployees
    if (!sortConfig) return filteredEmployees
    
    return [...filteredEmployees].sort((a: any, b: any) => {
      // Handle numeric fields differently
      if (sortConfig.field === 'bobot' || sortConfig.field === 'total_nilai') {
        const aValue = parseFloat(a[sortConfig.field])
        const bValue = parseFloat(b[sortConfig.field])
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue
      }
      
      // Handle string fields
      const aValue = a[sortConfig.field]?.toString().toLowerCase() || ''
      const bValue = b[sortConfig.field]?.toString().toLowerCase() || ''
      
      if (aValue < bValue) {
        return sortConfig.direction === 'asc' ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === 'asc' ? 1 : -1
      }
      return 0
    })
  }, [filteredEmployees, sortConfig])

  const requestSort = (field: SortField) => {
    let direction: SortDirection = 'asc'
    if (sortConfig && sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ field, direction })
  }

  const getSortIndicator = (field: SortField) => {
    if (!sortConfig || sortConfig.field !== field) return null
    return (
      <ArrowUpDown className={`h-3 w-3 ml-1 ${sortConfig.direction === 'asc' ? 'rotate-0' : 'rotate-180'}`} />
    )
  }

  // Conditional return harus setelah semua hook
  if (!data) return null
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader className="pb-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl">Detail Karyawan - {data.jabatan}</DialogTitle>
              <DialogDescription className="text-slate-400">
                Tabulasi karyawan berdasarkan jabatan yang dipilih
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 flex-shrink-0">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Users className="h-4 w-4" />
                Total Karyawan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{employeeList.length}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Total Monev
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-400">{data.jumlah_monev}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Rata-rata Nilai
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">{data.rata_rata_nilai.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                <Award className="h-4 w-4" />
                Rata-rata Bobot
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-400">{data.rata_rata_bobot.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <div className="relative flex-shrink-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <Input
            type="text"
            placeholder="Cari karyawan berdasarkan NIK, nama, unit, atau jabatan..."
            className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Employee Table */}
        <div className="flex-1 min-h-0 overflow-hidden rounded-lg border border-slate-700">
          <div className="h-full overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-800 z-10">
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-slate-300">
                    <button 
                      type="button"
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => requestSort('nik_sap')}
                    >
                      <IdCard className="h-4 w-4" />
                      NIK SAP
                      {getSortIndicator('nik_sap')}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <button 
                      type="button"
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => requestSort('nama')}
                    >
                      <Users className="h-4 w-4" />
                      Nama Karyawan
                      {getSortIndicator('nama')}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <button 
                      type="button"
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => requestSort('nama_unit')}
                    >
                      <MapPin className="h-4 w-4" />
                      Unit Kerja
                      {getSortIndicator('nama_unit')}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Tanggal & Blok Monev
                    </div>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <button 
                      type="button"
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => requestSort('bobot')}
                    >
                      Bobot
                      {getSortIndicator('bobot')}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <button 
                      type="button"
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => requestSort('total_nilai')}
                    >
                      Nilai
                      {getSortIndicator('total_nilai')}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <button 
                      type="button"
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => requestSort('jabatan')}
                    >
                      Jabatan
                      {getSortIndicator('jabatan')}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedEmployees.length > 0 ? (
                  sortedEmployees.map((employee: any, index) => (
                    <TableRow key={`${employee.nik_sap}-${index}`} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="font-medium text-blue-400">{employee.nik_sap}</TableCell>
                      <TableCell className="text-white max-w-xs">
                        <div className="truncate" title={employee.nama}>
                          {employee.nama}
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{employee.nama_unit}</div>
                          <div className="text-xs text-slate-400">{employee.kode_unit}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="flex flex-wrap gap-1">
                          {employee.records
                            .sort((a: any, b: any) => new Date(a.tanggal).getTime() - new Date(b.tanggal).getTime())
                            .map((record: any, recordIndex: number) => (
                              <div key={recordIndex} className="flex flex-col gap-1">
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-300">
                                  {new Date(record.tanggal).toLocaleDateString("id-ID", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </Badge>
                                <Badge variant="outline" className="text-xs border-purple-600 text-purple-300">
                                  Blok: {record.kode_blok}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm font-medium">
                          {employee.bobot}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="text-sm font-medium">{employee.total_nilai}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-600 hover:bg-green-700 text-white">{employee.jabatan}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-slate-700 hover:bg-slate-800/50">
                    <TableCell colSpan={7} className="h-24 text-center text-slate-400">
                      {searchTerm ? 'Tidak ditemukan karyawan yang sesuai dengan pencarian' : 'Tidak ada data karyawan'}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}