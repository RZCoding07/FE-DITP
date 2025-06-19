"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, MapPin, BadgeIcon as IdCard, TrendingUp, Award } from "lucide-react"
import type { JobPositionData } from "@/types/api"

interface EmployeeDialogProps {
  data: JobPositionData | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EmployeeDialog({ data, open, onOpenChange }: EmployeeDialogProps) {
  if (!data) return null

  // Group employees by unique combination of nik_sap and nama to avoid duplicates
  const uniqueEmployees = data.karyawans.reduce(
    (acc, employee) => {
      const key = `${employee.nik_sap}-${employee.nama}`
      if (!acc[key]) {
        acc[key] = {
          ...employee,
          dates: [employee.tanggal],
        }
      } else {
        if (!acc[key].dates.includes(employee.tanggal)) {
          acc[key].dates.push(employee.tanggal)
        }
      }
      return acc
    },
    {} as Record<string, any>,
  )

  const employeeList = Object.values(uniqueEmployees)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader className="pb-4 border-b border-slate-700">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4">
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

        {/* Employee Table */}
        <div className="flex-1 overflow-auto ">
          <Table>
            <TableHeader>
              <TableRow className="border-slate-700 hover:bg-slate-800">
                <TableHead className="text-slate-300">
                  <div className="flex items-center gap-2">
                    <IdCard className="h-4 w-4" />
                    NIK SAP
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Nama Karyawan
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Unit Kerja
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Tanggal Monev
                  </div>
                </TableHead>
                <TableHead className="text-slate-300">Jabatan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employeeList.map((employee, index) => (
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
                      {employee.dates.sort().map((date: string, dateIndex: number) => (
                        <Badge key={dateIndex} variant="outline" className="text-xs border-slate-600 text-slate-300">
                          {new Date(date).toLocaleDateString("id-ID", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className="bg-green-600 hover:bg-green-700 text-white">{employee.jabatan}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {employeeList.length === 0 && (
          <div className="flex items-center justify-center h-32 text-slate-400">
            <div className="text-center">
              <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada data karyawan untuk jabatan {data.jabatan}</p>
              <p className="text-sm mt-2">Jabatan ini belum memiliki monitoring</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
