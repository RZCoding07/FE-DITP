"use client"

import { useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FaDownload } from "react-icons/fa"

interface TbmCorporateRecapProps {
  scoresAll: any[]
  rpc?: { value: string; label: string }
  kebun?: any;
  afd?: { value: string; label: string }
  selectedCard: {
    ctg: string
    name: string
  }
  bulan?: { value: string; label: string }
  tahun?: { value: string; label: string }
  handleDownload: any
}

interface CorporateRecapData {
  name: string
  categories: {
    A: { area: number; percentage: number }
    B: { area: number; percentage: number }
    C: { area: number; percentage: number }
    D: { area: number; percentage: number }
  }
  totalArea: number
}
const formatNumber = (value: number) =>
  new Intl.NumberFormat("id-ID", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value)

export function TbmCorporateRecap({ scoresAll, rpc, kebun, afd, selectedCard, bulan, tahun, handleDownload }: TbmCorporateRecapProps) {
  const recapData = useMemo(() => {
    if (!scoresAll || scoresAll.length === 0) return []

    // Filter data based on selected TBM category
    let filteredData = scoresAll

    // Filter berdasarkan TBM category
    if (selectedCard.ctg !== "tbm-all") {
      filteredData = filteredData.filter((item) => item.vw_fase_tbm === selectedCard.ctg)
    }

    // Apply additional filters
    if (rpc && rpc.value !== "all") {
      filteredData = filteredData.filter((item) => item.regional === rpc.value)
    }
    if (kebun && kebun.value) {
      filteredData = filteredData.filter((item) => item.kebun === kebun.value)
    }
    if (afd && afd.value) {
      filteredData = filteredData.filter((item) => item.afdeling === afd.value)
    }

    const processData = (data: any[], groupBy: string): CorporateRecapData[] => {
      const grouped = data.reduce((acc, item) => {
        const key = item[groupBy]
        if (!acc[key]) {
          acc[key] = []
        }
        acc[key].push(item)
        return acc
      }, {})

      return Object.entries(grouped)
        .map(([name, items]: [string, any]) => {
          const totalArea = items.reduce((sum: number, item: any) => sum + item.luas, 0)

          const categories = {
            A: { area: 0, percentage: 0 },
            B: { area: 0, percentage: 0 },
            C: { area: 0, percentage: 0 },
            D: { area: 0, percentage: 0 },
          }

          items.forEach((item: any) => {
            let category: "A" | "B" | "C" | "D"
            if (item.colorCategory === "gold") category = "A"
            else if (item.colorCategory === "green") category = "B"
            else if (item.colorCategory === "red") category = "C"
            else category = "D"

            categories[category].area += item.luas
          })

          // Calculate percentages
          Object.keys(categories).forEach((key) => {
            const cat = categories[key as keyof typeof categories]
            cat.percentage = totalArea > 0 ? (cat.area / totalArea) * 100 : 0
          })

          return {
            name,
            categories,
            totalArea,
          }
        })
        .sort((a, b) => a.name.localeCompare(b.name))
    }

    // Tentukan level pengelompokan berdasarkan filter yang aktif
    if (rpc?.value === "all" && !kebun?.value && !afd?.value) {
      return processData(filteredData, "regional")
    } else if (rpc?.value !== "all" && !kebun?.value && !afd?.value) {
      return processData(filteredData, "kebun")
    } else if (kebun?.value && !afd?.value) {
      return processData(filteredData, "afdeling")
    } else if (afd?.value) {
      return processData(filteredData, "blok")
    }

    return []
  }, [scoresAll, rpc, kebun, afd, selectedCard])

  const totalData = useMemo(() => {
    if (recapData.length === 0) return null

    const total = {
      A: { area: 0, percentage: 0 },
      B: { area: 0, percentage: 0 },
      C: { area: 0, percentage: 0 },
      D: { area: 0, percentage: 0 },
      totalArea: 0,
    }

    recapData.forEach((item) => {
      total.A.area += item.categories.A.area
      total.B.area += item.categories.B.area
      total.C.area += item.categories.C.area
      total.D.area += item.categories.D.area
      total.totalArea += item.totalArea
    })

    // Calculate total percentages
    if (total.totalArea > 0) {
      total.A.percentage = (total.A.area / total.totalArea) * 100
      total.B.percentage = (total.B.area / total.totalArea) * 100
      total.C.percentage = (total.C.area / total.totalArea) * 100
      total.D.percentage = (total.D.area / total.totalArea) * 100
    }

    return total
  }, [recapData])

  const getUnitName = () => {
    if (afd?.value) return "BLOK"
    if (kebun?.value) return "AFDELING"
    if (rpc?.value !== "all") return "KEBUN"
    return "REGIONAL"
  }

  const getCellStyle = (percentage: number) => {
    if (percentage === 0) return "bg-transparent"
    if (percentage > 50) return "bg-trannsparent"
    if (percentage > 30) return "bg-transparent"
    return "bg-transparent"
  }

  if (recapData.length === 0) {
    return (
      <Card className="mt-5 rounded-lg border border-cyan-500 bg-white shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Rekapitulasi - Pengukuran Vegetatif {selectedCard.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500">Tidak ada data untuk ditampilkan</p>
        </CardContent>
      </Card>
    )
  }

  

  return (
    <Card className="rounded-lg border border-cyan-500 bg-white shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Rekapitulasi - Pengukuran Vegetatif {selectedCard.name}
          {rpc && rpc.value !== "all" && ` - ${rpc.label}`}
          {kebun && ` - ${kebun.label}`}
          {afd && ` - ${afd.label}`}
          <span className="text-sm font-normal ml-2">
            ({bulan?.label} {tahun?.label})
          </span>

            <button
                onClick={handleDownload}
                className="ml-4 px-3 py-1 bg-slate-950 text-slate-900 rounded-lg hover:bg-slate-950 transition-colors float-end"
            >
                <FaDownload className="inline rounded-lg hover:text-slate-900" />
            </button>

        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-400 text-sm">
            <thead>
              {/* Header Row 1 */}
              <tr className="bg-gradient-to-r from-green-700 to-green-800 text-white">
         
                <th rowSpan={2} className="border border-gray-400 px-3 py-2 text-center font-bold">
                  {getUnitName()}
                </th>
                <th colSpan={8} className="border border-gray-400 px-3 py-2 text-center font-bold">
                  Kelas TBM
                </th>
                <th colSpan={2} className="border border-gray-400 px-3 py-2 text-center font-bold">
                  Total
                </th>
              </tr>
              {/* Header Row 2 */}
              <tr className="bg-gradient-to-r from-green-700 to-green-800 text-white">
                <th colSpan={2} className="border border-gray-400 px-3 py-2 text-center font-bold bg-yellow-600">
                  A
                </th>
                <th colSpan={2} className="border border-gray-400 px-3 py-2 text-center font-bold bg-green-600">
                  B
                </th>
                <th colSpan={2} className="border border-gray-400 px-3 py-2 text-center font-bold bg-red-600">
                  C
                </th>
                <th colSpan={2} className="border border-gray-400 px-3 py-2 text-center font-bold bg-gray-800">
                  D
                </th>
                <th className="border border-gray-400 px-3 py-2 text-center font-bold">
                  Fisik (Ha)
                </th>
                <th className="border border-gray-400 px-3 py-2 text-center font-bold">
                  %
                </th>
              </tr>
              {/* Header Row 3 - Sub headers */}
              <tr className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs">
                <th className="border border-gray-400 px-2 py-1 text-center">{getUnitName()}</th>
                <th className="border border-gray-400 px-2 py-1 text-center bg-yellow-500">Fisik (Ha)</th>
                <th className="border border-gray-400 px-2 py-1 text-center bg-yellow-500">%</th>
                <th className="border border-gray-400 px-2 py-1 text-center bg-green-500">Fisik (Ha)</th>
                <th className="border border-gray-400 px-2 py-1 text-center bg-green-500">%</th>
                <th className="border border-gray-400 px-2 py-1 text-center bg-red-500">Fisik (Ha)</th>
                <th className="border border-gray-400 px-2 py-1 text-center bg-red-500">%</th>
                <th className="border border-gray-400 px-2 py-1 text-center bg-gray-700">Fisik (Ha)</th>
                <th className="border border-gray-400 px-2 py-1 text-center bg-gray-700">%</th>
                <th className="border border-gray-400 px-2 py-1 text-center">Fisik (Ha)</th>
                <th className="border border-gray-400 px-2 py-1 text-center">%</th>
              </tr>
            </thead>
               <tbody>
              {recapData.map((item, index) => (
                <tr key={index}>
                  <td className="border px-3 py-2 text-center font-medium">{item.name}</td>
                  {(["A", "B", "C", "D"] as const).map((cat) => (
                    <>
                      <td className="border px-3 py-2 text-center">
                        {item.categories[cat].area > 0 ? formatNumber(item.categories[cat].area) : "-"}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {item.categories[cat].percentage > 0 ? formatNumber(item.categories[cat].percentage) : "-"}
                      </td>
                    </>
                  ))}
                  <td className="border px-3 py-2 text-center font-semibold">
                    {formatNumber(item.totalArea)}
                  </td>
                  <td className="border px-3 py-2 text-center font-semibold">100,00</td>
                </tr>
              ))}
              {totalData && (
                <tr className="font-bold">
                  <td className="border px-3 py-2 text-center">Total</td>
                  {(["A", "B", "C", "D"] as const).map((cat) => (
                    <>
                      <td className="border px-3 py-2 text-center">
                        {totalData[cat].area > 0 ? formatNumber(totalData[cat].area) : "-"}
                      </td>
                      <td className="border px-3 py-2 text-center">
                        {totalData[cat].percentage > 0 ? formatNumber(totalData[cat].percentage) : "-"}
                      </td>
                    </>
                  ))}
                  <td className="border px-3 py-2 text-center">{formatNumber(totalData.totalArea)}</td>
                  <td className="border px-3 py-2 text-center">100,00</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-yellow-400 to-yellow-600"></div>
            <span className="text-sm font-medium">A - Emas (Gold)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-green-400 to-green-600"></div>
            <span className="text-sm font-medium">B - Hijau (Green)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-red-400 to-red-600"></div>
            <span className="text-sm font-medium">C - Merah (Red)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded bg-gradient-to-r from-gray-700 to-black"></div>Hitam
          </div>
        </div>

        {/* Summary Information */}
        <div className="mt-6 p-4 bg-gradient-to-r dark:from-blue-950 dark:to-blue-900 rounded-lg">
          <h3 className="text-lg font-semibold mb-2">Hasil pengukuran vegetatif {selectedCard.name}:</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            {totalData && (
              <>
                <div>
                  <span className="font-medium">TBM Prima (Kelas A & B) = </span>
                  <span className="font-bold text-green-600">
                    {((totalData.A.percentage + totalData.B.percentage)).toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="font-medium">TBM Non Prima (Kelas C & D) = </span>
                  <span className="font-bold text-red-600">
                    {((totalData.C.percentage + totalData.D.percentage)).toFixed(1)}%
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
