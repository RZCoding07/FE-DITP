import { useEffect, useState } from "react"
import axios from "axios"
import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import ThemeSwitch from "@/components/theme-switch"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, ArrowBigRight, CalendarIcon, Check, ChevronsUpDown } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format, subYears } from "date-fns"
import { id } from "date-fns/locale"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapComponent } from "@/components/map-component"
import { TopNav } from "@/components/top-nav"
import { Link } from "react-router-dom"
import { DashboardIcon } from "@radix-ui/react-icons"
import { IconEye } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

interface KebunData {
  Kebun: string
  Longitude: number
  Latitude: number
  Kodering: string
}

interface FormattedData {
  kodering: string
  name: string
  lon: number
  lat: number
  is_blok_tu?: string | number
  kode_regional?: string
  jumlah_blok_tu?: number
  luas_blok_tu?: number
  nama_unit?: string
  kode_unit?: string
  regional?: string
}

interface Regional {
  kode_regional: string
  regional: string
}

interface Kebun {
  kode_unit: string
  nama_unit: string
  kode_regional: string
  is_blok_tu: string | number
  luas_blok_tu: number
  jumlah_blok_tu: number
}

interface Afdeling {
  kode_afdeling: string
  kode_unit: string
  nama_unit: string
}

export default function DashboardMonev() {
  const [mapData, setMapData] = useState<FormattedData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [fromDate, setFromDate] = useState<Date>(subYears(new Date(), 1))
  const [toDate, setToDate] = useState<Date>(new Date())
  const [regionals, setRegionals] = useState<Regional[]>([])
  const [selectedRegional, setSelectedRegional] = useState<Regional | null>(null)
  const [kebuns, setKebuns] = useState<Kebun[]>([])
  const [selectedKebun, setSelectedKebun] = useState<Kebun | null>(null)
  const [afdelings, setAfdelings] = useState<Afdeling[]>([])
  const [selectedAfdeling, setSelectedAfdeling] = useState<Afdeling | null>(null)
  const [loadingFilters, setLoadingFilters] = useState(false)
  const [selectedMapKebun, setSelectedMapKebun] = useState<FormattedData | null>(null)
  const [showKebunInfo, setShowKebunInfo] = useState(false)

  const apiUrl = import.meta.env.VITE_API_REPLANTING

  const regOpt: Regional[] = [
    {
      "kode_regional": "1",
      "regional": "PalmCo Regional I"
    },
    {
      "kode_regional": "2",
      "regional": "PalmCo Regional II"
    },
    {
      "kode_regional": "3",
      "regional": "PalmCo Regional III"
    },
    {
      "kode_regional": "4",
      "regional": "PalmCo Regional IV"
    },
    {
      "kode_regional": "5",
      "regional": "PalmCo Regional V"
    },
    {
      "kode_regional": "6",
      "regional": "PalmCo Regional VI"
    },
    {
      "kode_regional": "7",
      "regional": "PalmCo Regional VII"
    },
    {
      "kode_regional": "8",
      "regional": "KSO Sulawesi"
    },
    {
      "kode_regional": "9",
      "regional": "KSO Meranti"
    },
    {
      "kode_regional": "J",
      "regional": "KSO DATIM"
    },
    {
      "kode_regional": "K",
      "regional": "KSO DJABA"
    },
    {
      "kode_regional": "M",
      "regional": "KSO Ex N2"
    }
  ];

  useEffect(() => {
    const fetchKebuns = async () => {
      if (!selectedRegional) {
        setKebuns([])
        setSelectedKebun(null)
        return
      }

      setLoadingFilters(true)
      try {
        const response = await axios.post(`${apiUrl}/api/d-monev-kebun`, {
          dari_tanggal: format(fromDate, "yyyy-MM-dd"),
          sampai_tanggal: format(toDate, "yyyy-MM-dd"),
          region: selectedRegional.kode_regional,
        })

        if (response.data) {
          const kebunData: Kebun[] = response.data || []
          setKebuns(kebunData)
          setSelectedKebun(null)
          setAfdelings([])
          setSelectedAfdeling(null)

          const formattedData: FormattedData[] = kebunData.map((item: Kebun) => ({
            kodering: item.kode_unit || "",
            name: item.nama_unit,
            lon: cKebun.find((kebun: KebunData) => kebun.Kodering === item.kode_unit)?.Longitude || 0,
            lat: cKebun.find((kebun: KebunData) => kebun.Kodering === item.kode_unit)?.Latitude || 0,
            is_blok_tu: item.is_blok_tu,
            kode_regional: item.kode_regional,
            jumlah_blok_tu: item.jumlah_blok_tu,
            luas_blok_tu: item.luas_blok_tu,
            nama_unit: item.nama_unit,
            kode_unit: item.kode_unit
          })).filter((item: FormattedData) => item.is_blok_tu === '1' || item.is_blok_tu === 1)

          setMapData(formattedData)
        } else {
          throw new Error("Invalid data format received from API")
        }
      } catch (err) {
        console.error("Error fetching kebun data:", err)
        setError(
          err instanceof Error
            ? `Failed to load kebun data: ${err.message}`
            : "Failed to load kebun data. Please check your network connection.",
        )
      } finally {
        setLoadingFilters(false)
      }
    }

    fetchKebuns()
  }, [apiUrl, selectedRegional, fromDate, toDate])

  useEffect(() => {
    const fetchAfdelings = async () => {
      if (!selectedRegional || !selectedKebun) {
        setAfdelings([])
        setSelectedAfdeling(null)
        return
      }

      setLoadingFilters(true)
      try {
        const response = await axios.post(`${apiUrl}/api/d-monev-afd`, {
          dari_tanggal: format(fromDate, "yyyy-MM-dd"),
          sampai_tanggal: format(toDate, "yyyy-MM-dd"),
          regional: selectedRegional.kode_regional,
          kode_unit: selectedKebun.kode_unit,
        })

        if (response.data) {
          setAfdelings(response.data || [])
          setSelectedAfdeling(null)
        } else {
          throw new Error("Invalid data format received from API")
        }
      } catch (err) {
        console.error("Error fetching afdeling data:", err)
        setError(
          err instanceof Error
            ? `Failed to load afdeling data: ${err.message}`
            : "Failed to load afdeling data. Please check your network connection.",
        )
      } finally {
        setLoadingFilters(false)
      }
    }

    fetchAfdelings()
  }, [apiUrl, selectedRegional, selectedKebun, fromDate, toDate])

  const [cKebun, setCKebun] = useState<KebunData[]>([])

  useEffect(() => {
    const fetchKebunKoordinat = async () => {
      if (!apiUrl) {
        setError("API URL is not configured. Please check your environment variables.")
        setLoading(false)
        return
      }

      try {
        const response = await axios.get<KebunData[]>(`${apiUrl}/koordinat-kebun`)

        if (!response.data || !Array.isArray(response.data)) {
          throw new Error("Invalid data format received from API")
        }

        setCKebun(response.data)

        const regionalPromises = regOpt.map(async (regional) => {
          try {
            const kebunResponse = await axios.post(`${apiUrl}/api/d-monev-kebun`, {
              dari_tanggal: format(fromDate, "yyyy-MM-dd"),
              sampai_tanggal: format(toDate, "yyyy-MM-dd"),
              region: regional.kode_regional,
            })

            if (kebunResponse.data) {
              const kebunData: Kebun[] = kebunResponse.data || []
              return kebunData.map((item: Kebun) => ({
                kodering: item.kode_unit || "",
                name: item.nama_unit,
                lon: response.data.find((kebun: KebunData) => kebun.Kodering === item.kode_unit)?.Longitude || 0,
                lat: response.data.find((kebun: KebunData) => kebun.Kodering === item.kode_unit)?.Latitude || 0,
                is_blok_tu: item.is_blok_tu,
                kode_regional: item.kode_regional,
                jumlah_blok_tu: item.jumlah_blok_tu,
                luas_blok_tu: item.luas_blok_tu,
                nama_unit: item.nama_unit,
                kode_unit: item.kode_unit,
                regional: regional.regional
              })).filter((item: FormattedData) => item.is_blok_tu === '1' || item.is_blok_tu === 1)
            }
            return []
          } catch (err) {
            console.error(`Error fetching kebun data for regional ${regional.kode_regional}:`, err)
            return []
          }
        })

        const allRegionalData = await Promise.all(regionalPromises)
        const combinedData: FormattedData[] = allRegionalData.flat()

        console.log("Combined map data:", combinedData)

        setMapData(combinedData)
        setLoading(false)
      } catch (err) {
        console.error("Error fetching kebun data:", err)
        setError(
          err instanceof Error
            ? `Failed to load map data: ${err.message}`
            : "Failed to load map data. Please check your network connection.",
        )
        setLoading(false)
      }
    }

    fetchKebunKoordinat()
  }, [apiUrl, fromDate, toDate])

  const handleMarkerClick = (kodering: string) => {
    const kebun = mapData.find((item) => item.kodering === kodering)
    if (kebun) {
      console.log("Marker clicked:", kodering, kebun)
      setSelectedMapKebun(kebun)
      setShowKebunInfo(true)
    } else {
      console.log("Marker clicked but kebun not found:", kodering)
    }
  }


  return (
    <Layout>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="flex-1 ">
          <Layout.Header sticky className="top-0 z-20 w-full bg-white dark:bg-slate-950 backdrop-blur-sm border-b dark:border-slate-950/20 border-white/20 shadow-lg">
            <TopNav links={topNav} />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <ThemeSwitch />
              <UserNav />
            </div>
          </Layout.Header>
          {error ? (
            <Alert variant="destructive" className="m-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : loading ? (
            <div className="gap-4 p-6 h-100">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="w-full h-full rounded-lg" />
            </div>
          ) : (
            <MapComponent
              locations={mapData}
              onMarkerClick={handleMarkerClick}
            >
              <div className="h-full w-full relative">
                <Card className="dark:bg-slate-950/70 backdrop-blur-sm border dark:border-slate-950/20 border-white/20 shadow-lg mt-20">
                  <CardContent className="p-4 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 space-y-2 items-center ">
                      <div className="space-y-1 mt-2">
                        <label className="text-xs font-medium">Dari Tanggal</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              size="sm"
                              className={cn("w-full justify-start text-left font-normal", !fromDate && "text-muted-foreground")}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {fromDate ? format(fromDate, "PP", { locale: id }) : <span>Pilih</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={fromDate}
                              onSelect={(date) => date && setFromDate(date)}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium">Sampai Tanggal</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant={"outline"}
                              size="sm"
                              className={cn("w-full justify-start text-left font-normal", !toDate && "text-muted-foreground")}
                            >
                              <CalendarIcon className="mr-2 h-3 w-3" />
                              {toDate ? format(toDate, "PP", { locale: id }) : <span>Pilih</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar mode="single" selected={toDate} onSelect={(date) => date && setToDate(date)} initialFocus />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium">Regional</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              role="combobox"
                              className={cn("w-full justify-between", !selectedRegional && "text-muted-foreground")}
                            >
                              {selectedRegional ? selectedRegional.regional : "Pilih"}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Cari regional..." />
                              <CommandList>
                                <CommandEmpty>Regional tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {regOpt.map((regional) => (
                                    <CommandItem
                                      key={regional.kode_regional}
                                      value={regional.regional}
                                      onSelect={() => {
                                        setSelectedRegional(regional)
                                        setSelectedKebun(null)
                                        setSelectedAfdeling(null)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
                                          selectedRegional?.kode_regional === regional.kode_regional
                                            ? "opacity-100"
                                            : "opacity-0",
                                        )}
                                      />
                                      {regional.regional}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium">Kebun</label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              role="combobox"
                              className={cn("w-full justify-between", !selectedKebun && "text-muted-foreground")}
                              disabled={loadingFilters || !selectedRegional || kebuns.length === 0}
                            >
                              {selectedKebun ? selectedKebun.nama_unit : "Pilih"}
                              <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput placeholder="Cari kebun..." />
                              <CommandList>
                                <CommandEmpty>Kebun tidak ditemukan.</CommandEmpty>
                                <CommandGroup>
                                  {kebuns.map((kebun) => (
                                    <CommandItem
                                      key={kebun.kode_unit}
                                      value={kebun.kode_unit}
                                      onSelect={() => {
                                        setSelectedKebun(kebun)
                                        setSelectedAfdeling(null)
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-3 w-3",
                                          selectedKebun?.kode_unit === kebun.kode_unit ? "opacity-100" : "opacity-0",
                                        )}
                                      />
                                      {kebun.nama_unit}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <p></p>
                      </div>
                      <div className="">
                        <Link to={`/dashboard-monev?dari_tanggal=${format(fromDate, "yyyy-MM-dd")}&sampai_tanggal=${format(toDate, "yyyy-MM-dd")}&regional=${selectedRegional?.kode_regional || ''}&kebun=${selectedKebun?.kode_unit || ''}&afdeling=${selectedAfdeling?.kode_afdeling || ''}`}>
                          <Button variant="secondary" className="w-full bg-sky-950 font-semibold">
                            <img width="22" height="22" src="https://img.icons8.com/3d-fluency/94/analytics.png" alt="analytics" />
                            Dashboard Monev TU
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Redesigned Kebun Info Card - Positioned at bottom right */}
                {showKebunInfo && selectedMapKebun && (
                  <div className="fixed bottom-20 right-6 z-20 max-w-xs w-full animate-fade-in">
                    <Card className="dark:bg-slate-950/80 backdrop-blur-md border dark:border-slate-800 border-none  verflow-hidden">
                      <CardHeader className="p-4 pb-2 bg-gradient-to-r from-emerald-600 to-teal-600">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-base text-white flex items-center gap-2">
                            <span className="bg-white text-emerald-600 p-1 rounded-full">
                              <IconEye className="h-4 w-4" />
                            </span>
                            Informasi Kebun
                          </CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-white hover:bg-white/20"
                            onClick={() => setShowKebunInfo(false)}
                          >
                            ×
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-3 space-y-3">
                        <div className="flex justify-between items-center">
                          <h3 className="font-semibold text-lg">{selectedMapKebun.nama_unit}</h3>
                          <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400">
                            {selectedMapKebun.kode_unit}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="text-xs text-muted-foreground">Regional</p>
                            <p className="font-medium">{regOpt.find(r => r.kode_regional === selectedMapKebun.kode_regional)?.regional || '-'}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Jumlah Blok TU</p>
                            <p className="font-medium">{selectedMapKebun.jumlah_blok_tu}</p>
                          </div>
                          <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">Luas Blok TU</p>
                            <p className="font-medium">{Math.round(((selectedMapKebun.luas_blok_tu ?? 0) * 100)) / 100} Ha</p>
                          </div>
                        </div>

                        <Link
                          to={`/dashboard-monev?dari_tanggal=${format(fromDate, "yyyy-MM-dd")}&sampai_tanggal=${format(toDate, "yyyy-MM-dd")}&regional=${selectedMapKebun.kode_regional}&kebun=${selectedMapKebun.kode_unit}`}
                          className="w-full block mt-2"
                        >
                          <Button
                            variant="secondary"
                            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white border-none font-medium text-xs"
                          >
                            <DashboardIcon className="mr-2 h-3 w-3" />
                            Lihat Detail Dashboard
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                )}

              </div>
            </MapComponent>
          )}
        </div>
      </div>
      <Layout.Footer />
    </Layout>
  )
}

const topNav = [
  {
    title: 'Nursery',
    href: '/dashboard-nursery',
    isActive: false
  },
  {
    title: 'Replanting (TU/TK/TB)',
    href: '/dashboard-replanting',
    isActive: false,
  },
  {
    title: 'Immature',
    href: '/dashboard-immature',
    isActive: false,
  },
  {
    title: 'Monica',
    href: '/dashboard-monica',
    isActive: false,
  },
  {
    title: 'Monev TU (Inspire-KKMV)',
    href: '/dashboard-inspire',
    isActive: true,
  },
  {
    title: 'Dashboard Monev TU',
    href: '/dashboard-monev',
    isActive: false,
  },
]
