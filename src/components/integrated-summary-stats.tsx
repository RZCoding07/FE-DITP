import type React from "react"
import { CardTitle } from "@/components/ui/card"
import { Users } from "lucide-react"

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

const region = [
  {
    kode_regional: "1",
    regional: "REGIONAL 1",
  },
  {
    kode_regional: "2",
    regional: "REGIONAL 2",
  },
  {
    kode_regional: "3",
    regional: "REGIONAL 3",
  },
  {
    kode_regional: "4",
    regional: "REGIONAL 4",
  },
  {
    kode_regional: "5",
    regional: "REGIONAL 5",
  },
  {
    kode_regional: "6",
    regional: "REGIONAL 6",
  },
  {
    kode_regional: "7",
    regional: "REGIONAL 7",
  },
  {
    kode_regional: "8",
    regional: "KSO Sulawesi",
  },
  {
    kode_regional: "M",
    regional: "KSO Ex N2",
  },
]

const datakaryawanBerkontrakR1 = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 2,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 2,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 2,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 2,
  },
]

const datakaryawanBerkontrakR2 = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 32,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 17,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 13,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 3,
  },
]

const datakaryawanBerkontrakR3 = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 1,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 1,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 1,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 1,
  },
]

const datakaryawanBerkontrakR4 = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 6,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 4,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 3,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 0,
  },
]

const datakaryawanBerkontrakR5 = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 14,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 11,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 10,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 3,
  },
]

const datakaryawanBerkontrakR6 = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 5,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 3,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 2,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 0,
  },
]

const datakaryawanBerkontrakR7 = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 0,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 0,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 0,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 0,
  },
]

const datakaryawanBerkontrakR2N2 = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 14,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 9,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 7,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 2,
  },
]

const datakaryawanBerkontrakRSulawesi = [
  {
    jabatan: "ASISTEN AFDELING",
    jumlah_berkontrak: 0,
  },
  {
    jabatan: "ASISTEN KEPALA",
    jumlah_berkontrak: 0,
  },
  {
    jabatan: "MANAJER",
    jumlah_berkontrak: 0,
  },
  {
    jabatan: "GENERAL MANAGER",
    jumlah_berkontrak: 0,
  },
]

// Combine all regional berkontrak data into one array
const allBerkontrakData = [
  ...datakaryawanBerkontrakR1,
  ...datakaryawanBerkontrakR2,
  ...datakaryawanBerkontrakR3,
  ...datakaryawanBerkontrakR4,
  ...datakaryawanBerkontrakR5,
  ...datakaryawanBerkontrakR6,
  ...datakaryawanBerkontrakR7,
  ...datakaryawanBerkontrakR2N2,
  ...datakaryawanBerkontrakRSulawesi,
]

interface IntegratedSummaryStatsProps {
  data: any[]
  filteredData: any[]
  personnelData: PersonnelData[]
  regional?: string
  kode_unit?: string
}
const IntegratedSummaryStats: React.FC<IntegratedSummaryStatsProps> = ({ 
  data, 
  filteredData, 
  personnelData,
  regional
}) => {
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

  // Filter berkontrak data based on selected regional
  const getBerkontrakDataByRegional = (regionalCode: string | undefined) => {
    if (!regionalCode) return allBerkontrakData
    
    switch(regionalCode) {
      case '1': return datakaryawanBerkontrakR1
      case '2': return datakaryawanBerkontrakR2
      case '3': return datakaryawanBerkontrakR3
      case '4': return datakaryawanBerkontrakR4
      case '5': return datakaryawanBerkontrakR5
      case '6': return datakaryawanBerkontrakR6
      case '7': return datakaryawanBerkontrakR7
      case 'M': return datakaryawanBerkontrakR2N2
      case '8': return datakaryawanBerkontrakRSulawesi
      default: return allBerkontrakData
    }
  }

  const regionalBerkontrakData = getBerkontrakDataByRegional(regional)
  
  const berkontrakStats = regionalBerkontrakData.reduce(
    (acc, item) => {
      if (!acc[item.jabatan]) {
        acc[item.jabatan] = 0
      }
      acc[item.jabatan] += item.jumlah_berkontrak
      return acc
    },
    {} as Record<string, number>,
  )

  const targetPositions = ["ASISTEN AFDELING", "ASISTEN KEPALA", "MANAJER", "GENERAL MANAGER"]

  return (
    <div className="mb-5">
      {/* Job Breakdown */}
      <CardTitle className="text-xl font-medium text-slate-300 mb-3">Breakdown Personil per Jabatan</CardTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {Object.entries(jobStats).map(([job, stats]: [string, any]) => {
          const percentage = stats.total > 0 ? (stats.sudah / stats.total) * 100 : 0
          return (
            <div key={job} className="bg-slate-950 rounded-lg p-3 shadow-lg">
              <div className="flex justify-between mb-2">
                <span className="text-md font-medium text-white">{job}</span>
                <span className="text-lg text-orange-300 text-right"> {percentage.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between text-lg mb-2">
                <span className="text-slate-100">Total: {stats.total}</span>
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

      {/* Total Berkontrak Section */}
      <CardTitle className="text-xl font-medium text-slate-300 mb-3 mt-6">
        Total Karyawan Berkontrak {regional ? `Regional ${regional}` : ''}
      </CardTitle>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {targetPositions.map((position) => {
          const totalBerkontrak = berkontrakStats[position] || 0
          return (
            <div key={position} className="bg-slate-950 rounded-lg p-4 shadow-lg">
              <div className="flex items-center justify-between mb-3">
                <Users className="h-6 w-6 text-blue-400" />
                <span className="text-2xl font-bold text-blue-300">{totalBerkontrak}</span>
              </div>
              <div className="text-sm font-medium text-white mb-1">{position}</div>
              <div className="text-xs text-slate-400">Total Berkontrak</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
export default IntegratedSummaryStats
