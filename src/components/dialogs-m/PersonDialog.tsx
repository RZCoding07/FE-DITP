"use client"

import { useQuery } from "@tanstack/react-query"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { User, TrendingUp, Award, Activity, BarChart3, Target } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { apiService } from "@/services/api-monev-2"
import type { PersonRequest } from "@/services/api-monev-2"

interface PersonDialogProps {
  employee: { nik_sap: string; nama: string } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: Omit<PersonRequest, "nik_sap">
}

export function PersonDialog({ employee, open, onOpenChange, filters }: PersonDialogProps) {
  const { data: personData, isLoading } = useQuery({
    queryKey: ["person-data", employee?.nik_sap, filters],
    queryFn: () =>
      apiService.getPersonData({
        ...filters,
        nik_sap: employee!.nik_sap,
      }),
    enabled: !!employee && open,
  })

  if (!employee) return null

  const person = personData?.[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
        <DialogHeader className="pb-4 border-b border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl">Detail Karyawan</DialogTitle>
              <DialogDescription className="text-slate-400">
                Performance analytics untuk {employee.nama}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : person ? (
          <div className="flex-1 space-y-6 overflow-auto">
            {/* Employee Info Card */}
            <Card className="bg-gradient-to-r from-emerald-500/20 to-blue-500/20 border-emerald-500/30">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-white text-lg">{person.nama}</CardTitle>
                    <p className="text-emerald-200">NIK SAP: {person.nik_sap}</p>
                  </div>
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Active Employee</Badge>
                </div>
              </CardHeader>
            </Card>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Total Monev
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-400">{person.jumlah_monev}</div>
                  <p className="text-xs text-slate-400">Aktivitas monitoring</p>
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
                  <div className="text-2xl font-bold text-green-400">{person.rata_rata_nilai.toFixed(2)}</div>
                  <p className="text-xs text-slate-400">Performance score</p>
                  <Progress value={person.rata_rata_nilai} className="mt-2 h-2" />
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-slate-400 flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Rata-rata Bobot
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-400">{person.rata_rata_bobot.toFixed(2)}</div>
                  <p className="text-xs text-slate-400">Weight score</p>
                  <Progress value={person.rata_rata_bobot} className="mt-2 h-2" />
                </CardContent>
              </Card>
            </div>

            {/* Performance Chart */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        {
                          name: "Monev",
                          value: person.jumlah_monev,
                          color: "#3b82f6",
                        },
                        {
                          name: "Nilai",
                          value: person.rata_rata_nilai,
                          color: "#10b981",
                        },
                        {
                          name: "Bobot",
                          value: person.rata_rata_bobot,
                          color: "#f59e0b",
                        },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1f2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#fff",
                        }}
                      />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Analysis */}
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">Performance Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-emerald-400">Strengths</h4>
                    <div className="space-y-2">
                      {person.rata_rata_nilai > 70 && (
                        <div className="flex items-center gap-2 text-sm text-green-300">
                          <TrendingUp className="h-4 w-4" />
                          High performance score ({person.rata_rata_nilai.toFixed(1)})
                        </div>
                      )}
                      {person.jumlah_monev > 5 && (
                        <div className="flex items-center gap-2 text-sm text-blue-300">
                          <Activity className="h-4 w-4" />
                          Active monitoring participation ({person.jumlah_monev} activities)
                        </div>
                      )}
                      {person.rata_rata_bobot > 70 && (
                        <div className="flex items-center gap-2 text-sm text-yellow-300">
                          <Award className="h-4 w-4" />
                          Strong weighted performance ({person.rata_rata_bobot.toFixed(1)})
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-orange-400">Areas for Improvement</h4>
                    <div className="space-y-2">
                      {person.rata_rata_nilai < 50 && (
                        <div className="flex items-center gap-2 text-sm text-red-300">
                          <Target className="h-4 w-4" />
                          Performance score needs improvement
                        </div>
                      )}
                      {person.jumlah_monev < 3 && (
                        <div className="flex items-center gap-2 text-sm text-orange-300">
                          <Activity className="h-4 w-4" />
                          Low monitoring activity participation
                        </div>
                      )}
                      {Math.abs(person.rata_rata_nilai - person.rata_rata_bobot) > 10 && (
                        <div className="flex items-center gap-2 text-sm text-purple-300">
                          <BarChart3 className="h-4 w-4" />
                          Score consistency can be improved
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Tidak ada data untuk karyawan ini</p>
              <p className="text-sm mt-2">Data mungkin tidak tersedia untuk periode yang dipilih</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
