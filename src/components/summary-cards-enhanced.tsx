"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, BarChart3, Activity, Target, Users, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { MonitoringData, PlantationData, JobPositionData, CorrectiveActionData } from "@/types/api"
import { link } from "fs"
import { Link } from "react-router-dom"

interface SummaryCardsEnhancedProps {
  regionals?: string
  monitoringData: any[]
  plantationData: PlantationData[]
  jobPositionData: JobPositionData[]
  correctiveActionData: CorrectiveActionData[]
}

export function SummaryCardsEnhanced({
  regionals,
  monitoringData,
  plantationData,
  jobPositionData,
  correctiveActionData,
}: SummaryCardsEnhancedProps) {
  // Replace data if regionals is empty string
  if (regionals === "") {
    monitoringData = [{
      "kode_unit": "PALMCO",
      "nama": "PALMCO",
      "luas_areal_ha_seluruh": 21149.59,
      "luas_tanam_ha_seluruh": 568187.09999999974,
      "luas_areal_ha_tu": 21149.59,
      "luas_tanam_ha_tu": 21149.59,
      "jumlah_blok_seluruh": 33624,
      "jumlah_blok_tu": 843,
      "rata_rata_nilai": 32.935483870967744,
      "rata_rata_bobot": 34.354838709677416,
      "persentase_kesesuaian": 95.86854460093898,
      "jumlah_blok_sudah_monev": 113,
      "jumlah_monev": 238,
      "persentase_monev": 13.404507710557533
    }];
    plantationData = plantationData
    jobPositionData = jobPositionData.map((item) => ({
      ...item,
      jumlah_monev: item.jumlah_monev || 0, // Ensure jumlah_monev is a number
    }))
  }

  // Calculate summary statistics
  console.log("Calculating summary statistics...")
  console.log("Monitoring Data:", monitoringData)
  console.log("Plantation Data:", plantationData)
  console.log("Job Position Data:", jobPositionData)

  const stats = {
    totalArea:
      monitoringData.reduce((sum, item) => sum + Number(item.luas_tanam_ha_tu || 0), 0),

    totalBlocks:
      monitoringData.reduce((sum, item) => sum + Number(item.jumlah_blok_tu || 0), 0),

    monitoredBlocks: monitoringData.reduce((sum, item) => sum + Number(item.jumlah_blok_sudah_monev || 0), 0),

    avgMonitoringPercentage:
      monitoringData.length > 0
        ? monitoringData.reduce((sum, item) => sum + Number(item.persentase_monev || 0), 0)
        : 0,

    avgCompliancePercentage:
      monitoringData.length > 0
        ? monitoringData.reduce((sum, item) => sum + Number(item.persentase_kesesuaian || 0), 0) / monitoringData.length
        : 0,

    totalJobMonev: regionals ?
      jobPositionData.reduce((sum, item) => sum + Number(item.jumlah_monev || 0), 0) : monitoringData.reduce((sum, item) => sum + Number(item.jumlah_monev || 0), 0),

    activePositions: jobPositionData.filter((item) => Number(item.jumlah_monev || 0) > 0).length,

    totalCorrectiveActions: correctiveActionData.reduce((sum, item) => sum + Number(item.jumlah_corrective_action || 0), 0),

    completedCorrectiveActions: correctiveActionData.reduce(
      (sum, item) => sum + (item.jumlah_corrective_action_selesai || 0),
      0,
    ),
  }

  console.log("Summary Statistics:", stats)

  const correctiveActionPercentage =
    stats.totalCorrectiveActions > 0 ? (stats.completedCorrectiveActions / stats.totalCorrectiveActions) * 100 : 0

  const monitoringCoverage = stats.totalBlocks > 0 ? (stats.monitoredBlocks / stats.totalBlocks) * 100 : 0

  const getTrendIcon = (value: number, threshold: number) => {
    if (value > threshold) return <TrendingUp className="h-4 w-4 text-green-500" />
    if (value < threshold * 0.8) return <TrendingDown className="h-4 w-4 text-red-500" />
    return <Minus className="h-4 w-4 text-yellow-500" />
  }

  const cards = [
    {
      title: "Total Rencana Luas TU",
      value: stats.totalArea.toLocaleString("id-ID"),
      unit: "Hektar",
      icon: <MapPin className="h-5 w-5" />,
      color: "from-blue-600 to-blue-700",
      trend: getTrendIcon(stats.totalArea, 10000),
      description: `${plantationData.length} kebun aktif`,
      link: "/dashboard-inspire",
    },
    // {
    //   title: "Total Blok",
    //   value: stats.totalBlocks.toLocaleString("id-ID"),
    //   unit: "Blok TU",
    //   icon: <BarChart3 className="h-5 w-5" />,
    //   color: "from-green-600 to-green-700",
    //   trend: getTrendIcon(stats.totalBlocks, 1000),
    //   description: `${stats.monitoredBlocks} sudah dimonev`,
    // },
    {
      title: "Jumlah Blok Monitoring",
      value: monitoringCoverage.toFixed(1),
      unit: "%",
      icon: <Activity className="h-5 w-5" />,
      color: "from-purple-600 to-purple-700",
      trend: getTrendIcon(monitoringCoverage, 80),
      description: `${stats.monitoredBlocks}/${stats.totalBlocks} blok TU yang sudah dimonev`,
    },
    // {
    //   title: "Rata-rata Monitoring",
    //   value: stats.avgMonitoringPercentage.toFixed(1),
    //   unit: "%",
    //   icon: <Target className="h-5 w-5" />,
    //   color: "from-orange-600 to-orange-700",
    //   trend: getTrendIcon(stats.avgMonitoringPercentage, 75),
    //   description: "Persentase monitoring",
    // },
    {
      title: "Rata-rata Kesesuaian",
      value: stats.avgCompliancePercentage.toFixed(1),
      unit: "%",
      icon: <CheckCircle className="h-5 w-5" />,
      color: "from-teal-600 to-teal-700",
      trend: getTrendIcon(stats.avgCompliancePercentage, 85),
      description: "Tingkat kesesuaian",
    },


    {
      title: "Total Monev",
      value: stats.totalJobMonev.toLocaleString("id-ID"),
      unit: "Aktivitas",
      icon: <Activity className="h-5 w-5" />,
      color: "from-pink-600 to-pink-700",
      trend: getTrendIcon(stats.totalJobMonev, 100),
      description: `${ stats.activePositions.toString()}/${jobPositionData.length} posisi jabatan`,
    },
    //     {
    //   title: "Corrective Action",
    //   value: correctiveActionPercentage.toFixed(1),
    //   unit: "%",
    //   icon: <Target className="h-5 w-5" />,
    //   color: "from-red-600 to-red-700",
    //   trend: getTrendIcon(correctiveActionPercentage, 70),
    //   description: `${stats.completedCorrectiveActions}/${stats.totalCorrectiveActions} selesai`,
    // }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Link to={card.link ? card.link : "#"} key={index} className="no-underline">
          <Card className={" bg-slate-800"}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="text-lg font-semibold">{card.title}</span>
                {card.trend}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-start">
              <div className="text-2xl font-bold text-white">
                {card.value} {card.unit}
              </div>
              <div className="text-sm text-muted-foreground">{card.description}</div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}