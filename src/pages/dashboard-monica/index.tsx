"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import ThemeSwitch from "@/components/theme-switch"
import { UserNav } from "@/components/user-nav"
import { FcDoughnutChart } from "react-icons/fc"
import { TopNav } from "@/components/top-nav"
import { columns } from "./components/columns"
import { columns as colRekap } from "./components/col-rekap"
import { columns as colPekerjaan } from "./components/col-pekerjaan"
import { Loading } from "@/components/ui/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ChevronDown, Filter, TrendingUp, Package, Building, FileText, BarChart3 } from "lucide-react"
import { DataTable } from "./components/data-table"
import { DataTablePekerjaan } from "./components/data-table-pekerjaan"
import BarMonitoring from "./components/bar-monitoring"
import ComponentPTable from "@/components/p-table"

// Mock cookie for demo
const user = { account_type: "superadmin" }
const account_type = user?.account_type || ""

export default function Tasks() {
  // State untuk data utama
  const [countAll, setCountAll] = useState(0)
  const [countZero, setCountZero] = useState(0)
  const [countFourty, setCountFourty] = useState(0)
  const [countSixty, setCountSixty] = useState(0)
  const [countNinety, setCountNinety] = useState(0)
  const [countHundred, setCountHundred] = useState(0)
  const [data, setData] = useState<string[][]>([])
  const [dataRekbesar, setDataRekBesar] = useState<any[]>([])

  type RekapData = {
    sub_investasi: string
    hps: number
    total_tekpol: number
    pengadaan: number
    sppbj: number
  }

  const [dataRekap, setDataRekap] = useState<RekapData[]>([])
  const [progressmasters, setProgressmasters] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State untuk progress counts
  const [p_pks, setP_pks] = useState(0)
  const [p_tekpol, setP_tekpol] = useState(0)
  const [p_hps, setP_hps] = useState(0)
  const [p_pengadaan, setP_pengadaan] = useState(0)
  const [p_sppbj, setP_sppbj] = useState(0)

  // State untuk bar monitoring
  const [pbj, setPbj] = useState<any[]>([])
  const [penyusunanDokumen, setPenyusunanDokumen] = useState<any[]>([])
  const [sppbj, setSppbj] = useState<any[]>([])
  const [hps, setHps] = useState<any[]>([])
  const [reg, setReg] = useState<any[]>([])

  // State untuk filters dan selections
  const [selectedValueRekBesar, setSelectedValueRekBesar] = useState("3. Mesin & Instalasi")
  const [selectedRegional, setSelectedRegional] = useState("")
  const [selectedKomoditas, setSelectedKomoditas] = useState("all")
  const [activeTab, setActiveTab] = useState("keseluruhan")

  // State untuk S-Curve
  const [scurveData, setScurveData] = useState<any[]>([])
  const [scurveLoading, setScurveLoading] = useState(false)
  const [selectedScurveUrl, setSelectedScurveUrl] = useState<string>("")
  const [selectedScurveTitle, setSelectedScurveTitle] = useState<string>("")
  const [showScurveChart, setShowScurveChart] = useState(false)

  // State untuk regional dan links
  const [regionalOptions, setRegionalOptions] = useState<string[]>([])
  const [yangAdaLink, setYangAdaLink] = useState<any[]>([])

  // State untuk Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalData, setModalData] = useState<any[]>([])
  const [modalTitle, setModalTitle] = useState("")
  const [modalDescription, setModalDescription] = useState("")
  const [modalLoading, setModalLoading] = useState(false)

   const convertArrayToModalObject = (dataArray: any[][]) => {
    return dataArray.map((row) => ({
      rpc_code: row[0] || "",
      rekening_besar: row[1] || "",
      komoditi: row[2] || "",
      unit_kerja_lokasi: row[3] || "",
      program_kerja_impact: row[4] || "",
      nama_investasi: row[5] || "",
      status_anggaran: row[6] || "",
      jumlah_total_fisik: row[7] || "",
      satuan_fisik: row[8] || "",
      nilai_anggaran_rkap: row[9] || "",
      status_pelaksanaan: row[10] || "",
      stasiun_pabrik: row[11] || "",
      nomor_paket_pekerjaan: row[12] || "",
      real_penamaan_paket: row[13] || "",
      status_paket_pekerjaan: row[14] || "",
      nilai_kontrak: row[15] || "",
      nomor_kontrak: row[16] || "",
      tanggal_mulai: row[17] || "",
      tanggal_berakhir: row[18] || "",
      progress_fisik: row[19] || "",
      skala_prioritas: row[20] || "",
      keterangan_1: row[21] || "",
      keterangan_2: row[22] || "",
      nilai: row[23] || "",
      reg: row[24] || "",
      kurva_s: row[25] || "",
    }))
  }

  // Manual commodity options
  const komoditasOptions = [
    { value: "all", label: "Semua Komoditas" },
    { value: "Kelapa Sawit", label: "Kelapa Sawit" },
    { value: "Teh", label: "Teh" },
    { value: "Karet", label: "Karet" },
  ]

  // Data mock untuk progress
  const progressData = {
    capexYearly: 73.72,
    capexApril: 144.02,
    totalPackages: 684,
    packagePercentRKAP: 42.7,
    packagePercentTarget: 83.41,
    totalBudget: 395.18,
    budgetPercentRKAP: 42.62,
    budgetPercentTarget: 66.71,
  }

  // Function untuk filter data berdasarkan komoditas dan kategori direktorat
  const getFilteredData = (rawData: any[], komoditas: string, kategori: string) => {
    let filteredData = [...rawData]

    // Filter berdasarkan komoditas
    if (komoditas && komoditas !== "all") {
      filteredData = filteredData.filter((item: any[]) => item[2] === komoditas)
    }

    // Filter berdasarkan kategori direktorat
    if (kategori === "ditn") {
      // DITN: Filter berdasarkan Rekening Besar (column 1)
      const targetRekeningBesar = [
        "Alat Pengangkutan (Transportasi)",
        "Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)",
        "3. Mesin & Instalasi",
      ]
      filteredData = filteredData.filter((item: any[]) => targetRekeningBesar.includes(item[1]))
    } else if (kategori === "dinf") {
      // DINF: Filter berdasarkan Rekening Besar (column 1)
      const targetRekeningBesar = ["Jalan, Jembatan & Saluran Air", "Bangunan Perumahan", "Bangunan Perusahaan"]
      filteredData = filteredData.filter((item: any[]) => targetRekeningBesar.includes(item[1]))
    }

    return filteredData
  }

  // Function untuk membuka modal dengan data yang sesuai
  const handleOpenModal = (progressType: string) => {
    setModalLoading(true)
    setIsModalOpen(true)

    // Get filtered data
    const filteredData = getFilteredData(data, selectedKomoditas, activeTab)
    let modalDataFiltered: any[] = []
    let title = ""
    let description = ""

    // Filter data berdasarkan tipe progress
    switch (progressType) {
      case "pks":
        modalDataFiltered = filteredData.filter(
          (item: any[]) => item[14] === "Belum Diajukan" || item[14] === "Pembuatan Purchase Requisition (PR) SA",
        )
        title = "Progress di Unit"
        description = "Daftar paket pekerjaan yang sedang dalam proses di tingkat unit"
        break
      case "tekpol":
        modalDataFiltered = filteredData.filter(
          (item: any[]) => item[14] === "Persetujuan Anggaran" || item[14] === "Pembuatan Paket Pekerjaan (PK) IPS",
        )
        title = "Progress di Tekpol"
        description = "Daftar paket pekerjaan yang sedang dalam proses di tekpol"
        break
      case "hps":
        modalDataFiltered = filteredData.filter((item: any[]) => item[14] === "Penetapan HPS")
        title = "Progress di HPS"
        description = "Daftar paket pekerjaan yang sedang dalam tahap penetapan HPS"
        break
      case "pengadaan":
        modalDataFiltered = filteredData.filter((item: any[]) => item[14] === "Proses Pengadaan")
        title = "Progress di Pengadaan"
        description = "Daftar paket pekerjaan yang sedang dalam proses pengadaan"
        break
      case "sppbj":
        modalDataFiltered = filteredData.filter(
          (item: any[]) =>
            item[14] === "Proses Pengerjaan (sudah Terbit Kontrak)" || item[14] === "Pekerjaan Selesai 100%",
        )
        title = "Terbit SPPBJ"
        description = "Daftar paket pekerjaan yang sudah terbit SPPBJ"
        break
      default:
        modalDataFiltered = filteredData
        title = "Semua Data"
        description = "Daftar semua paket pekerjaan"
    }
    // Convert array data to objects before setting modal data
    const convertedModalData = convertArrayToModalObject(modalDataFiltered)
    setModalData(convertedModalData)

    setModalTitle(title)
    setModalDescription(description)
    setModalLoading(false)
  }

  // Enhanced handleClick untuk tabs dengan filtering yang lebih baik
  const handleClickProgress = (progress: string) => {
    setActiveTab(progress)
    // Get filtered data
    const filteredData = getFilteredData(data, selectedKomoditas, progress)
    // Update progress counts dengan data yang sudah difilter
    updateProgressCountsDirectly(filteredData)
    // Update rekap data berdasarkan filter
    updateRekapData(filteredData, progress)
  }

  // Enhanced komoditas selection handler
  const handleKomoditasChange = (value: string) => {
    setSelectedKomoditas(value)
    // Get filtered data dengan komoditas baru
    const filteredData = getFilteredData(data, value, activeTab)
    // Update progress counts
    updateProgressCountsDirectly(filteredData)
    // Update rekap data
    updateRekapData(filteredData, activeTab)
  }

  // Function untuk update rekap data berdasarkan filter
  const updateRekapData = (filteredData: any[], kategori: string) => {
    // Group data by sub_investasi (rekening besar)
    const groupedData: { [key: string]: any } = {}

    filteredData.forEach((item: any[]) => {
      const subInvestasi = item[1] // Rekening Besar
      const status = item[14] // Status Paket Pekerjaan

      if (!groupedData[subInvestasi]) {
        groupedData[subInvestasi] = {
          sub_investasi: subInvestasi,
          hps: 0,
          total_tekpol: 0,
          pengadaan: 0,
          sppbj: 0,
        }
      }

      // Count berdasarkan status
      if (status === "Belum Diajukan" || status === "Pembuatan Purchase Requisition (PR) SA") {
        // Unit level - tidak dihitung di rekap
      } else if (status === "Persetujuan Anggaran" || status === "Pembuatan Paket Pekerjaan (PK) IPS") {
        groupedData[subInvestasi].total_tekpol++
      } else if (status === "Penetapan HPS") {
        groupedData[subInvestasi].hps++
      } else if (status === "Proses Pengadaan") {
        groupedData[subInvestasi].pengadaan++
      } else if (status === "Proses Pengerjaan (sudah Terbit Kontrak)" || status === "Pekerjaan Selesai 100%") {
        groupedData[subInvestasi].sppbj++
      }
    })

    // Convert to array dan filter berdasarkan kategori jika perlu
    let rekapArray = Object.values(groupedData)

    if (kategori === "ditn") {
      const ditnCategories = [
        "Alat Pengangkutan (Transportasi)",
        "Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)",
        "3. Mesin & Instalasi",
      ]
      rekapArray = rekapArray.filter((item: any) => ditnCategories.includes(item.sub_investasi))
    } else if (kategori === "dinf") {
      const dinfCategories = ["Jalan, Jembatan & Saluran Air", "Bangunan Perumahan", "Bangunan Perusahaan"]
      rekapArray = rekapArray.filter((item: any) => dinfCategories.includes(item.sub_investasi))
    } else if (kategori === "keseluruhan") {
      const ditnCategories = [
        "Alat Pengangkutan (Transportasi)",
        "Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)",
        "3. Mesin & Instalasi",
      ]
      const dinfCategories = ["Jalan, Jembatan & Saluran Air", "Bangunan Perumahan", "Bangunan Perusahaan"]
      rekapArray = rekapArray.filter(
        (item: any) => ditnCategories.includes(item.sub_investasi) || dinfCategories.includes(item.sub_investasi),
      )
    }

    // Jika tidak ada data, buat default dengan nilai 0
    if (rekapArray.length === 0) {
      const defaultCategories =
        kategori === "ditn"
          ? [
              "Alat Pengangkutan (Transportasi)",
              "Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)",
              "3. Mesin & Instalasi",
            ]
          : kategori === "dinf"
            ? ["Jalan, Jembatan & Saluran Air", "Bangunan Perumahan", "Bangunan Perusahaan"]
            : ["3. Mesin & Instalasi", "Bangunan Perumahan", "Alat Pengangkutan (Transportasi)"]

      rekapArray = defaultCategories.map((cat) => ({
        sub_investasi: cat,
        hps: 0,
        total_tekpol: 0,
        pengadaan: 0,
        sppbj: 0,
      }))
    }

    setDataRekap(rekapArray)
    console.log("Rekap Data Updated:", rekapArray)
  }

  // Function untuk update progress counts langsung dari data yang sudah difilter
  const updateProgressCountsDirectly = (filteredData: any[]) => {
    let totalUnit = 0
    let totalTekpol = 0
    let totalPengadaan = 0
    let totalTerbitSPPBJ = 0
    let totalHPS = 0
    let countZero = 0
    let countFourty = 0
    let countSixty = 0
    let countNinety = 0
    let countHundred = 0

    const dataSppbj: any[] = []
    const dataHps: any[] = []
    const dataUnit: any[] = []
    const dataTekpol: any[] = []
    const dataPengadaan: any[] = []
    let dataPbj: any[] = []
    let dataPenyusunanDokumen: any[] = []
    const dataReg: any[] = []

    filteredData.forEach((item: any[]) => {
      if (item[24] !== undefined && !dataReg.includes(item[24])) {
        dataReg.push(item[24])
      }

      if (item[14] === "Penetapan HPS") {
        dataHps.push(item)
      } else if (item[14] === "Proses Pengerjaan (sudah Terbit Kontrak)" || item[14] === "Pekerjaan Selesai 100%") {
        dataSppbj.push(item)
      } else if (item[14] === "Belum Diajukan" || item[14] === "Pembuatan Purchase Requisition (PR) SA") {
        dataUnit.push(item)
      } else if (item[14] === "Persetujuan Anggaran" || item[14] === "Pembuatan Paket Pekerjaan (PK) IPS") {
        dataTekpol.push(item)
      } else if (item[14] === "Proses Pengadaan") {
        dataPengadaan.push(item)
      }
    })

    dataPbj = [...dataPengadaan]
    dataPenyusunanDokumen = [...dataUnit, ...dataTekpol]

    filteredData.forEach((item: any[]) => {
      const status = item[14] // Status Paket Pekerjaan
      const progressStr = item[19] // Progress Fisik (%)
      const progress = progressStr ? Number.parseInt(progressStr.toString().replace("%", "")) || 0 : 0

      // Kategorisasi berdasarkan status (column 14)
      if (status === "Belum Diajukan" || status === "Pembuatan Purchase Requisition (PR) SA") {
        totalUnit++
      } else if (status === "Persetujuan Anggaran" || status === "Pembuatan Paket Pekerjaan (PK) IPS") {
        totalTekpol++
      } else if (status === "Penetapan HPS") {
        totalHPS++
      } else if (status === "Proses Pengadaan") {
        totalPengadaan++
      } else if (status === "Proses Pengerjaan (sudah Terbit Kontrak)" || status === "Pekerjaan Selesai 100%") {
        totalTerbitSPPBJ++
      }

      // Kategorisasi berdasarkan progress (column 19)
      if (progress === 0) countZero++
      else if (progress <= 40) countFourty++
      else if (progress <= 60) countSixty++
      else if (progress <= 99) countNinety++
      else if (progress === 100) countHundred++
    })

    setP_pks(totalUnit)
    setP_tekpol(totalTekpol)
    setP_pengadaan(totalPengadaan)
    setP_sppbj(totalTerbitSPPBJ)
    setP_hps(totalHPS)
    setCountZero(countZero)
    setCountFourty(countFourty)
    setCountSixty(countSixty)
    setCountNinety(countNinety)
    setCountHundred(countHundred)
    setPbj(dataPbj)
    setPenyusunanDokumen(dataPenyusunanDokumen)
    setSppbj(dataSppbj)
    setHps(dataHps)
    setReg(dataReg)
  }

  // Fetch functions
  const fetchAllProgress = async () => {
    setLoading(true)
    try {
      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSt5Slr9Cq2F8vMAe_qn75Wybt_oJgvkN5_JL-wL6JMSLXist0U3DTt14syyHiMUzq1WWUAqe-u6PC5/pub?gid=693153178&single=true&output=csv",
      )
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }
      const csv = await response.text()
      // Manual CSV parsing since Papa Parse is causing issues
      const lines = csv.split("\n")
      const result = lines.map((line) => {
        // Simple CSV parsing - handles basic cases
        const values = []
        let current = ""
        let inQuotes = false
        for (let i = 0; i < line.length; i++) {
          const char = line[i]
          if (char === '"') {
            inQuotes = !inQuotes
          } else if (char === "," && !inQuotes) {
            values.push(current.trim())
            current = ""
          } else {
            current += char
          }
        }
        // Add the last value
        if (current) {
          values.push(current.trim())
        }
        return values
      })

      const filteredData = result.slice(11) // Skip header rows
      setData(filteredData)

      // Initial calculation dengan filter default
      const initialFilteredData = getFilteredData(filteredData, selectedKomoditas, activeTab)
      updateProgressCountsDirectly(initialFilteredData)
      updateRekapData(initialFilteredData, activeTab)
      setLoading(false)
    } catch (error: any) {
      console.error("Failed to fetch progress:", error.message)
      setError(error.message)
      setLoading(false)
    }
  }

  const fetchAllRekap = async () => {
    // Mock rekap data dengan default 0
    const mockRekapData = [
      {
        sub_investasi: "3. Mesin & Instalasi",
        hps: 0,
        total_tekpol: 0,
        pengadaan: 0,
        sppbj: 0,
      },
      {
        sub_investasi: "Bangunan Perumahan",
        hps: 0,
        total_tekpol: 0,
        pengadaan: 0,
        sppbj: 0,
      },
      {
        sub_investasi: "Alat Pengangkutan (Transportasi)",
        hps: 0,
        total_tekpol: 0,
        pengadaan: 0,
        sppbj: 0,
      },
    ]
    setDataRekap(mockRekapData)
    console.log("Mock Rekap Data:", mockRekapData)
  }

  const getAllRecordsperRPCRekeningBesar = async (rekBesar: string) => {
    setLoading(true)
    try {
      // Filter data berdasarkan rekening besar dan filter aktif
      const filteredByRekBesar = data.filter((item: any[]) => item[1] === rekBesar)
      const finalFilteredData = getFilteredData(filteredByRekBesar, selectedKomoditas, activeTab)
      setDataRekBesar(finalFilteredData)
      setLoading(false)
    } catch (error: any) {
      console.error("Failed to fetch records:", error.message)
      setError(error.message)
      setLoading(false)
    }
  }

  const handleChange = (value: string) => {
    setSelectedValueRekBesar(value)
    getAllRecordsperRPCRekeningBesar(value)
  }

  const fetchScurveData = async (link: string, title?: string) => {
    setSelectedScurveUrl(link)
    setSelectedScurveTitle(title || "S-Curve Progress")
    setShowScurveChart(true)
  }

  // useEffect hooks
  useEffect(() => {
    fetchAllRekap()
    fetchAllProgress()
  }, [])

  useEffect(() => {
    if (selectedValueRekBesar && data.length > 0) {
      getAllRecordsperRPCRekeningBesar(selectedValueRekBesar)
    }
  }, [selectedValueRekBesar, data, selectedKomoditas, activeTab])

  useEffect(() => {
    if (data.length > 0) {
      // Ketika data berubah, re-apply filter yang aktif
      const filteredData = getFilteredData(data, selectedKomoditas, activeTab)
      updateProgressCountsDirectly(filteredData)
      updateRekapData(filteredData, activeTab)
    }
  }, [data, selectedKomoditas, activeTab])

  // Filter data yang ada link berdasarkan regional yang dipilih
  const filteredYangAdaLink = yangAdaLink.filter((item) => item.regional === selectedRegional && item.links !== "#REF!")

  // Columns untuk tabel S-Curve
  const scColumns = [
    {
      accessorKey: "kdSinusa",
      header: "Kode Sinusa",
    },
    {
      accessorKey: "namaInvestasiSinusa",
      header: "Nama Investasi",
    },
    {
      accessorKey: "kodeSIps",
      header: "Kode IPS",
    },
    {
      accessorKey: "nmSIps",
      header: "Nama Pekerjaan IPS",
    },
    {
      accessorKey: "links",
      header: "Link S-Curve",
      cell: ({ row }: any) => (
        <Button
          variant="outline"
          onClick={() =>
            fetchScurveData(row.original.links, `${row.original.namaInvestasiSinusa} - ${row.original.nmSIps}`)
          }
        >
          Lihat S-Curve
        </Button>
      ),
    },
  ]

  return (
    <Layout>
      {/* Header */}
      <Layout.Header sticky>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        {/* Main Header dengan animasi */}
        <div className="mb-6 flex w-full items-center justify-between rounded-xl bg-gradient-to-r from-blue-600 via-green-600 to-sky-600 p-6 shadow-2xl transition-all duration-300 hover:shadow-3xl">
          <div className="flex items-center space-x-4">
            <div className="rounded-full bg-white/20 p-3">
              <FcDoughnutChart size={48} className="animate-spin-slow" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard Monica</h1>
              <p className="text-blue-100 mt-1">Monitoring Progress Investasi Off Farm</p>
            </div>
          </div>
          <div className="flex space-x-2"></div>
        </div>

        {/* Enhanced Filter Section */}
        <Card className="mb-6 border-1 border-dashed border-gray-700 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Kontrol Data
            </CardTitle>
            <CardDescription>Pilih komoditas dan kategori untuk melihat data yang spesifik</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              {/* Komoditas Selector */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Pilih Komoditas:</label>
                <Select value={selectedKomoditas} onValueChange={handleKomoditasChange}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Pilih Komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {komoditasOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Tab Buttons untuk DITN/DINF */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Kategori Direktorat:</label>
                <div className="flex space-x-2">
                  <Button
                    variant={activeTab === "keseluruhan" ? "default" : "outline"}
                    onClick={() => handleClickProgress("keseluruhan")}
                    className="flex items-center gap-2"
                  >
                    <TrendingUp className="h-4 w-4" />
                    Keseluruhan
                  </Button>
                  <Button
                    variant={activeTab === "ditn" ? "default" : "outline"}
                    onClick={() => handleClickProgress("ditn")}
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    DITN
                  </Button>
                  <Button
                    variant={activeTab === "dinf" ? "default" : "outline"}
                    onClick={() => handleClickProgress("dinf")}
                    className="flex items-center gap-2"
                  >
                    <Building className="h-4 w-4" />
                    DINF
                  </Button>
                </div>
              </div>

              {/* Active Filter Display */}
              <div className="flex flex-col space-y-2">
                <label className="text-sm font-medium">Filter Aktif:</label>
                <div className="flex flex-wrap gap-2">
                  {selectedKomoditas && selectedKomoditas !== "all" && (
                    <Badge variant="secondary" className="flex items-center gap-1">
                      Komoditas: {komoditasOptions.find((opt) => opt.value === selectedKomoditas)?.label}
                      <button
                        onClick={() => handleKomoditasChange("all")}
                        className="ml-1 hover:bg-gray-200 rounded-full p-1"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  <Badge variant={activeTab === "keseluruhan" ? "default" : "outline"}>
                    {activeTab === "keseluruhan"
                      ? "Semua Data"
                      : activeTab === "ditn"
                        ? "DITN (Teknik)"
                        : "DINF (Infrastruktur)"}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Progress Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[
            {
              key: "pks",
              title: "PROGRESS DI UNIT",
              value: p_pks,
              icon: "/pks.png",
              color: "from-green-500 to-emerald-600",
              description: "Paket di tingkat unit",
            },
            {
              key: "tekpol",
              title: "PROGRESS DI TEKPOL",
              value: p_tekpol,
              icon: "/tekpol.png",
              color: "from-blue-500 to-cyan-600",
              description: "Paket di tekpol",
            },
            {
              key: "hps",
              title: "PROGRESS DI HPS",
              value: p_hps,
              icon: "/hps.png",
              color: "from-purple-500 to-violet-600",
              description: "Paket penetapan HPS",
            },
            {
              key: "pengadaan",
              title: "PROGRESS DI PENGADAAN",
              value: p_pengadaan,
              icon: "/pengadaan.png",
              color: "from-orange-500 to-red-600",
              description: "Paket dalam pengadaan",
            },
            {
              key: "sppbj",
              title: "TERBIT SPPBJ",
              value: p_sppbj,
              icon: "/sppbj.png",
              color: "from-indigo-500 to-purple-600",
              description: "Paket sudah terbit SPPBJ",
            },
          ].map((item) => (
            <Card
              key={item.key}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0"
              onClick={() => handleOpenModal(item.key)}
            >
              <CardContent className={`p-6 bg-gradient-to-br ${item.color} text-white rounded-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold mb-2 leading-tight">{item.title}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{item.value.toLocaleString()}</span>
                      <span className="text-sm opacity-90">PAKET</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <img src={item.icon || "/placeholder.svg"} alt={item.key} className="w-10 h-10" />
                  </div>
                </div>
                <p className="text-xs opacity-90 mb-2">{item.description}</p>
                <div className="flex items-center justify-end">
                  <span className="text-xs font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                    LIHAT DETAIL →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress Percentage Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {[
            { title: "PROGRESS 0%", value: countZero, color: "from-gray-500 to-gray-600" },
            { title: "PROGRESS 1% - 40%", value: countFourty, color: "from-red-500 to-pink-600" },
            { title: "PROGRESS 41% - 60%", value: countSixty, color: "from-yellow-500 to-orange-600" },
            { title: "PROGRESS 61% - 99%", value: countNinety, color: "from-blue-500 to-indigo-600" },
            { title: "PROGRESS 100%", value: countHundred, color: "from-green-500 to-emerald-600" },
          ].map((item, index) => (
            <Card
              key={index}
              className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0"
            >
              <CardContent className={`p-6 bg-gradient-to-br ${item.color} text-white rounded-lg`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold mb-2 leading-tight">{item.title}</h4>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold">{item.value.toLocaleString()}</span>
                      <span className="text-sm opacity-90">PAKET</span>
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                </div>
                <div className="flex items-center justify-end">
                  <span className="text-xs font-semibold opacity-90 group-hover:opacity-100 transition-opacity">
                    LIHAT DETAIL →
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modal untuk Detail Progress */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-7xl max-h-[100vh] max-w-100 overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <DialogTitle className="text-xl font-bold">{modalTitle}</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground mt-1">
                      {modalDescription}
                    </DialogDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    {modalData.length} Paket
                  </Badge>
                </div>
              </div>
            </DialogHeader>

            <div className="flex-1 overflow-hidden">
              {modalLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loading />
                </div>
              ) : modalData.length > 0 ? (
                <div className=" overflow-auto">
                  <DataTable data={modalData} columns={columns} />
                </div>
              ) : (
                <div className="flex h-64 items-center justify-center">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">Tidak ada data untuk ditampilkan</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex-shrink-0 flex justify-end pt-4 border-t">
              <Button onClick={() => setIsModalOpen(false)} variant="outline">
                Tutup
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Detail Progress Master */}
        {progressmasters !== "" && (
          <Card className="mb-6">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6" />
                  Progress Pekerjaan Di {progressmasters.toUpperCase()}
                </CardTitle>
                <Button onClick={() => setProgressmasters("")}>Kembali</Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loading />
                </div>
              ) : error ? (
                <p className="text-red-500">Error: {error}</p>
              ) : (
                <DataTable data={getFilteredData(data, selectedKomoditas, activeTab)} columns={columns} />
              )}
            </CardContent>
          </Card>
        )}

        {/* Bar Monitoring */}
        <ComponentPTable />
        <br />
        <BarMonitoring pbj={pbj} penyusunanDokumen={penyusunanDokumen} sppbj={sppbj} hps={hps} reg={reg} />

        {/* Main Tabs */}
        {progressmasters === "" && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 mt-4">
            <div className="w-full overflow-x-auto">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="keseluruhan" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Keseluruhan
                </TabsTrigger>
                <TabsTrigger value="paketPekerjaan" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Paket Pekerjaan
                </TabsTrigger>
                <TabsTrigger value="s-curve" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  S-Curve
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="keseluruhan" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-6 w-6" />
                    Rekapitulasi Progress Pekerjaan Investasi
                  </CardTitle>
                  <CardDescription>
                    Data keseluruhan progress investasi berdasarkan kategori yang dipilih
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex h-64 items-center justify-center">
                      <Loading />
                    </div>
                  ) : error ? (
                    <p className="text-red-500">Error: {error}</p>
                  ) : (
                    <DataTable data={dataRekap} columns={colRekap} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="paketPekerjaan" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-6 w-6" />
                        Rekapitulasi Progress Paket Pekerjaan
                      </CardTitle>
                      <CardDescription>
                        Detail paket pekerjaan berdasarkan rekening besar: {selectedValueRekBesar}
                      </CardDescription>
                    </div>
                    <Select value={selectedValueRekBesar} onValueChange={handleChange}>
                      <SelectTrigger className="w-[400px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="3. Mesin & Instalasi">Mesin & Instalasi</SelectItem>
                          <SelectItem value="Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)">
                            Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)
                          </SelectItem>
                          <SelectItem value="Bangunan Perumahan">Bangunan Perumahan</SelectItem>
                          <SelectItem value="Bangunan Perusahaan">Bangunan Perusahaan</SelectItem>
                          <SelectItem value="Jalan, Jembatan & Saluran Air">Jalan, Jembatan & Saluran Air</SelectItem>
                          <SelectItem value="Alat Pengangkutan (Transportasi)">
                            Alat Pengangkutan (Transportasi)
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex h-64 items-center justify-center">
                      <Loading />
                    </div>
                  ) : error ? (
                    <p className="text-red-500">Error: {error}</p>
                  ) : (
                    <DataTablePekerjaan
                      sub_investasi={selectedValueRekBesar}
                      data={dataRekbesar}
                      columns={colPekerjaan}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="s-curve" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-6 w-6" />
                    S-Curve Progress Pekerjaan Investasi
                  </CardTitle>
                  <CardDescription>Visualisasi kurva S untuk monitoring progress pekerjaan</CardDescription>
                </CardHeader>
                <CardContent>
                  {!showScurveChart ? (
                    <>
                      <div className="mb-4">
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-[200px] justify-between bg-transparent">
                              {selectedRegional || "Pilih Regional"}
                              <ChevronDown className="ml-2 h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-48">
                            <Command>
                              <CommandInput placeholder="Cari regional..." />
                              <CommandList>
                                <CommandEmpty>Regional tidak ditemukan</CommandEmpty>
                                <CommandGroup>
                                  {["Regional 1", "Regional 2", "Regional 3"].map((option) => (
                                    <CommandItem key={option} onSelect={() => setSelectedRegional(option)}>
                                      {option}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      {selectedRegional && (
                        <div className="mt-4">
                          <h3 className="text-xl font-semibold mb-4">
                            Daftar Pekerjaan dengan S-Curve - {selectedRegional}
                          </h3>
                          {loading ? <Loading /> : <DataTable columns={scColumns} data={filteredYangAdaLink} />}
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{selectedScurveTitle}</h3>
                        <Button onClick={() => setShowScurveChart(false)}>Tutup S-Curve</Button>
                      </div>
                      {/* SCurveComponent would be rendered here */}
                      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                        <p className="text-gray-500">S-Curve Chart akan ditampilkan di sini</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </Layout.Body>
    </Layout>
  )
}

// Navigation configurations
let topNav: { title: string; href: string; isActive: boolean }[] = []

if (account_type === "superadmin") {
  topNav = [
    {
      title: "Nursery",
      href: "/dashboard-nursery",
      isActive: false,
    },
    {
      title: "Replanting (TU/TK/TB)",
      href: "/dashboard-replanting",
      isActive: false,
    },
    {
      title: "Immature",
      href: "/dashboard-immature",
      isActive: false,
    },
    {
      title: "Monica",
      href: "/dashboard-monica",
      isActive: true,
    },

    {
      title: "Monev TU by KKMV",
      href: "/dashboard-monev",
      isActive: false,
    },
        {
      title: "Replanting Area",
      href: "/dashboard-inspire",
      isActive: false,
    },
  ]
} else {
  topNav = []
}

const topNavNew = [
  {
    title: "Investasi Awal (SINUSA)",
    href: "/investasi-awal",
    isActive: false,
  },
  {
    title: "Sumber IPS",
    href: "/sumber-ips",
    isActive: false,
  },
  {
    title: "Progress Lap. Investasi",
    href: "/progress-investasi",
    isActive: false,
  },
]
