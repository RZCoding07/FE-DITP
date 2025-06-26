import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BarChart3, CheckCircle, XCircle, Target } from "lucide-react"

interface SummaryStatsProps {
  data: any[]
  filteredData: any[]
}

const SummaryStats: React.FC<SummaryStatsProps> = ({ data, filteredData }) => {
  // Calculate overall statistics
  const totalBlok = data.length
  const filteredTotalBlok = filteredData.reduce((sum, group) => sum + group.total, 0)
  const filteredSudahMonev = filteredData.reduce((sum, group) => sum + group.sudah, 0)
  const filteredBelumMonev = filteredData.reduce((sum, group) => sum + group.belum, 0)

  const overallPercentage = filteredTotalBlok > 0 ? (filteredSudahMonev / filteredTotalBlok) * 100 : 0

  // Calculate by regional
  const regionalStats = filteredData.reduce((acc, group) => {
    if (!acc[group.regional]) {
      acc[group.regional] = { total: 0, sudah: 0, belum: 0 }
    }
    acc[group.regional].total += group.total
    acc[group.regional].sudah += group.sudah
    acc[group.regional].belum += group.belum
    return acc
  }, {} as any)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Overall Stats */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Total Blok</CardTitle>
          <BarChart3 className="h-4 w-4 text-slate-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">{filteredTotalBlok.toLocaleString()}</div>
          <p className="text-xs text-slate-400">
            {filteredTotalBlok !== totalBlok && `dari ${totalBlok.toLocaleString()} total`}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Sudah Monev</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-400">{filteredSudahMonev.toLocaleString()}</div>
          <p className="text-xs text-slate-400">{overallPercentage.toFixed(1)}% dari total blok</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Belum Monev</CardTitle>
          <XCircle className="h-4 w-4 text-red-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-400">{filteredBelumMonev.toLocaleString()}</div>
          <p className="text-xs text-slate-400">{(100 - overallPercentage).toFixed(1)}% dari total blok</p>
        </CardContent>
      </Card>

      <Card className="bg-slate-800 border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-slate-300">Progress</CardTitle>
          <Target className="h-4 w-4 text-blue-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-400">{overallPercentage.toFixed(1)}%</div>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${overallPercentage}%` }}
            ></div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Breakdown */}
      {Object.keys(regionalStats).length > 1 && (
        <Card className="bg-slate-800 border-slate-700 md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-slate-300">Breakdown per Regional</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(regionalStats).map(([regional, stats]: [string, any]) => {
                const regionalPercentage = stats.total > 0 ? (stats.sudah / stats.total) * 100 : 0
                return (
                  <Badge
                    key={regional}
                    variant="outline"
                    className="bg-slate-700 border-slate-600 text-white px-3 py-1"
                  >
                    <span className="font-medium">Regional {regional}:</span>
                    <span className="ml-2 text-green-400">{stats.sudah}</span>
                    <span className="text-slate-400">/</span>
                    <span className="text-slate-300">{stats.total}</span>
                    <span className="ml-1 text-blue-400">({regionalPercentage.toFixed(1)}%)</span>
                  </Badge>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SummaryStats
