"use client"

import { useState, useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Eye,
  Trash2,
  MoreHorizontal,
  Search,
  MapPin,
  Calendar,
  User,
  Building2,
  ExternalLink,
  RefreshCw,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
} from "lucide-react"
import { apiService } from "@/services/api-monev-2"
import { formatDate } from "@/lib/utils"
import { useToast } from "@/hooks/useToast"
import type { DateRange } from "react-day-picker"
import type { MonevDetailData } from "@/services/api-monev-2"

interface MonevDetailTableProps {
  dateRange: DateRange | undefined
  onRefresh?: () => void
}

type SortDirection = "asc" | "desc" | "none"
type SortableField = "tanggal" | "gis_id" | "createdby.name" | "nama_vendor" | "luas" | "mekanis" | "chemis"

export function MonevDetailTable({ dateRange, onRefresh }: MonevDetailTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [monevDetailData, setMonevDetailData] = useState<MonevDetailData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()
  
  // Sorting state
  const [sortConfig, setSortConfig] = useState<{
    field: SortableField
    direction: SortDirection
  }>({ field: "tanggal", direction: "desc" })

  // Fetch monitoring detail data
  const fetchMonevDetailData = async () => {
    if (!dateRange) return

    setIsLoading(true)
    setError(null)
    try {
      const data = await apiService.getMonevDetailData({
        start_date: dateRange?.from ? formatDate(dateRange.from) : "2024-05-24",
        end_date: dateRange?.to ? formatDate(dateRange.to) : "2025-06-23",
      })
      setMonevDetailData(data)
    } catch (error) {
      setError(error instanceof Error ? error.message : "Failed to fetch monitoring detail data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMonevDetailData()
  }, [dateRange])

  const handleDelete = async (id: number) => {
    setDeletingId(id)
    try {
      await apiService.deleteMonevDetail({ monev_id: id.toString() })
      toast({
        title: "Success",
        description: "Monitoring data has been deleted successfully",
      })
      fetchMonevDetailData()
      onRefresh?.()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete monitoring data",
        variant: "destructive",
      })
    } finally {
      setDeletingId(null)
    }
  }

  // Handle sorting
  const handleSort = (field: SortableField) => {
    let direction: SortDirection = "asc"
    if (sortConfig.field === field) {
      if (sortConfig.direction === "asc") {
        direction = "desc"
      } else if (sortConfig.direction === "desc") {
        direction = "none"
      }
    }
    setSortConfig({ field, direction })
  }

  // Filter and sort data
// Filter and sort data
const filteredAndSortedData = useMemo(() => {
  // Filter data based on search term
  let filtered = monevDetailData.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      item.gis_id.toLowerCase().includes(searchLower) ||
      item.createdby.name.toLowerCase().includes(searchLower) ||
      item.regional.toLowerCase().includes(searchLower) ||
      (item.jabatan && item.jabatan.toLowerCase().includes(searchLower)) ||
      item.nama_vendor.toLowerCase().includes(searchLower) ||
      (item.kode_unit && item.kode_unit.toLowerCase().includes(searchLower)) ||
      (item.kode_afdeling && item.kode_afdeling.toLowerCase().includes(searchLower)) ||
      (item.kode_blok && item.kode_blok.toLowerCase().includes(searchLower))
    );
  });

  // Apply sorting if direction is not "none"
  if (sortConfig.direction !== "none") {
    filtered = [...filtered].sort((a, b) => {
      let aValue: any, bValue: any

      // Handle nested properties
      if (sortConfig.field === "createdby.name") {
        aValue = a.createdby.name.toLowerCase()
        bValue = b.createdby.name.toLowerCase()
      } else {
        aValue = a[sortConfig.field]
        bValue = b[sortConfig.field]
      }

      // Convert to numbers if sorting numeric fields
      if (["luas", "mekanis", "chemis"].includes(sortConfig.field)) {
        aValue = parseFloat(aValue)
        bValue = parseFloat(bValue)
      }

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1
      }
      return 0
    })
  }

  return filtered
}, [monevDetailData, searchTerm, sortConfig])

  const getJobBadgeColor = (job: string | null | undefined) => {
    const normalizedJob = (job || "").toUpperCase()
    switch (normalizedJob) {
      case "ASISTEN AFDELING":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "ASKEP":
      case "PJ. ASISTEN KEPALA":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "KEPALA KEBUN":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const renderSortIcon = (field: SortableField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
    if (sortConfig.direction === "asc") return <ChevronUp className="h-3 w-3 ml-1" />
    if (sortConfig.direction === "desc") return <ChevronDown className="h-3 w-3 ml-1" />
    return <ArrowUpDown className="h-3 w-3 ml-1 opacity-50" />
  }

  return (
    <Card className="bg-black/20 border-white/10 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detail Data Monitoring
            </CardTitle>
            <CardDescription className="text-gray-300">
              Tabulasi lengkap data monitoring evaluasi - Klik detail untuk analisis mendalam
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchMonevDetailData}
              disabled={isLoading}
              className="bg-white/5 border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Search and Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan GIS ID, nama, regional, jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-300">
            <span>Total: {filteredAndSortedData.length} records</span>
            {sortConfig.direction !== "none" && (
              <span className="text-xs bg-white/10 px-2 py-1 rounded">
                Sorted by: {sortConfig.field} ({sortConfig.direction})
              </span>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="rounded-lg border border-white/10 overflow-hidden">
          <div className="max-h-[600px] overflow-auto">
            <Table>
              <TableHeader className="sticky top-0 bg-slate-800 z-10">
                <TableRow className="border-slate-700 hover:bg-slate-800">
                  <TableHead className="text-slate-300 w-[100px]">
                    <button
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => handleSort("tanggal")}
                    >
                      <Calendar className="h-4 w-4" />
                      Tanggal
                      {renderSortIcon("tanggal")}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <button
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => handleSort("gis_id")}
                    >
                      <MapPin className="h-4 w-4" />
                      Lokasi
                      {renderSortIcon("gis_id")}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <button
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => handleSort("createdby.name")}
                    >
                      <User className="h-4 w-4" />
                      Petugas
                      {renderSortIcon("createdby.name")}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300">
                    <button
                      className="flex items-center gap-2 hover:text-white"
                      onClick={() => handleSort("nama_vendor")}
                    >
                      <Building2 className="h-4 w-4" />
                      Vendor
                      {renderSortIcon("nama_vendor")}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300 text-center">
                    <button
                      className="flex items-center justify-center gap-1 hover:text-white mx-auto"
                      onClick={() => handleSort("luas")}
                    >
                      Luas (Ha)
                      {renderSortIcon("luas")}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300 text-center">
                    <button
                      className="flex items-center justify-center gap-1 hover:text-white mx-auto"
                      onClick={() => handleSort("mekanis")}
                    >
                      Mekanis
                      {renderSortIcon("mekanis")}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300 text-center">
                    <button
                      className="flex items-center justify-center gap-1 hover:text-white mx-auto"
                      onClick={() => handleSort("chemis")}
                    >
                      Chemis
                      {renderSortIcon("chemis")}
                    </button>
                  </TableHead>
                  <TableHead className="text-slate-300 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array.from({ length: 5 }).map((_, index) => (
                    <TableRow key={index} className="border-slate-700">
                      <TableCell colSpan={8} className="text-center py-8">
                        <RefreshCw className="h-6 w-6 animate-spin mx-auto text-gray-400" />
                      </TableCell>
                    </TableRow>
                  ))
                ) : filteredAndSortedData.length > 0 ? (
                  filteredAndSortedData.map((item) => (
                    <TableRow key={item.id} className="border-slate-700 hover:bg-slate-800/50">
                      <TableCell className="text-white">
                        <div className="space-y-1">
                          <div className="font-medium">
                            {new Date(item.tanggal).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(item.created_at).toLocaleTimeString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="space-y-1">
                          <div className="font-medium text-blue-400">{item.gis_id}</div>
                          <div className="text-xs text-gray-400">{item.regional}</div>
                          <div className="text-xs text-gray-500">
                            {item.kode_unit} • {item.kode_afdeling} • {item.kode_blok}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="space-y-2">
                          <div className="font-medium text-white">{item.createdby.name}</div>
                          <div className="text-xs text-gray-400">SAP: {item.createdby.sap}</div>
                          <Badge variant="outline" className={getJobBadgeColor(item.jabatan)}>
                            {item.job}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-300">
                        <div className="space-y-1">
                          <div className="font-medium text-yellow-400">{item.nama_vendor}</div>
                          <div className="text-xs text-gray-400">{item.judul_pekerjaan}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-medium text-emerald-400">{Number.parseFloat(item.luas).toFixed(2)}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-medium text-blue-400">{Number.parseFloat(item.mekanis).toFixed(2)}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-medium text-purple-400">{Number.parseFloat(item.chemis).toFixed(2)}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link to={`/monev-detail/${item.id}`}>
                            <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-300"
                            onClick={() => window.open(item.preview_link, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-gray-300">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-slate-800 border-slate-700">
                              <DropdownMenuItem asChild>
                                <Link to={`/monev-detail/${item.id}`} className="flex items-center gap-2 text-blue-400">
                                  <Eye className="h-4 w-4" />
                                  View Details
                                </Link>
                              </DropdownMenuItem>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem
                                    onSelect={(e) => e.preventDefault()}
                                    className="flex items-center gap-2 text-red-400 focus:text-red-300"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-800 border-slate-700">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">Confirm Deletion</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-300">
                                      Are you sure you want to delete this monitoring record? This action cannot be
                                      undone.
                                      <div className="mt-2 p-2 bg-slate-700 rounded text-sm">
                                        <strong>GIS ID:</strong> {item.gis_id}
                                        <br />
                                        <strong>Date:</strong> {item.tanggal}
                                        <br />
                                        <strong>Created by:</strong> {item.createdby.name}
                                      </div>
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-slate-700 border-slate-600 text-white hover:bg-slate-600">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(item.id)}
                                      disabled={deletingId === item.id}
                                      className="bg-red-600 hover:bg-red-700 text-white"
                                    >
                                      {deletingId === item.id ? (
                                        <>
                                          <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                          Deleting...
                                        </>
                                      ) : (
                                        <>
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </>
                                      )}
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow className="border-slate-700">
                    <TableCell colSpan={8} className="text-center py-8 text-gray-400">
                      <Eye className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Tidak ada data monitoring tersedia</p>
                      <p className="text-sm mt-2">Coba ubah filter atau periode waktu</p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}