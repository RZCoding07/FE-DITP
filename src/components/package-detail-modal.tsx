"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Building2, MapPin, Calendar, DollarSign, FileText, TrendingUp, Package, Factory } from "lucide-react"

interface PackageDetailModalProps {
  isOpen: boolean
  onClose: () => void
  packageData: any[]
  title?: string
}

export function PackageDetailModal({
  isOpen,
  onClose,
  packageData,
  title = "Detail Paket Pekerjaan",
}: PackageDetailModalProps) {
  const [activeTab, setActiveTab] = useState("overview")

  // Helper function to format currency
  const formatCurrency = (value: string | number) => {
    if (!value || value === "-" || value === "") return "-"
    const numValue = typeof value === "string" ? Number.parseFloat(value.replace(/[^\d.-]/g, "")) : value
    if (isNaN(numValue)) return "-"
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(numValue)
  }

  // Helper function to format date
  const formatDate = (dateStr: string) => {
    if (!dateStr || dateStr === "-") return "-"
    try {
      const date = new Date(dateStr)
      return date.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    } catch {
      return dateStr
    }
  }

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pekerjaan Selesai 100%":
        return "bg-green-100 text-green-800 border-green-200"
      case "Proses Pengerjaan (sudah Terbit Kontrak)":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Proses Pengadaan":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Penetapan HPS":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "Persetujuan Anggaran":
      case "Pembuatan Paket Pekerjaan (PK) IPS":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Helper function to get progress color
  const getProgressColor = (progress: number) => {
    if (progress === 0) return "bg-gray-500"
    if (progress <= 40) return "bg-red-500"
    if (progress <= 60) return "bg-yellow-500"
    if (progress <= 99) return "bg-blue-500"
    return "bg-green-500"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {title}
          </DialogTitle>
          <DialogDescription>Menampilkan {packageData.length} paket pekerjaan dengan detail lengkap</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Ringkasan</TabsTrigger>
            <TabsTrigger value="detailed">Detail Lengkap</TabsTrigger>
            <TabsTrigger value="progress">Progress & Status</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <ScrollArea className="h-[60vh]">
              <div className="grid gap-4">
                {packageData.map((item, index) => (
                  <Card key={index} className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{item[5] || "Nama Investasi Tidak Tersedia"}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Building2 className="h-4 w-4" />
                            <span>{item[11] || "Stasiun tidak tersedia"}</span>
                            <Separator orientation="vertical" className="h-4" />
                            <MapPin className="h-4 w-4" />
                            <span>{item[3] || "Lokasi tidak tersedia"}</span>
                          </div>
                        </div>
                        <div className="text-right space-y-2">
                          <Badge className={getStatusColor(item[14] || "")}>
                            {item[14] || "Status tidak tersedia"}
                          </Badge>
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">Progress:</div>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${getProgressColor(Number.parseInt(item[19]?.replace("%", "") || "0"))}`}
                                  style={{ width: `${Number.parseInt(item[19]?.replace("%", "") || "0")}%` }}
                                />
                              </div>
                              <span className="text-sm font-medium">{item[19] || "0%"}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Kode SINUSA:</span>
                            <span>{item[0] || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Komoditi:</span>
                            <span>{item[2] || "-"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Factory className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Rekening Besar:</span>
                            <span>{item[1] || "-"}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Nilai RKAP:</span>
                            <span>{formatCurrency(item[9])}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Nilai Kontrak:</span>
                            <span>{formatCurrency(item[15])}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <TrendingUp className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Skala Prioritas:</span>
                            <span>{item[20] || "-"}</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Mulai:</span>
                            <span>{formatDate(item[17])}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Berakhir:</span>
                            <span>{formatDate(item[18])}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">No. Kontrak:</span>
                            <span className="text-xs">{item[16] || "-"}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="detailed" className="space-y-4">
            <ScrollArea className="h-[60vh]">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Kode SINUSA</TableHead>
                      <TableHead>Rekening Besar</TableHead>
                      <TableHead>Komoditi</TableHead>
                      <TableHead>Unit Kerja</TableHead>
                      <TableHead>Program Kerja</TableHead>
                      <TableHead className="w-[200px]">Nama Investasi</TableHead>
                      <TableHead>Status Anggaran</TableHead>
                      <TableHead>Total Fisik</TableHead>
                      <TableHead>Satuan</TableHead>
                      <TableHead>Nilai RKAP</TableHead>
                      <TableHead>Status Pelaksanaan</TableHead>
                      <TableHead>Stasiun Pabrik</TableHead>
                      <TableHead>No. Paket PKS</TableHead>
                      <TableHead>Nama Paket SAP/IPS</TableHead>
                      <TableHead>Status Paket</TableHead>
                      <TableHead>Nilai Kontrak</TableHead>
                      <TableHead>No. Kontrak</TableHead>
                      <TableHead>Tanggal Mulai</TableHead>
                      <TableHead>Tanggal Berakhir</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Prioritas</TableHead>
                      <TableHead>Regional</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {packageData.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-mono text-xs">{item[0] || "-"}</TableCell>
                        <TableCell className="text-xs">{item[1] || "-"}</TableCell>
                        <TableCell>{item[2] || "-"}</TableCell>
                        <TableCell className="text-xs">{item[3] || "-"}</TableCell>
                        <TableCell className="text-xs">{item[4] || "-"}</TableCell>
                        <TableCell className="text-xs max-w-[200px] truncate" title={item[5]}>
                          {item[5] || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item[6] || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{item[7] || "-"}</TableCell>
                        <TableCell>{item[8] || "-"}</TableCell>
                        <TableCell className="text-right text-xs">{formatCurrency(item[9])}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">
                            {item[10] || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>{item[11] || "-"}</TableCell>
                        <TableCell className="font-mono text-xs">{item[12] || "-"}</TableCell>
                        <TableCell className="text-xs max-w-[150px] truncate" title={item[13]}>
                          {item[13] || "-"}
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(item[14] || "")}>{item[14] || "-"}</Badge>
                        </TableCell>
                        <TableCell className="text-right text-xs">{formatCurrency(item[15])}</TableCell>
                        <TableCell className="font-mono text-xs max-w-[120px] truncate" title={item[16]}>
                          {item[16] || "-"}
                        </TableCell>
                        <TableCell className="text-xs">{formatDate(item[17])}</TableCell>
                        <TableCell className="text-xs">{formatDate(item[18])}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-12 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(Number.parseInt(item[19]?.replace("%", "") || "0"))}`}
                                style={{ width: `${Number.parseInt(item[19]?.replace("%", "") || "0")}%` }}
                              />
                            </div>
                            <span className="text-xs">{item[19] || "0%"}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">{item[20] || "-"}</TableCell>
                        <TableCell>{item[24] || "-"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-4">
                {/* Progress Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ringkasan Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {[
                        {
                          label: "0%",
                          count: packageData.filter((item) => Number.parseInt(item[19]?.replace("%", "") || "0") === 0)
                            .length,
                          color: "bg-gray-500",
                        },
                        {
                          label: "1-40%",
                          count: packageData.filter((item) => {
                            const progress = Number.parseInt(item[19]?.replace("%", "") || "0")
                            return progress > 0 && progress <= 40
                          }).length,
                          color: "bg-red-500",
                        },
                        {
                          label: "41-60%",
                          count: packageData.filter((item) => {
                            const progress = Number.parseInt(item[19]?.replace("%", "") || "0")
                            return progress > 40 && progress <= 60
                          }).length,
                          color: "bg-yellow-500",
                        },
                        {
                          label: "61-99%",
                          count: packageData.filter((item) => {
                            const progress = Number.parseInt(item[19]?.replace("%", "") || "0")
                            return progress > 60 && progress < 100
                          }).length,
                          color: "bg-blue-500",
                        },
                        {
                          label: "100%",
                          count: packageData.filter(
                            (item) => Number.parseInt(item[19]?.replace("%", "") || "0") === 100,
                          ).length,
                          color: "bg-green-500",
                        },
                      ].map((item, index) => (
                        <div key={index} className="text-center">
                          <div
                            className={`w-12 h-12 ${item.color} rounded-full flex items-center justify-center text-white font-bold mx-auto mb-2`}
                          >
                            {item.count}
                          </div>
                          <div className="text-sm font-medium">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Status Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ringkasan Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {Array.from(new Set(packageData.map((item) => item[14]).filter(Boolean))).map((status, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                          <Badge className={getStatusColor(status)}>{status}</Badge>
                          <span className="font-medium">
                            {packageData.filter((item) => item[14] === status).length} paket
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Tutup</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
