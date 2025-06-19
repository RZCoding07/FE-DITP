import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Download, FileSpreadsheet } from 'lucide-react'
import Papa from "papaparse"

interface QuadrantData {
  kebun: string
  vegetatif: number
  serapanBiaya: number
  region: string
  quadrant: string
  quadrantColor: string
}

interface QuadrantTableProps {
  chartData: any[]
}

const QuadrantTable = ({ chartData }: QuadrantTableProps) => {
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>("all")

  // Function to determine quadrant based on vegetatif and serapanBiaya values
  const getQuadrant = (vegetatif: number, serapanBiaya: number) => {
    if (vegetatif >= 90 && serapanBiaya >= 60) {
      return { name: "Kuadran I", color: "bg-yellow-500", description: "Tinggi-Tinggi" }
    } else if (vegetatif < 90 && serapanBiaya >= 60) {
      return { name: "Kuadran II", color: "bg-red-500", description: "Rendah-Tinggi" }
    } else if (vegetatif < 90 && serapanBiaya < 60) {
      return { name: "Kuadran III", color: "bg-black", description: "Rendah-Rendah" }
    } else {
      return { name: "Kuadran IV", color: "bg-green-500", description: "Tinggi-Rendah" }
    }
  }

  // Process chart data to include quadrant information
  const processedData: QuadrantData[] = chartData.map(item => {
    const quadrantInfo = getQuadrant(item.vegetatif, item.serapanBiaya)
    return {
      kebun: item.kebun,
      vegetatif: item.vegetatif,
      serapanBiaya: item.serapanBiaya,
      region: item.region,
      quadrant: quadrantInfo.name,
      quadrantColor: quadrantInfo.color
    }
  })

  // Group data by quadrants
  const quadrantGroups = {
    "Kuadran I": processedData.filter(item => item.quadrant === "Kuadran I"),
    "Kuadran II": processedData.filter(item => item.quadrant === "Kuadran II"),
    "Kuadran III": processedData.filter(item => item.quadrant === "Kuadran III"),
    "Kuadran IV": processedData.filter(item => item.quadrant === "Kuadran IV")
  }

  // Filter data based on selected quadrant
  const filteredData = selectedQuadrant === "all" 
    ? processedData 
    : processedData.filter(item => item.quadrant === selectedQuadrant)

  // Export to Excel function
  const exportToExcel = () => {
    const exportData = processedData.map(item => ({
      'Kebun': item.kebun,
      'Regional': item.region,
      'Nilai Vegetatif': item.vegetatif.toFixed(2),
      'Serapan Biaya (%)': item.serapanBiaya.toFixed(2),
      'Kuadran': item.quadrant,
      'Kategori': getQuadrant(item.vegetatif, item.serapanBiaya).description
    }))

    const csv = Papa.unparse(exportData)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `kuadran-pica-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Tabulasi Kebun per Kuadran</CardTitle>
          <Button onClick={exportToExcel} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export Excel
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Quadrant Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {Object.entries(quadrantGroups).map(([quadrant, data]) => {
            const quadrantInfo = getQuadrant(
              quadrant === "Kuadran I" ? 95 : quadrant === "Kuadran II" ? 85 : quadrant === "Kuadran III" ? 85 : 95,
              quadrant === "Kuadran I" ? 80 : quadrant === "Kuadran II" ? 80 : quadrant === "Kuadran III" ? 40 : 40
            )
            
            return (
              <Card 
                key={quadrant} 
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedQuadrant === quadrant ? 'ring-2 ring-blue-500' : ''
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
            >
              {quadrant} ({data.length})
            </Button>
          ))}
        </div>

        {/* Data Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-gradient-to-l from-sky-700 to-green-700">
              <TableRow>
                <TableHead>Kebun</TableHead>
                <TableHead>Regional</TableHead>
                <TableHead className="text-right">Nilai Vegetatif</TableHead>
                <TableHead className="text-right">Serapan Biaya (%)</TableHead>
                <TableHead>Kuadran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    Tidak ada data untuk ditampilkan
                  </TableCell>
                </TableRow>
              ) : (
                filteredData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.kebun}</TableCell>
                    <TableCell>{item.region}</TableCell>
                    <TableCell className="text-right">{item.vegetatif.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.serapanBiaya.toFixed(2)}%</TableCell>
                    <TableCell>
                      <Badge 
                        className={`${item.quadrantColor} text-white`}
                        variant="secondary"
                      >
                        {item.quadrant}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
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
                  : '0.00'
                }
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Rata-rata Serapan</p>
              <p className="font-semibold">
                {processedData.length > 0 
                  ? (processedData.reduce((sum, item) => sum + item.serapanBiaya, 0) / processedData.length).toFixed(2)
                  : '0.00'
                }%
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Kuadran Terbanyak</p>
              <p className="font-semibold">
                {Object.entries(quadrantGroups).reduce((max, [quadrant, data]) => 
                  data.length > (quadrantGroups[max as keyof typeof quadrantGroups]?.length || 0) ? quadrant : max, 
                  "Kuadran I"
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
