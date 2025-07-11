"use client"

import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import ThemeSwitch from "@/components/theme-switch"
import { UserNav } from "@/components/user-nav"
import { Controller } from "react-hook-form"
import { customStyles } from "@/styles/select-styles"
import { useState, useEffect } from "react"
import cookie from "js-cookie"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Select from "react-select"
import type { SelectOption } from "@/utils/types"
import { fetchVegetativeProc } from "@/utils/api_immature"
import EnhancedScatterChart from "@/components/custom/kuadran"
import { regionalKebunData } from "@/data/regional-kebun"
import { useNavigate } from "react-router-dom"
import { fetchSerapanBiaya } from "@/utils/api_immature"
import { MONTH_NAMES } from "@/utils/constants"
import { Button } from "@/components/custom/button"
import {
  getScoreJumlahPelepah,
  getScoreKerapatanPokok,
  getScoreLingkarBatang,
  getScoreTinggiTanaman,
  getColorJumlahPelepah,
  getColorLingkarBatang,
  getColorTinggiTanaman,
} from "@/components/custom/calculation-scores"
import { processScoreData } from "@/utils/dashboard-helper"

export default function PicaTbmEnhanced() {

  const user = JSON.parse(cookie.get("user") || "{}")
  const fullName = user.full_name

  const [rpc, setRpc] = useState<string | null>(null)
  const [kebun, setKebun] = useState<string | null>(null)

  const theme = cookie.get("theme") || "system"
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)

  const {
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const router = useNavigate()

  const bulan: any = watch("bulan")
  const tahun: any = watch("tahun")
  const rpcVal = watch("rpc")
  const tbmVal = watch("tbm")

  const [bulanOptions, setBulanOptions] = useState<SelectOption[]>([])
  const [tahunOptions, setTahunOptions] = useState<SelectOption[]>([])
  const [defaultBulan, setDefaultBulan] = useState<SelectOption | null>(null)
  const [defaultTahun, setDefaultTahun] = useState<SelectOption | null>(null)
  const [dataSerapanBiaya, setDataSerapanBiaya] = useState<any[]>([])

  const apiUrl = import.meta.env.VITE_API_IMMATURE

  const rpcOptions = [
    { value: "RPC1", label: "RPC 1" },
    { value: "RPC2", label: "RPC 2" },
    { value: "RPC3", label: "RPC 3" },
    { value: "RPC4", label: "RPC 4" },
    { value: "RPC5", label: "RPC 5" },
    { value: "RPC6", label: "RPC 6" },
    { value: "RPC7", label: "RPC 7" },
    { value: "RPC2N2", label: "RPC2N2" },
    { value: "RPC2N14", label: "RPC2N14" },
  ]
  const [serapanBiaya, setSerapanBiaya] = useState<any[]>([])
  const tbmOpt = [
    { value: "tbm1", label: "TBM 1" },
    { value: "tbm2", label: "TBM 2" },
    { value: "tbm3", label: "TBM 3" },
    { value: "tbm4", label: "TBM > 3" },
  ]
  const [selectedRpc, setSelectedRpc] = useState<string | null>(null)
  const [selectedTbm, setSelectedTbm] = useState<string | null>(null)
  const [kebunOptions, setKebunOptions] = useState<{ value: string; label: string }[]>([])
  const [afdOptions, setAfdOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    const fetchSerapanBiayaDis = async () => {
      const response = await fetch(`${apiUrl}/serapan-biaya-distinct-year`)
      const data = await response.json()
      const tahunOptions = data.map((item: any) => ({ value: item.tahun, label: item.tahun }))
      const bulanOptions = data.map((item: any) => ({ value: item.bulan, label: MONTH_NAMES[item.bulan - 1] }))
      setTahunOptions(tahunOptions)
      setBulanOptions(bulanOptions)
      setDefaultTahun(tahunOptions[0])
      setDefaultBulan(bulanOptions[0])
      setValue("tahun", tahunOptions[0])
      setValue("bulan", bulanOptions[0])
    }
    fetchSerapanBiayaDis()
  }, [])

useEffect(() => {
  console.log("defaultTahun:", defaultTahun, "defaultBulan:", defaultBulan);
  const tahun = defaultTahun?.value;
  const bulan = defaultBulan?.value;

  const AllFetchSerapanBiaya = async (tahun: any, bulan: any) => {
    try {
      console.log("Fetching data for tahun:", tahun, "bulan:", bulan);

      const response = await fetchSerapanBiaya({
        tahun: tahun,
        bulan: bulan,
      });
      setDataSerapanBiaya(response.data);
      
      // Set nilai form setelah data selesai di-fetch
      setValue("tahun", defaultTahun);
      setValue("bulan", defaultBulan);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data serapan biaya");
    }
  };

  if (tahun && bulan) {
    AllFetchSerapanBiaya(tahun, bulan);
  }
}, [defaultTahun, defaultBulan, setValue]);

  const handleRpcChange = (selectedOption: any) => {
    setSelectedRpc(selectedOption.value)
    const selectedRegional = regionalKebunData.regionals.find((regional) => regional.name === selectedOption.value)
    setValue("kebun", null)
    setKebunOptions(selectedRegional ? selectedRegional.kebuns.map((kebun) => ({ value: kebun, label: kebun })) : [])
  }

  const handleTbmChange = (selectedOption: any) => {
    setSelectedTbm(selectedOption.value)
  }

  function parseCSV(csvText: any) {
    const rows = csvText.split(/\r?\n/) // Split CSV text into rows, handling '\r' characters
    const headers = rows[0].split(",") // Extract headers (assumes the first row is the header row)
    const data = [] // Initialize an array to store parsed data
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(",") // Split the row, handling '\r' characters
      const rowObject: any = {} // Initialize an object to store the row data
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = rowData[j]
      }
      data.push(rowObject)
    }
    return data
  }

  const [tbmData, setTbmData] = useState({
    tbm1: 0,
    tbm2: 0,
    tbm3: 0,
    tbm4: 0,
  })

  const [tbmDataScorePelepahBlok, setTbmDataScorePelepahBlok] = useState({
    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
  })

  const [tbmDataScoreLingkarBlok, setTbmDataScoreLingkarBlok] = useState({
    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
  })

  const [scores, setScores] = useState<any[]>([])
  const [scoresAll, setScoresAll] = useState<any[]>([])
  const [scoresRegional, setScoresRegional] = useState<any[]>([])
  const [scoresKebun, setScoresKebun] = useState<any[]>([])
  const [scoresKebunTBM, setScoresKebunTBM] = useState<any[]>([])
  const [scoresAllKebun, setScoresAllKebun] = useState<any[]>([])
  const [tbmRes, setTbmRes] = useState<any[]>([])
  const [regionalBlackBlockCount, setRegionalBlackBlockCount] = useState<any>({})
  const [colorData, setColorData] = useState({
    gold: 0,
    green: 0,
    red: 0,
    black: 0,
  })

  const [colorDataLuas, setColorDataLuas] = useState({
    gold: 0,
    green: 0,
    red: 0,
    black: 0,
  })

  const [colorDataDonat, setColorDataDonat] = useState({
    gold: 0,
    green: 0,
    red: 0,
    black: 0,
  })

  const [colorDataLuasDonat, setColorDataLuasDonat] = useState({
    gold: "",
    green: "",
    red: "",
    black: "",
  })

  // Main data fetching effect
  useEffect(() => {
    const fetchProcVegetatifDefault = async () => {
      try {
        // Reset all values to zero
        setTbmRes([])
        setScores([])
        setScoresKebun([])
        setColorData({
          black: 0,
          red: 0,
          green: 0,
          gold: 0,
        })
        setColorDataLuas({
          black: 0,
          red: 0,
          green: 0,
          gold: 0,
        })
        setTbmData({
          tbm1: 0,
          tbm2: 0,
          tbm3: 0,
          tbm4: 0,
        })
        setTbmDataScorePelepahBlok({
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        })
        setTbmDataScoreLingkarBlok({
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        })

        const loader = toast.loading(`Memuat data untuk Keseluruhan TBM...`, {
          duration: 20000,
        })

        let bulanVegetatif
        let tahunVegetatif

        if (watch("bulan") && watch("tahun")) {
          if (
            watch("bulan").value == 1 ||
            watch("bulan").value == 2 ||
            watch("bulan").value == 3 ||
            watch("bulan").value == 4 ||
            watch("bulan").value == 5 ||
            watch("bulan").value == 6 ||
            watch("bulan").value == 7
          ) {
            bulanVegetatif = 4
            tahunVegetatif = watch("tahun").value
          } else if (

            watch("bulan").value == 8 ||
            watch("bulan").value == 9 ||
            watch("bulan").value == 10 ||
            watch("bulan").value == 11) {
            bulanVegetatif = 8
            tahunVegetatif = watch("tahun").value
          } else if (
            watch("bulan").value == 12 && watch("tahun").value == new Date().getFullYear(
            )
          ) {
            bulanVegetatif = 12
            tahunVegetatif = watch("tahun").value
          } 
        } else {
          bulanVegetatif = 12
          tahunVegetatif = watch("tahun")?.value - 1
        }

        const response = await fetchVegetativeProc({
          input_bulan: Number.parseInt(String(bulanVegetatif)),
          input_tahun: Number.parseInt(String(tahunVegetatif)),
        })

        // Group data by TBM phase
        const groupedData = response.data.reduce((acc: Record<string, any[]>, item: any) => {
          const tbmPhase = `tbm${item.vw_fase_tbm}`
          if (!acc[tbmPhase]) {
            acc[tbmPhase] = []
          }
          acc[tbmPhase].push(item)
          return acc
        }, {})

        const tbmResults = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }
        const scoreJumlahPelepahResults = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        }
        const scoreLingkarBatangResults = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        }
        const regionalBlackBlockCount: Record<string, any> = {}

        // Process each TBM phase
        Object.keys(groupedData).forEach((tbmPhase) => {
          const {
            newScores,
            newScoresKebun,
            newScoresRegional,
            newScoresAll,
            newScoresAllKebun,
            newRegionalBlackBlockCount,
            tbmResultsUpdate,
            scoreJumlahPelepahResultsUpdate,
            scoreLingkarBatangResultsUpdate,
          } = processScoreData({
            data: groupedData[tbmPhase],
            getScoreLingkarBatang,
            getScoreJumlahPelepah,
            getScoreTinggiTanaman,
            getScoreKerapatanPokok,
            getColorJumlahPelepah,
            getColorLingkarBatang,
            getColorTinggiTanaman,
          })

          setScores((prev) => [...prev, ...newScores])
          setScoresAll((prev) => [...prev, ...newScoresAll])
          setScoresKebun((prev) => [...prev, ...newScoresKebun])
          setScoresRegional((prev) => [...prev, ...newScoresRegional])
          setScoresAllKebun((prev) => [...prev, ...newScoresAllKebun])

          // Update counts for this TBM phase
          regionalBlackBlockCount[tbmPhase] = newRegionalBlackBlockCount
          Object.assign(tbmResults, tbmResultsUpdate)

          // Only update scores for TBM1-3
          if (["tbm1", "tbm2", "tbm3"].includes(tbmPhase)) {
            Object.assign(
              scoreJumlahPelepahResults[tbmPhase as keyof typeof scoreJumlahPelepahResults],
              scoreJumlahPelepahResultsUpdate,
            )
            Object.assign(
              scoreLingkarBatangResults[tbmPhase as keyof typeof scoreLingkarBatangResults],
              scoreLingkarBatangResultsUpdate,
            )
          }
        })

        setRegionalBlackBlockCount(regionalBlackBlockCount)
        setTbmData(tbmResults)
        setTbmDataScorePelepahBlok(scoreJumlahPelepahResults)
        setTbmDataScoreLingkarBlok(scoreLingkarBatangResults)

        toast.success("Seluruh data TBM berhasil ditampilkan!", {
          id: loader,
          duration: 2000,
        })
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Gagal memuat data TBM")
      }
    }

    if (bulan && tahun) {
      fetchProcVegetatifDefault()
    }
  }, [bulan, tahun])

  const handleBulanChange = (selectedOption: any) => {
    setValue("bulan", selectedOption)
  }

  const handleReset = () => {
    setValue("rpc", null)
    setValue("tbm", { value: "tbm1", label: "TBM 1" })
  }

  useEffect(() => {
    if (scoresKebunTBM.length == 0) {
      handleBulanChange(defaultBulan)
    }
  }, [scoresKebunTBM])

  useEffect(() => {
    const data = scores.map((item) => {
      let key = Object.keys(item)[0]
      const data = item[key]
      if (key === "tbm4") {
        key = "TBM > 3"
      }
      return [
        key.toUpperCase(),
        data.regional,
        data.kebun,
        data.afdeling,
        data.blok,
        data.luas,
        data.jumPelepah,
        data.scoreLingkarBatang,
        data.scoreJumlahPelepah,
        data.scoreTinggiBatang,
        data.scoreKerapatanPokok,
        data.totalSeleksian,
        data.colorCategory,
      ]
    })

    const colorData = data.reduce(
      (acc: any, item: any) => {
        const colorCategory = item[12]
        if (colorCategory in acc) {
          acc[colorCategory] += 1
        } else {
          acc[colorCategory] = 1
        }
        return acc
      },
      { black: 0, red: 0, green: 0, gold: 0 },
    )

    const colorDataLuas = data.reduce(
      (acc: any, item: any) => {
        const colorCategory = item[12]
        const luas = item[5] // Ambil luas dari data
        if (colorCategory in acc) {
          acc[colorCategory] += luas
        } else {
          acc[colorCategory] = luas
        }
        return acc
      },
      { black: 0, red: 0, green: 0, gold: 0 },
    )

    setColorDataLuas(colorDataLuas)
    setColorData(colorData)
  }, [scores])

  // set default values tbm if scores not empty
  useEffect(() => {
    if (watch("tbm") === null && tbmOpt.length > 0) {
      setValue("tbm", { value: "tbm1", label: "TBM 1" })

    }

    // triggqer tbm change when tbmOpt is not empty
    if (tbmOpt.length > 0 && !watch("tbm")) {
      setValue("tbm", { value: "tbm1", label: "TBM 1" })
    }
  }, [watch("tbm"), scores])

  // Tambahkan useEffect untuk fetch serapanBiaya ketika bulan atau tahun berubah
useEffect(() => {
  const fetchSerapanBiayaData = async () => {
    if (bulan && tahun) {
      try {
        const response = await fetchSerapanBiaya({
          tahun: tahun.value,
          bulan: bulan.value,
        });
        setDataSerapanBiaya(response.data);
      } catch (error) {
        console.error("Error fetching serapan biaya:", error);
        toast.error("Gagal memuat data serapan biaya");
      }
    }
  };

  fetchSerapanBiayaData();
}, [bulan, tahun]); // Jalankan efek ini setiap bulan atau tahun berubah


  return (
    <Layout>
      <Layout.Header sticky>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="items-baseline flex justify-between">
                <h2 className="text-xl font-semibold">Kuadran Grafik PICA</h2>

                <div className="-ml-5 flex gap-4">
                  <Controller
                    name="tahun"
                    control={control}
                    defaultValue={defaultTahun}
                    render={({ field }) => <Select {...field} styles={customStyles} options={tahunOptions} />}
                  />

                  <Controller
                    name="bulan"
                    control={control}
                    defaultValue={defaultBulan}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={customStyles}
                        onChange={(selectedOption) => {
                          handleBulanChange(selectedOption)
                          field.onChange(selectedOption)
                        }}
                        options={bulanOptions}
                      />
                    )}
                  />

                  <Controller
                    name="rpc"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={customStyles}
                        placeholder="Pilih RPC"
                        isSearchable
                        options={rpcOptions}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption)
                          handleRpcChange(selectedOption)
                        }}
                      />
                    )}
                  />

                  <h2 className="text-lg mt-1 ml-5 mr-2">Sort by : </h2>
                  <Controller
                    name="tbm"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={customStyles}
                        placeholder="Pilih TBM"
                        isSearchable
                        defaultValue={{ value: "tbm1", label: "TBM 1" }}
                        options={tbmOpt}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption)
                          handleTbmChange(selectedOption)
                        }}
                      />
                    )}
                  />

                  {/* reset button */}

                  <Button
                    className="rounded-full"
                    onClick={() => {
                      handleReset()
                    }}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </CardTitle>
            <div className="flex items-center justify-between">
              {/* <p className='text-muted-foreground'>
                Kuadran Grafik PICA (Problem Identification & Corrective Action) Investasi
                Tanaman
              </p> */}
            </div>
          </CardHeader>
          <CardContent>
            <div className="items-center justify-center align-middle mr-1 pb-5">
<EnhancedScatterChart
  isDarkMode={isDarkMode}
  dataprops={{
    dataSerapanBiaya,
    scoresKebunTBM,
    regions: rpcVal,
    tbm: tbmVal,
    scoresAllKebun,
    bulan: watch("bulan"), // Tambahkan bulan ke props
    tahun: watch("tahun")  // Tambahkan tahun ke props
  }}
  key={`${watch("bulan")?.value}-${watch("tahun")?.value}`} // Force re-render ketika bulan/tahun berubah
/>
            </div>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}
