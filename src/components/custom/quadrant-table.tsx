"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from "@tanstack/react-table"
import * as XLSX from "xlsx"

interface QuadrantData {
  kebun: string
  vegetatif: number
  serapanBiaya: number
  region: string
  quadrant: string
  quadrantColor: string
  description: string
}

interface QuadrantTableProps {
  chartData: any[]
}

const columnHelper = createColumnHelper<QuadrantData>()

const QuadrantTable = ({ chartData }: QuadrantTableProps) => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>("all")
  const [sorting, setSorting] = useState<SortingState>([])

  // Function to determine quadrant based on vegetatif and serapanBiaya values
  const getQuadrant = (vegetatif: number, serapanBiaya: number) => {
    if (vegetatif >= 90 && serapanBiaya >= 60) {
      return { name: "Emas", color: "bg-yellow-500", description: "Tinggi-Tinggi", hexColor: "#EAB308" }
    } else if (vegetatif >= 90 && serapanBiaya < 60) {
      return { name: "Hijau", color: "bg-green-500", description: "Tinggi-Rendah", hexColor: "#22C55E" }
    } else if (vegetatif < 90 && serapanBiaya >= 60) {
      return { name: "Merah", color: "bg-red-500", description: "Rendah-Tinggi", hexColor: "#EF4444" }
    } else {
      return { name: "Hitam", color: "bg-black", description: "Rendah-Rendah", hexColor: "#1F2937" }
    }
  }

  // Process chart data to include quadrant information
  const processedData: QuadrantData[] = useMemo(() => {
    return chartData.map((item) => {
      const quadrantInfo = getQuadrant(item.vegetatif, item.serapanBiaya)
      return {
        kebun: item.kebun,
        vegetatif: item.vegetatif,
        serapanBiaya: item.serapanBiaya,
        region: item.region,
        quadrant: quadrantInfo.name,
        quadrantColor: quadrantInfo.color,
        description: quadrantInfo.description,
      }
    })
  }, [chartData])

  // Group data by quadrants in the specified order
  const quadrantGroups = {
    Emas: processedData.filter((item) => item.quadrant === "Emas"),
    Hijau: processedData.filter((item) => item.quadrant === "Hijau"),
    Merah: processedData.filter((item) => item.quadrant === "Merah"),
    Hitam: processedData.filter((item) => item.quadrant === "Hitam"),
  }

  // Filter data based on selected quadrant
  const filteredData = useMemo(() => {
    return selectedQuadrant === "all"
      ? processedData
      : processedData.filter((item) => item.quadrant === selectedQuadrant)
  }, [processedData, selectedQuadrant])

  // Define columns for the table
  const columns = [
    columnHelper.accessor("kebun", {
      header: "Kebun",
      cell: (info) => <div className="font-medium">{info.getValue()}</div>,
    }),
    columnHelper.accessor("region", {
      header: "Regional",
      cell: (info) => <div>{info.getValue()}</div>,
    }),
    columnHelper.accessor("vegetatif", {
      header: "Nilai Vegetatif",
      cell: (info) => <div className="text-left">{info.getValue().toFixed(2)}</div>,
    }),
    columnHelper.accessor("serapanBiaya", {
      header: "Serapan Biaya (%)",
      cell: (info) => <div className="text-left">{info.getValue().toFixed(2)}%</div>,
    }),
    columnHelper.accessor("quadrant", {
      header: "Kategori",
      cell: (info) => {
        const row = info.row.original
        return (
          <Badge
            className={`${row.quadrantColor} text-white flex items-center gap-1 w-fit`}
            variant="secondary"
          >
            <div className={`w-2 h-2 rounded-full bg-white/30`}></div>
            {info.getValue()}
          </Badge>
        )
      },
      enableSorting: true,
      sortingFn: (rowA, rowB) => {
        const order = ["Emas", "Hijau", "Merah", "Hitam"]
        return order.indexOf(rowA.original.quadrant) - order.indexOf(rowB.original.quadrant)
      },
    }),
  ]

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Enhanced Excel export with colors
  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new()

    // Prepare data with headers
    const headers = ["Kebun", "Regional", "Nilai Vegetatif", "Serapan Biaya (%)", "Kategori", "Deskripsi"]
    const data = processedData.map((item) => [
      item.kebun,
      item.region,
      item.vegetatif.toFixed(2),
      item.serapanBiaya.toFixed(2),
      item.quadrant,
      item.description,
    ])

    // Create worksheet
    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data])

    // Set column widths
    worksheet["!cols"] = [
      { width: 15 }, // Kebun
      { width: 12 }, // Regional
      { width: 15 }, // Nilai Vegetatif
      { width: 18 }, // Serapan Biaya
      { width: 12 }, // Kategori
      { width: 15 }, // Deskripsi
    ]

    // Style the header row
    const headerStyle = {
      fill: {
        fgColor: { rgb: "0F766E" }, // Teal color matching the table header
      },
      font: {
        color: { rgb: "FFFFFF" },
        bold: true,
        sz: 12,
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
      },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    }

    // Apply header styling
    for (let col = 0; col < headers.length; col++) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col })
      if (!worksheet[cellAddress]) continue
      worksheet[cellAddress].s = headerStyle
    }

    // Style category cells with colors
    data.forEach((row, rowIndex) => {
      const category = row[4] // Kategori column
      const cellAddress = XLSX.utils.encode_cell({ r: rowIndex + 1, c: 4 })

      if (!worksheet[cellAddress]) return

      let categoryColor = "FFFFFF"
      switch (category) {
        case "Emas":
          categoryColor = "EAB308"
          break
        case "Hijau":
          categoryColor = "22C55E"
          break
        case "Merah":
          categoryColor = "EF4444"
          break
        case "Hitam":
          categoryColor = "1F2937"
          break
      }

      worksheet[cellAddress].s = {
        fill: {
          fgColor: { rgb: categoryColor },
        },
        font: {
          color: { rgb: "FFFFFF" },
          bold: true,
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
        },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      }
    })

    // Add summary sheet
    const summaryData = [
      ["Ringkasan Analisis Kategori Kebun"],
      [""],
      ["Kategori", "Jumlah Kebun", "Persentase"],
      ...Object.entries(quadrantGroups).map(([category, data]) => [
        category,
        data.length,
        `${((data.length / processedData.length) * 100).toFixed(1)}%`,
      ]),
      [""],
      ["Total Kebun", processedData.length, "100%"],
      [""],
      ["Statistik"],
      [
        "Rata-rata Vegetatif",
        (processedData.reduce((sum, item) => sum + item.vegetatif, 0) / processedData.length).toFixed(2),
      ],
      [
        "Rata-rata Serapan Biaya",
        `${(processedData.reduce((sum, item) => sum + item.serapanBiaya, 0) / processedData.length).toFixed(2)}%`,
      ],
    ]

    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    summarySheet["!cols"] = [{ width: 20 }, { width: 15 }, { width: 15 }]

    // Add sheets to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Kebun")
    XLSX.utils.book_append_sheet(workbook, summarySheet, "Ringkasan")

    // Save file
    XLSX.writeFile(workbook, `analisis-kategori-kebun-${new Date().toISOString().split("T")[0]}.xlsx`)
  }

  const getSortIcon = (column: any) => {
    const sortDirection = column.getIsSorted()
    if (sortDirection === "asc") {
      return <ArrowUp className="h-4 w-4" />
    } else if (sortDirection === "desc") {
      return <ArrowDown className="h-4 w-4" />
    }
    return <ArrowUpDown className="h-4 w-4" />
  }

  return (
    <Card className="mt-6">
    <CardHeader className="rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl font-bold">Analisis Kategori Kebun</CardTitle>
            <p className="dark:text-teal-100 text-teal-900 mt-1">Sistem kategorisasi berdasarkan performa vegetatif dan serapan biaya</p>
          </div>
          <Button
            onClick={exportToExcel}
            className="bg-white text-teal-900 hover:bg-teal-50 flex items-center gap-2 font-medium shadow-md"
          >
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Category Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(quadrantGroups).map(([quadrant, data]) => {
            const quadrantInfo = getQuadrant(
              quadrant === "Emas" ? 95 : quadrant === "Hijau" ? 95 : quadrant === "Merah" ? 85 : 85,
              quadrant === "Emas" ? 80 : quadrant === "Hijau" ? 40 : quadrant === "Merah" ? 80 : 40,
            )

            return (
              <Card
                key={quadrant}
                className={`cursor-pointer transition-all hover:shadow-lg ${selectedQuadrant === quadrant ? "ring-2 ring-blue-500" : ""
                  }`}
                onClick={() => setSelectedQuadrant(selectedQuadrant === quadrant ? "all" : quadrant)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-4 h-4 rounded ${quadrantInfo.color}`}></div>
                    <h3 className="font-semibold text-sm">{quadrant}</h3>
                  </div>
                  <p className="text-2xl font-bold">{data.length}</p>
                  <p className="text-xs text-muted-foreground">{quadrantInfo.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Button
            variant={selectedQuadrant === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedQuadrant("all")}
          >
            Semua ({processedData.length})
          </Button>
          {Object.entries(quadrantGroups).map(([quadrant, data]) => (
            <Button
              key={quadrant}
              variant={selectedQuadrant === quadrant ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedQuadrant(quadrant)}
              className="flex items-center gap-2"
            >
              <div
                className={`w-3 h-3 rounded-full ${quadrant === "Emas"
                    ? "bg-yellow-500"
                    : quadrant === "Hijau"
                      ? "bg-green-500"
                      : quadrant === "Merah"
                        ? "bg-red-500"
                        : "bg-black"
                  }`}
              ></div>
              {quadrant} ({data.length})
            </Button>
          ))}
        </div>

        {/* Data Table */}
        <div className="rounded-md border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-l from-sky-700 to-green-700">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th key={header.id} className="px-4 py-3 text-left text-sm font-medium text-white">
                        {header.isPlaceholder ? null : (
                          <div
                            className={`flex items-center gap-2 ${header.column.getCanSort() ? "cursor-pointer select-none" : ""
                              }`}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && getSortIcon(header.column)}
                          </div>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                {table.getRowModel().rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8 text-muted-foreground">
                      Tidak ada data untuk ditampilkan
                    </td>
                  </tr>
                ) : (
                  table.getRowModel().rows.map((row, index) => (
                    <tr key={row.id} className={index % 2 === 0 ? "bg-white dark:bg-slate-900" : "bg-gray-50 dark:bg-slate-800"}>
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 text-sm text-left">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="mt-4 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">Ringkasan Statistik</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Kebun</p>
              <p className="font-semibold">{processedData.length}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Rata-rata Vegetatif</p>
              <p className="font-semibold">
                {processedData.length > 0
                  ? (processedData.reduce((sum, item) => sum + item.vegetatif, 0) / processedData.length).toFixed(2)
                  : "0.00"}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Rata-rata Serapan</p>
              <p className="font-semibold">
                {processedData.length > 0
                  ? (processedData.reduce((sum, item) => sum + item.serapanBiaya, 0) / processedData.length).toFixed(2)
                  : "0.00"}
                %
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Kategori Terbanyak</p>
              <p className="font-semibold">
                {Object.entries(quadrantGroups).reduce(
                  (max, [quadrant, data]) =>
                    data.length > (quadrantGroups[max as keyof typeof quadrantGroups]?.length || 0) ? quadrant : max,
                  "Emas",
                )}
              </p>
            </div>
          </div>
        </div>


      </CardContent>
    </Card>
  )
}

export default QuadrantTable
