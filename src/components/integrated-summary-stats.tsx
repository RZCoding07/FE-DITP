import type React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, CheckCircle, Users, UserCheck } from "lucide-react"

interface PersonnelData {
  sap: string
  name: string
  region: string
  personnel_subarea: string
  desc_personnel_subarea: string
  afd_code: string | null
  desc_job: string
  headerkertaskerja: any[]
}

interface IntegratedSummaryStatsProps {
  data: any[]
  filteredData: any[]
  personnelData: PersonnelData[]
}

const IntegratedSummaryStats: React.FC<IntegratedSummaryStatsProps> = ({ data, filteredData, personnelData }) => {
  // Calculate blok statistics
  console.log("Calculating Integrated Summary Statistics...", data.length, "total blocks", data)
  const totalBlok = data.length
  const filteredTotalBlok = filteredData.reduce((sum, group) => sum + group.total, 0)
  const filteredSudahMonev = filteredData.reduce((sum, group) => sum + group.sudah, 0)
  const filteredBelumMonev = filteredData.reduce((sum, group) => sum + group.belum, 0)
  const blokPercentage = filteredTotalBlok > 0 ? (filteredSudahMonev / filteredTotalBlok) * 100 : 0

  // Calculate personnel statistics
  const totalPersonnel = personnelData.length
  const personnelSudahMonev = personnelData.filter((p) => p.headerkertaskerja.length > 0).length
  const personnelBelumMonev = totalPersonnel - personnelSudahMonev
  const personnelPercentage = totalPersonnel > 0 ? (personnelSudahMonev / totalPersonnel) * 100 : 0

  // Calculate by job
  const jobStats = personnelData.reduce((acc, person) => {
    if (!acc[person.desc_job]) {
      acc[person.desc_job] = { total: 0, sudah: 0, belum: 0 }
    }
    acc[person.desc_job].total += 1
    if (person.headerkertaskerja.length > 0) {
      acc[person.desc_job].sudah += 1
    } else {
      acc[person.desc_job].belum += 1
    }
    return acc
  }, {} as any)

  return (
    <div className=" mb-5">

      {/* Progress Comparison */}


      {/* Job Breakdown */}
      <CardTitle className="text-sm font-medium text-slate-300">Breakdown Personnel per Jabatan</CardTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(jobStats).map(([job, stats]: [string, any]) => {
          const percentage = stats.total > 0 ? (stats.sudah / stats.total) * 100 : 0
          return (
            <div key={job} className="bg-slate-700 rounded-lg p-3">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-white">{job}</span>
                <span className="text-xs text-blue-400 text-right"> {percentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-slate-400">Total: {stats.total}</span>
                <div className="flex gap-2">
                  <span className="text-green-400">✓ {stats.sudah}</span>
                  <span className="text-red-400">✗ {stats.belum}</span>
                </div>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-1.5">
                <div
                  className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          )
        })}
      </div>

    </div>

  )
}

export default IntegratedSummaryStats
