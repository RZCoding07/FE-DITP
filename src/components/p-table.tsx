"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TrendingUpIcon, SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import Papa from "papaparse"

interface ProgressData {
  regional: string
  rkap2025: {
    setahun: { rp: number; paket: number }
    sdBi: { rp: number; paket: number }
  }
  realProgress: {
    hps: { paket: number }
    pengadaan: { paket: number }
    sppbj: { rp: number; paket: number }
  }
  progressInfo: {
    hps: number
    pengadaan: number
    sppbj: { rp: number; paket: number }
  }
  totalPaket: {
    belumProses: number
    sudahProses: number
  }
  progressPaket: {
    hMinus1: number | string
    growth: number | string
  }
  rank: number
}

const mockData: ProgressData[] = [
  {
    regional: "RPC 1 Ex N3",
    rkap2025: {
      setahun: { rp: 166.16, paket: 475 },
      sdBi: { rp: 166.16, paket: 475 }
    },
    realProgress: {
      hps: { paket: 91 },
      pengadaan: { paket: 87.51 },
      sppbj: { rp: 299, paket: 19.16 }
    },
    progressInfo: {
      hps: 52.67,
      pengadaan: 62.95,
      sppbj: { rp: 17.89, paket: 82.11 }
    },
    totalPaket: {
      belumProses: 17.89,
      sudahProses: 82.11
    },
    progressPaket: {
      hMinus1: "-",
      growth: 82.11
    },
    rank: 9
  },
  {
    regional: "RPC 2 Ex N4",
    rkap2025: {
      setahun: { rp: 229.23, paket: 510 },
      sdBi: { rp: 229.23, paket: 510 }
    },
    realProgress: {
      hps: { paket: 111 },
      pengadaan: { paket: 125 },
      sppbj: { rp: 96.72, paket: 209 }
    },
    progressInfo: {
      hps: 24.51,
      pengadaan: 42.19,
      sppbj: { rp: 40.98, paket: 87.25 }
    },
    totalPaket: {
      belumProses: 12.75,
      sudahProses: 87.25
    },
    progressPaket: {
      hMinus1: "-",
      growth: 87.25
    },
    rank: 7
  },
  {
    regional: "RPC 3 Ex N5",
    rkap2025: {
      setahun: { rp: 194.04, paket: 126 },
      sdBi: { rp: 194.04, paket: 126 }
    },
    realProgress: {
      hps: { paket: 3 },
      pengadaan: { paket: 4 },
      sppbj: { rp: 130.77, paket: 115 }
    },
    progressInfo: {
      hps: 3.17,
      pengadaan: 67.40,
      sppbj: { rp: 91.27, paket: 96.83 }
    },
    totalPaket: {
      belumProses: 3.17,
      sudahProses: 96.83
    },
    progressPaket: {
      hMinus1: "-",
      growth: 96.83
    },
    rank: 3
  },
  {
    regional: "RPC 4 Ex N6",
    rkap2025: {
      setahun: { rp: 44.90, paket: 120 },
      sdBi: { rp: 44.90, paket: 120 }
    },
    realProgress: {
      hps: { paket: 8 },
      pengadaan: { paket: 15 },
      sppbj: { rp: 24.77, paket: 95 }
    },
    progressInfo: {
      hps: 12.50,
      pengadaan: 55.16,
      sppbj: { rp: 79.17, paket: 98.33 }
    },
    totalPaket: {
      belumProses: 1.67,
      sudahProses: 98.33
    },
    progressPaket: {
      hMinus1: 0,
      growth: 0
    },
    rank: 2
  },
  {
    regional: "RPC 5 Ex N13",
    rkap2025: {
      setahun: { rp: 79.23, paket: 71 },
      sdBi: { rp: 79.23, paket: 71 }
    },
    realProgress: {
      hps: { paket: 10 },
      pengadaan: { paket: 50.79 },
      sppbj: { rp: 51, paket: 14.08 }
    },
    progressInfo: {
      hps: 64.10,
      pengadaan: 71.83,
      sppbj: { rp: 14.08, paket: 85.92 }
    },
    totalPaket: {
      belumProses: 14.08,
      sudahProses: 85.92
    },
    progressPaket: {
      hMinus1: 475.00,
      growth: -389.08
    },
    rank: 8
  },
  {
    regional: "RPC 6 Ex N1",
    rkap2025: {
      setahun: { rp: 48.53, paket: 41 },
      sdBi: { rp: 48.53, paket: 41 }
    },
    realProgress: {
      hps: { paket: 3 },
      pengadaan: { paket: 43.64 },
      sppbj: { rp: 35, paket: 7.32 }
    },
    progressInfo: {
      hps: 89.93,
      pengadaan: 85.37,
      sppbj: { rp: 7.32, paket: 92.68 }
    },
    totalPaket: {
      belumProses: 7.32,
      sudahProses: 92.68
    },
    progressPaket: {
      hMinus1: 510.00,
      growth: -417.32
    },
    rank: 5
  },
  {
    regional: "RPC 7 Ex N7",
    rkap2025: {
      setahun: { rp: 52.56, paket: 65 },
      sdBi: { rp: 52.56, paket: 65 }
    },
    realProgress: {
      hps: { paket: 5 },
      pengadaan: { paket: 8 },
      sppbj: { rp: 32.91, paket: 44 }
    },
    progressInfo: {
      hps: 12.31,
      pengadaan: 62.62,
      sppbj: { rp: 67.69, paket: 87.69 }
    },
    totalPaket: {
      belumProses: 12.31,
      sudahProses: 87.69
    },
    progressPaket: {
      hMinus1: 126.00,
      growth: -38.31
    },
    rank: 6
  },
  {
    regional: "RPC 1 Ex DSMTU",
    rkap2025: {
      setahun: { rp: 19.55, paket: 59 },
      sdBi: { rp: 19.55, paket: 59 }
    },
    realProgress: {
      hps: { paket: 18 },
      pengadaan: { paket: 8.41 },
      sppbj: { rp: 25, paket: 30.51 }
    },
    progressInfo: {
      hps: 43.02,
      pengadaan: 42.37,
      sppbj: { rp: 27.12, paket: 72.88 }
    },
    totalPaket: {
      belumProses: 27.12,
      sudahProses: 72.88
    },
    progressPaket: {
      hMinus1: 120.00,
      growth: -47.12
    },
    rank: 10
  },
  {
    regional: "RPC 1 Ex DJABA",
    rkap2025: {
      setahun: { rp: 36.80, paket: 35 },
      sdBi: { rp: 36.80, paket: 35 }
    },
    realProgress: {
      hps: { paket: 6 },
      pengadaan: { paket: 3 },
      sppbj: { rp: 28.01, paket: 26 }
    },
    progressInfo: {
      hps: 8.57,
      pengadaan: 76.11,
      sppbj: { rp: 74.29, paket: 100.00 }
    },
    totalPaket: {
      belumProses: 0,
      sudahProses: 100.00
    },
    progressPaket: {
      hMinus1: 71.00,
      growth: 29.00
    },
    rank: 1
  },
  {
    regional: "RPC 1 Ex DATIM",
    rkap2025: {
      setahun: { rp: 0.39, paket: 2 },
      sdBi: { rp: 0.39, paket: 2 }
    },
    realProgress: {
      hps: { paket: 0 },
      pengadaan: { paket: 0 },
      sppbj: { rp: 0, paket: 0 }
    },
    progressInfo: {
      hps: 0,
      pengadaan: 0,
      sppbj: { rp: 100.00, paket: 0 }
    },
    totalPaket: {
      belumProses: 100.00,
      sudahProses: 0
    },
    progressPaket: {
      hMinus1: 41.00,
      growth: -41.00
    },
    rank: 11
  },
  {
    regional: "RPC 2 Ex N2",
    rkap2025: {
      setahun: { rp: 36.44, paket: 87 },
      sdBi: { rp: 36.44, paket: 87 }
    },
    realProgress: {
      hps: { paket: 6 },
      pengadaan: { paket: 11 },
      sppbj: { rp: 25.66, paket: 64 }
    },
    progressInfo: {
      hps: 12.64,
      pengadaan: 70.41,
      sppbj: { rp: 73.56, paket: 93.10 }
    },
    totalPaket: {
      belumProses: 6.90,
      sudahProses: 93.10
    },
    progressPaket: {
      hMinus1: 65.00,
      growth: 28.10
    },
    rank: 4
  },
  {
    regional: "RPC 2 Ex N14",
    rkap2025: {
      setahun: { rp: 19.44, paket: 11 },
      sdBi: { rp: 19.44, paket: 11 }
    },
    realProgress: {
      hps: { paket: 2 },
      pengadaan: { paket: 7.90 },
      sppbj: { rp: 6, paket: 18.18 }
    },
    progressInfo: {
      hps: 40.64,
      pengadaan: 54.55,
      sppbj: { rp: 27.27, paket: 72.73 }
    },
    totalPaket: {
      belumProses: 27.27,
      sudahProses: 72.73
    },
    progressPaket: {
      hMinus1: 59.00,
      growth: 13.73
    },
    rank: 12
  },
  {
    regional: "Palmco",
    rkap2025: {
      setahun: { rp: 927.26, paket: 1602 },
      sdBi: { rp: 927.26, paket: 1602 }
    },
    realProgress: {
      hps: { paket: 139 },
      pengadaan: { paket: 290 },
      sppbj: { rp: 537.09, paket: 969 }
    },
    progressInfo: {
      hps: 57.92,
      pengadaan: 60.49,
      sppbj: { rp: 12.73, paket: 87.27 }
    },
    totalPaket: {
      belumProses: 12.73,
      sudahProses: 87.27
    },
    progressPaket: {
      hMinus1: 35.00,
      growth: 52.27
    },
    rank: 0
  }
]

export default function ComponentPTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const [csvData, setCsvData] = useState<any[]>([])


  useEffect(() => {
    fetch(
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vSt5Slr9Cq2F8vMAe_qn75Wybt_oJgvkN5_JL-wL6JMSLXist0U3DTt14syyHiMUzq1WWUAqe-u6PC5/pub?gid=1930147889&single=true&output=csv"
    )
      .then((response) => response.text())
      .then((csv) => {
        Papa.parse(csv, {
          header: false,  // Tidak mengatur header
          skipEmptyLines: true,
          complete: (result: any) => {

            const filteredData = result.data.slice(8, 21); // Menghilangkan baris pertama
            console.log("Parsed CSV Data:", filteredData);

            setCsvData(filteredData);
          },
        });
      });
  }, []);


  const filteredData = mockData.filter((item) =>
    item.regional.toLowerCase().includes(searchTerm.toLowerCase())
  )



  const getProgressColor = (progress: number) => {
    if (progress >= 90) return "bg-green-500"
    if (progress >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return "bg-green-100 text-green-800 border-green-200"
    if (rank <= 3) return "bg-blue-100 text-blue-800 border-blue-200"
    if (rank <= 7) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const formatNumber = (value: number | string) => {
    if (typeof value === 'string') return value
    if (Number.isInteger(value)) return value.toString()
    return value.toFixed(2)
  }

  const formatGrowth = (value: number | string) => {
    if (typeof value === 'string') return value
    if (value < 0) return `(${Math.abs(value).toFixed(2)})`
    return value.toFixed(2)
  }

  return (
    <Card className="shadow-2xl border border-slate-900 bg-slate-950 backdrop-blur-sm">
      <CardHeader className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white rounded-t-lg border-b border-from-teal-600">
        <CardTitle className="text-2xl font-bold">
          <TrendingUpIcon className="inline-block mr-2 h-6 w-6 text-teal-400" />

          Money Progress Capex Tahun 2025</CardTitle>
        <CardDescription className="text-slate-300">
          Rekg 045 Mesin & Instalasi | Update: {new Date().toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric"  
          })} 
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6 bg-slate-950">
        {/* <div className="flex items-center space-x-2 mb-6">
          <div className="relative flex-1 max-w-sm">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari regional..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-2 border-from-teal-600 bg-slate-900 text-white placeholder:text-slate-400 focus:border-blue-400 transition-colors"
            />
          </div>
          <Button variant="outline" className="bg-slate-900 border-2 border-from-teal-600 text-white hover:bg-from-teal-600">
            Export Data
          </Button>
        </div> */}

        <div className="rounded-lg border-2 border-from-teal-600 overflow-hidden shadow-2xl">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-teal-600 to-teal-900">
                <TableHead rowSpan={3} className="text-white font-bold text-center border-r border-slate-900">Regional</TableHead>
                <TableHead colSpan={2} className="text-white font-bold text-center border-r border-slate-900">
                  RKAP 2025
                </TableHead>

                <TableHead colSpan={4} className="text-white font-bold text-center border-r border-slate-900">
                  Real sd Hi
                </TableHead>
                <TableHead colSpan={4} className="text-white font-bold text-center border-r border-slate-900">
                  %ProgressThdp RKAP setahun (%)
                </TableHead>
                <TableHead colSpan={3} className="text-white font-bold text-center border-r border-slate-900">
                  Total Paket (HPS+PBJ+SPPBJ)
                </TableHead>

              </TableRow>
              <TableRow className="bg-gradient-to-r from-teal-600 to-teal-900 text-slate-200">
                <TableHead colSpan={2} className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Setahun
                </TableHead>

                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  HPS
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Pengadaan
                </TableHead>
                <TableHead colSpan={2} className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  SPPBJ
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  HPS
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Pengadaan
                </TableHead>
                <TableHead colSpan={2} className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  SPPBJ
                </TableHead>
                <TableHead colSpan={2} className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Jumlah Paket (%)
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Progress
                </TableHead>

              </TableRow>
              <TableRow className="bg-gradient-to-r from-teal-600 to-teal-900 text-slate-200">
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Rp (.M)
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Paket
                </TableHead>

                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Paket
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Paket
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Rp (.M)
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Paket
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Paket
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Paket
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Rp (.M)
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Paket
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Belum proses
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Sudah proses
                </TableHead>
                <TableHead className="font-semibold text-center border-r border-from-teal-600 text-slate-200">
                  Rank
                </TableHead>

              </TableRow>
            </TableHeader>
            <TableBody>
              {csvData.map((row, index) => (
                <TableRow
                  key={row[0] || index} // Using row[0] as key (regional) or fallback to index
                  className={cn(
                    "hover:bg-slate-900 transition-colors border-b border-from-teal-600",
                    index % 2 === 0 ? "bg-slate-800" : "bg-slate-750",
                  )}
                >
                  {/* Regional */}
                  <TableCell className="font-medium border-r border-from-teal-600 bg-slate-900 text-white">
                    {row[0]}
                  </TableCell>

                  {/* RKAP 2025 Setahun */}
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">
                    {row[1] ? row[1] : 0}
                  </TableCell>
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">{row[2] || "-"}</TableCell>

                  {/* RKAP sd BI */}
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">
                    {row[3] ? row[3] : 0}
                  </TableCell>
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">{row[4] || "-"}</TableCell>

                  {/* Real Progress */}
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">{row[5] || "-"}</TableCell>
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">{row[6] || "-"}</TableCell>
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">
                    {row[7] ? row[7] : 0}
                  </TableCell>
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">{row[8] || "-"}</TableCell>

                  {/* Progress Info */}
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">
                    {row[9] ? row[9] : 0}
                  </TableCell>
                  <TableCell className="text-cent er border-r border-from-teal-600 text-slate-200">
                    {row[10] ? row[10] : 0}
                  </TableCell>
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">
                    {row[11] ? row[11] : 0}
                  </TableCell>
                  <TableCell className="text-center border-r border-from-teal-600 text-slate-200">
                    <div className="flex items-center justify-center">
                      {!isNaN(Number.parseFloat(row[12])) ? (
                        <>
                          <div className={cn("h-3 w-16 rounded-full overflow-hidden bg-slate-700 mr-2")}>
                            <div
                              className={cn("h-full", getProgressColor(Number.parseFloat(row[12])))}
                              style={{ width: `${Number.parseFloat(row[12])}%` }}
                            />
                          </div>
                          {Number.parseFloat(row[12]).toFixed(2)}
                        </>
                      ) : (
                        "-"
                      )}
                    </div>
                  </TableCell>

                  {/* Total Paket */}
                        <TableCell className="text-center border-r border-from-teal-600">
            {row[13] && Number.parseInt(row[13]) > 0 ? (
              <Badge
                variant="outline"
                className={cn("font-bold text-sm px-3 py-1", getRankBadgeColor(Number.parseInt(row[13])))}
              >
                #{row[13]}
              </Badge>
            ) : (
              "-"
            )}
          </TableCell>

                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex justify-between items-center text-sm text-slate-400">
          <p>*Sumber Portal Spreadsheet Google Drive All Region</p>
          <div className="flex items-center space-x-4">
            <span>Total Records: {filteredData.length}</span>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>≥90%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span>70-89%</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>&lt;70%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}