"use client"

import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { ArrowLeft, MapPin, BarChart3, TrendingUp, Activity } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AfdChart } from "@/components/charts-m/AfdChart"
import { apiService } from "@/services/api-monev-2"
import { formatNumber, formatPercentage, formatDate } from "@/lib/utils"
import type { DateRange } from "react-day-picker"

export default function UnitView() {
  const { regionId, unitId } = useParams()
  const [dateRange] = useState<DateRange | undefined>({
    from: new Date(2024, 4, 24),
    to: new Date(2025, 5, 23),
  })

  const { data: afdData, isLoading } = useQuery({
    queryKey: ["afd-data", regionId, unitId, dateRange],
    queryFn: () =>
      apiService.getAfdData({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
        region: regionId!,
        kode_unit: unitId!,
      }),
    enabled: !!regionId && !!unitId && !!dateRange,
  })

  const afdStats = afdData
    ? {
        totalAfdelings: afdData.length,
        totalArea: afdData.reduce((sum, afd) => sum + Number(afd.luas_areal_ha_seluruh), 0),
        totalBlocks: afdData.reduce((sum, afd) => sum + Number(afd.jumlah_blok_seluruh), 0),
        totalMonev: afdData.reduce((sum, afd) => sum + Number(afd.jumlah_monev), 0),
        avgPercentage: afdData.reduce((sum, afd) => sum + Number(afd.persentase_monev), 0) / afdData.length,
      }
    : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to={`/regional/${regionId}`}>
                <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Regional
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-white">Unit {unitId} - Afdeling View</h1>
                <p className="text-sm text-gray-300">Detailed afdeling monitoring data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-6 space-y-6">
        {/* Afdeling Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-emerald-100">Total Afdelings</CardTitle>
              <MapPin className="h-4 w-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{afdStats?.totalAfdelings || 0}</div>
              <p className="text-xs text-emerald-200">Active afdelings</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border-blue-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Area</CardTitle>
              <BarChart3 className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{afdStats ? formatNumber(afdStats.totalArea) : "0"}</div>
              <p className="text-xs text-blue-200">Hectares</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border-purple-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Total Blocks</CardTitle>
              <TrendingUp className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{afdStats ? formatNumber(afdStats.totalBlocks) : "0"}</div>
              <p className="text-xs text-purple-200">Blocks</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border-orange-500/30">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Avg Monitoring</CardTitle>
              <Activity className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {afdStats ? formatPercentage(afdStats.avgPercentage) : "0.0%"}
              </div>
              <p className="text-xs text-orange-200">Coverage</p>
            </CardContent>
          </Card>
        </div>

        {/* Afdeling Chart */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Afdeling Performance Overview</CardTitle>
            <CardDescription className="text-gray-300">Monitoring performance by afdeling</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-[400px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              </div>
            ) : (
              <AfdChart data={afdData || []} />
            )}
          </CardContent>
        </Card>

        {/* Afdeling Details */}
        <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Afdeling Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {afdData?.map((afd) => (
                <Card key={afd.afdeling} className="bg-white/5 border-white/10">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-white">{afd.afdeling}</h3>
                        <p className="text-sm text-gray-300">Unit: {afd.kode_unit}</p>
                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                          <span>Area: {formatNumber(Number(afd.luas_areal_ha_seluruh))} Ha</span>
                          <span>Blocks: {afd.jumlah_blok_seluruh}</span>
                          <span>Monev: {afd.jumlah_monev}</span>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <Badge
                          variant={Number(afd.persentase_monev) > 50 ? "default" : "secondary"}
                          className={
                            Number(afd.persentase_monev) > 50
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-red-500/20 text-red-300"
                          }
                        >
                          {formatPercentage(Number(afd.persentase_monev))} Coverage
                        </Badge>
                        <div className="w-32">
                          <Progress value={Number(afd.persentase_kesesuaian)} className="h-2" />
                          <p className="text-xs text-gray-400 mt-1">
                            {formatPercentage(Number(afd.persentase_kesesuaian))} Compliance
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
