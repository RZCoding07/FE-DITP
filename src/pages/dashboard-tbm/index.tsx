"use client"
import domtoimage from 'dom-to-image';
import { useEffect, useState, useMemo, useRef } from "react"
import { Controller } from "react-hook-form"
import { Layout } from "@/components/custom/layout"
import { Button } from "@/components/custom/button"
import { Search } from "@/components/search"
import ThemeSwitch from "@/components/theme-switch"
import { TopNav } from "@/components/top-nav"
import { UserNav } from "@/components/user-nav"
import { FcDoughnutChart } from "react-icons/fc"
import cookie from "js-cookie"
import { Summary } from "@/components/summary"
import Select from "react-select"
import { useDashboardForm } from "@/hooks/use-dashboard-form"
import { fetchVegetativeFinal, fetchVegetativeProc } from "@/utils/api_immature"
import { customStyles } from "@/styles/select-styles"
import { StockAnalysisChart } from "@/components/custom/horizontal-bar-chart"
import StockAnalysisChartBar from "@/components/custom/bar-chart"
import * as XLSX from "xlsx-js-style"
import toast from "react-hot-toast"
import { FaSync } from "react-icons/fa"
import {
  getScoreJumlahPelepah,
  getScoreKerapatanPokok,
  getScoreLingkarBatang,
  getScoreTinggiTanaman,
  getColorJumlahPelepah,
  getColorLingkarBatang,
  getColorTinggiTanaman,
} from "@/components/custom/calculation-scores"

import { ApexBarChart } from "@/components/progress-bar-chart-pica-tbm"

import {
  countColorCategories,
  sumLuasByColorCategory,
  processRegionalData,
  processScoreData,
  processColorData,
} from "@/utils/dashboard-helper"
import axios from "axios"
import DonutChart from "@/components/custom/donut-chart"
import { SummaryTBM } from "@/components/summarytbm"
import { X } from "lucide-react"
import PlanByTimeframe from "@/components/plan-time-frame"
import ProgressByTimeframe from "@/components/progress-time-frame"
import ProblemIdentificationChart from "@/components/pi-frame"
import { TbmCorporateRecap } from "@/components/custom/tbm-recap-summary"

export default function Dashboard() {
  // Di bagian awal component, setelah mendapatkan user data
  const user = cookie.get("user");
  const userData = user ? JSON.parse(user) : null;
  const account_type = userData?.account_type || "user";
  const fullname = userData?.fullname || "User";
  const userKebun = userData?.kebun || "";
  const userRpc = userData?.rpc || "";

  const theme = cookie.get("theme") || "system"
  const isDarkMode = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  const apiUrl = import.meta.env.VITE_API_IMMATURE
  const {
    control,
    watch,
    setValue,
    bulanOptions,
    tahunOptions,
    defaultBulan,
    defaultTahun,
    rpc,
    kebun,
    afd,
    blok,
    bulan,
    tahun,
  } = useDashboardForm()

  const [scores, setScores] = useState<any[]>([])
  const [scoresAll, setScoresAll] = useState<any[]>([])
  const [scoresAllKebun, setScoresAllKebun] = useState<any[]>([])
  const [scoresAllRegional, setScoresAllRegional] = useState<any[]>([])
  const [scoresAllColor, setScoresAllColor] = useState<any[]>([])
  const [scoresRegional, setScoresRegional] = useState<any[]>([])
  const [scoresKebun, setScoresKebun] = useState<any[]>([])
  const [isColor, setIsColor] = useState(false)
  const [color, setColor] = useState("default")

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

  const [selectedCard, setSelectedCard] = useState({
    type: "all",
    name: "Keseluruhan TBM",
    ctg: "tbm-all",
    circular: "",
    val: 4,
  })

  const [kebunOptions, setKebunOptions] = useState<any[]>([])
  const [afdOptions, setAfdOptions] = useState<any[]>([])
  const [isReset, setIsReset] = useState(false)

  const rpcOptions = useMemo(() => {
    const options = [
      { value: "all", label: "Semua RPC" },
      { value: "RPC1", label: "RPC 1" },
      { value: "RPC2", label: "RPC 2" },
      { value: "RPC3", label: "RPC 3" },
      { value: "RPC4", label: "RPC 4" },
      { value: "RPC5", label: "RPC 5" },
      { value: "RPC6", label: "RPC 6" },
      { value: "RPC7", label: "RPC 7" },
      { value: "RPC2N2", label: "RPC2N2" },
      { value: "RPC2N14", label: "RPC2N14" },
    ];

    if (account_type === "kebun") {
      // Hanya tampilkan RPC user tersebut
      return options.filter(option => option.value === userRpc);
    }
    return options;
  }, [account_type, userRpc]);

  interface Kebuns {
    kode_kebun: string;
    nama_kebun: string;
    rpc: string;
    luasan: number;
    calculated_tbm: string;
  }

  // Tipe untuk grouping berdasarkan rpc
  interface GroupedKebun {
    name: string;
    kebuns: Kebuns[];
  }

  // Tipe untuk response yang dikirim oleh API
  interface GetRegionalKebunResponse {
    regionals: GroupedKebun[];
  }

  interface GetRegionalKebunResponseTbm {
    kebuns: GroupedKebun[];
  }


  const [getRegionalKebun, setGetRegionalKebun] = useState<GetRegionalKebunResponse | null>(null)

  useEffect(() => {
    const fetchRpcKebunVegetatif = async () => {
      try {
        if (!tahun || !tahun.value) return;
        const response = await axios.post(`${apiUrl}/get-rpc-kebun-veg-areal`, {
          tahun: Number.parseInt(tahun.value),
        });

        const data: GetRegionalKebunResponse = response.data;
        setGetRegionalKebun(data);
      } catch (error) {
        console.error("Error fetching RPC Kebun:", error);
      }
    };

    fetchRpcKebunVegetatif();
  }, [bulan, tahun]); // Dependencies


  const [getKebunRegTbm, setGetKebunRegTbm] = useState<GetRegionalKebunResponseTbm | null>(null)

  useEffect(() => {
    const fetchKebunRegTbm = async () => {
      try {
        const response = await axios.post(apiUrl + "/get-rpc-kebun-veg-areal-tbm", { tahun: tahun.value })
        const data: GetRegionalKebunResponseTbm = response.data;
        setGetKebunRegTbm(data)

      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    if (bulan && tahun) {
      fetchKebunRegTbm()
    }
  }, [bulan, tahun]) // Depend on bulan and tahun values

  const [tbm1ColorCount, setTbm1ColorCount] = useState<any>({})
  const [tbm2ColorCount, setTbm2ColorCount] = useState<any>({})
  const [tbm3ColorCount, setTbm3ColorCount] = useState<any>({})
  const [tbm4ColorCount, setTbm4ColorCount] = useState<any>({})
  const [tbm1LuasByColor, setTbm1LuasByColor] = useState<any>({})
  const [tbm2LuasByColor, setTbm2LuasByColor] = useState<any>({})
  const [tbm3LuasByColor, setTbm3LuasByColor] = useState<any>({})
  const [tbm4LuasByColor, setTbm4LuasByColor] = useState<any>({})

  const [tbm1DataRegional, setTbm1DataRegional] = useState<any>({})
  const [tbm2DataRegional, setTbm2DataRegional] = useState<any>({})
  const [tbm3DataRegional, setTbm3DataRegional] = useState<any>({})
  const [tbm4DataRegional, setTbm4DataRegional] = useState<any>({})


  const [picaResults, setPicaResults] = useState<any[]>([])
  const [picaResults2, setPicaResults2] = useState<any[]>([])

  // Process TBM data by color
  useEffect(() => {
    if (scores.length === 0) return

    // Group scores by TBM level
    const groupedScores = scores.reduce((acc, x) => {
      const key = Object.keys(x)[0]
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(Object.values(x)[0])
      return acc
    }, {})

    // Get data for each TBM level
    const tbm1Data = groupedScores["tbm1"] ?? []
    const tbm2Data = groupedScores["tbm2"] ?? []
    const tbm3Data = groupedScores["tbm3"] ?? []
    const tbm4Data = groupedScores["tbm4"] ?? []

    // Count colors for each TBM level
    setTbm1ColorCount(countColorCategories(tbm1Data))
    setTbm2ColorCount(countColorCategories(tbm2Data))
    setTbm3ColorCount(countColorCategories(tbm3Data))
    setTbm4ColorCount(countColorCategories(tbm4Data))

    // Sum areas by color for each TBM level
    setTbm1LuasByColor(sumLuasByColorCategory(tbm1Data))
    setTbm2LuasByColor(sumLuasByColorCategory(tbm2Data))
    setTbm3LuasByColor(sumLuasByColorCategory(tbm3Data))
    setTbm4LuasByColor(sumLuasByColorCategory(tbm4Data))

    // Process regional data
    const rpcOpt = ["RPC1", "RPC2", "RPC3", "RPC4", "RPC5", "RPC6", "RPC7", "RPC2N2", "RPC2N14"]

    setTbm1DataRegional(processRegionalData(tbm1Data, rpcOpt))
    setTbm2DataRegional(processRegionalData(tbm2Data, rpcOpt))
    setTbm3DataRegional(processRegionalData(tbm3Data, rpcOpt))
    setTbm4DataRegional(processRegionalData(tbm4Data, rpcOpt))
  }, [selectedCard, scores])

  useEffect(() => {
    const fetchProcVegetatifDefault = async () => {
      try {
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
          duration: 28000,
        })

        // Fetch data
        const response = await fetchVegetativeProc({
          input_bulan: Number.parseInt(bulan.value),
          input_tahun: Number.parseInt(tahun.value),
        })

        const response2 = await fetchVegetativeFinal({
          bulan: Number.parseInt(bulan.value),
          tahun: Number.parseInt(tahun.value),
        });

        setPicaResults(response2);



        // Group data by TBM phase
        const groupedData = response.data.reduce((acc: Record<string, any[]>, item: any) => {
          const tbmPhase = `tbm${item.vw_fase_tbm}`;
          if (!acc[tbmPhase]) {
            acc[tbmPhase] = [];
          }
          acc[tbmPhase].push(item);
          return acc;
        }, {});

        // Process data for each TBM phase
        const tbmResults = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 };
        const scoreJumlahPelepahResults = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        };
        const scoreLingkarBatangResults = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        };
        const regionalBlackBlockCount: Record<string, any> = {};

        // Process each TBM phase
        Object.keys(groupedData).forEach((tbmPhase) => {
          const {
            newScores,
            newScoresKebun,
            newScoresRegional,
            newScoresAll,
            newScoresAllKebun,
            newScoresAllRegional,
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
          });

          setScores((prev) => [...prev, ...newScores]);
          setScoresAll((prev) => [...prev, ...newScoresAll]);
          setScoresAllKebun((prev) => [...prev, ...newScoresAllKebun]);
          setScoresAllRegional((prev) => [...prev, ...newScoresAllRegional]);

          setScoresKebun((prev) => [...prev, ...newScoresKebun]);
          setScoresRegional((prev) => [...prev, ...newScoresRegional]);

          // Update counts for this TBM phase
          regionalBlackBlockCount[tbmPhase] = newRegionalBlackBlockCount;
          Object.assign(tbmResults, tbmResultsUpdate);

          // Only update scores for TBM1-3
          if (['tbm1', 'tbm2', 'tbm3'].includes(tbmPhase)) {
            Object.assign(scoreJumlahPelepahResults[tbmPhase as keyof typeof scoreJumlahPelepahResults], scoreJumlahPelepahResultsUpdate);
            Object.assign(scoreLingkarBatangResults[tbmPhase as keyof typeof scoreLingkarBatangResults], scoreLingkarBatangResultsUpdate);
          }
        });

        console.log("scores", scoresAll);

        setTbmData(tbmResults);
        setTbmDataScorePelepahBlok(scoreJumlahPelepahResults);
        setTbmDataScoreLingkarBlok(scoreLingkarBatangResults);


        toast.success("Seluruh data TBM berhasil ditampilkan!", {
          id: loader,
          duration: 2000,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Gagal memuat data TBM");
      }
    };


    if (bulan && tahun) {
      fetchProcVegetatifDefault();

    }
  }, [bulan, tahun]);
  // Process color data from scores
  useEffect(() => {
    const { colorData, colorDataLuas } = processColorData(scores)
    setColorData(colorData)
    setColorDataLuas(colorDataLuas)
  }, [scores])

  // Get RPC value from form
  const rpcValue = watch("rpc")?.value

  // Filter kebun by RPC
  const distinctKebunByRPC = useMemo(() => {
    if (rpcValue !== "all") {
      return scores.filter((score) => {
        const key = Object.keys(score)[0]
        return score[key].regional === rpcValue
      })
    }
    return []
  }, [rpcValue, selectedCard.name, scores])

  // Get distinct categories
  const distinctCategories = useMemo(() => {
    return [...new Set(distinctKebunByRPC.map((item) => item[Object.keys(item)[0]].kebun))]
  }, [distinctKebunByRPC])

  // Event handlers
  const handleCardClick = (cardData: any) => {
    setColor("default")
    setKebunOptions([])
    setIsReset(false)
    setSelectedCard(cardData)
    setValue("rpc", { value: "all", label: "Semua RPC" })
    setValue("kebun", null)
    setValue("afd", null)
  }
  const handleCard2ClickTBM = (cardData: any) => {
    setScoresAllColor(cardData.items)
    setIsColor(true)
    setColor(cardData.circular)
  }

  const handleRpcChange = (selectedOption: any) => {

    if (selectedCard.ctg === "tbm-all") {
      const selectedRegional = getRegionalKebun?.regionals.find((regional) => regional.name === selectedOption.value)
      setValue("kebun", null)

      // buat new Set lagi karena itu bisa dabel
      const kebunSet = new Set(selectedRegional?.kebuns.map(kebun => kebun.kode_kebun));
      const uniqueKebun = Array.from(kebunSet).map((kebun) => {
        const kebunData = selectedRegional?.kebuns.find((kebunItem) => kebunItem.kode_kebun === kebun);
        return { value: kebun, label: kebunData?.nama_kebun };
      });

      setKebunOptions(uniqueKebun || [])

    } else {
      const selectedRegional = getRegionalKebun?.regionals.find((regional) => regional.name === selectedOption.value)

      const filteredKebun = getKebunRegTbm?.kebuns.filter((ctg) => ctg.name === selectedCard.ctg)


      const filteredKebunBySelectedRegional = filteredKebun?.[0]?.kebuns.filter((kebun) =>
        selectedRegional?.kebuns?.map(k => k.kode_kebun).includes(kebun.kode_kebun),
      )

      const kebunOptions = filteredKebunBySelectedRegional?.map((kebun) => ({ value: kebun.kode_kebun, label: kebun.nama_kebun }))
      setKebunOptions(kebunOptions || [])

    }
    setValue("afd", null)
  }


  const handleKebunChange = (selectedOption: any) => {
    console.log("ini jalan")
    const kebun = selectedOption.value
    const filteredAfd = scoresAll.filter(
      (item: any) =>
        item.regional === rpc.value &&
        item.kebun === kebun
    );



    const afdNames: string[] = Array.from(new Set(filteredAfd.map((item: any) => item.afdeling as string))) as string[];

    setAfdOptions(
      afdNames.map((afd) => ({
        value: afd,
        label: afd,
      }))
    )
    setValue("afd", null)

  }

  // Excel export handler
  const handleDownload = () => {
    const loadingToast = toast.loading("Downloading... Please wait!", {
      position: "top-right",
    })

    console.log("scores", scoresKebun)

    try {
      // Create workbook
      const wb = XLSX.utils.book_new()

      // Detail sheet
      const headers = [
        "Jenis TBM",
        "Regional",
        "Kebun",
        "Afdeling",
        "Blok",
        "Varietas",
        "Luasan",
        "Umur",
        "Jumlah Pokok Awal Tanam",
        "Jumlah Pokok Sekarang",
        "Lingkar Batang",
        "Jumlah Pelepah",
        "Tinggi Batang",
        "Score Lingkar Batang",
        "Score Jumlah Pelepah",
        "Score Tinggi Batang",
        "Score Kerapatan Pokok",
        "Total Seleksian",
        "Kategori Warna",
      ]

      console.log("scores", scores)

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
          data.varietas,
          data.luas,
          data.umur,
          data.jumlah_pokok_awal_tanam,
          data.jumlah_pokok_sekarang,
          data.lingkar_batang_cm,
          data.jumPelepah,
          data.tinggi_tanaman_cm,
          data.scoreLingkarBatang,
          data.scoreJumlahPelepah,
          data.scoreTinggiBatang,
          data.scoreKerapatanPokok,
          data.totalSeleksian,
          data.colorCategory,
        ]
      })

      const ws = XLSX.utils.aoa_to_sheet([headers, ...data])

      // Kebun summary sheet
      const headersKebun = ["Jenis TBM", "Regional", "Kebun", "Luas", "Total Seleksi Kebun", "Color Category"]


      const dataKebun = scoresKebun.map((item) => {
        let key = Object.keys(item)[0]

        const data = item[key]

        if (key === "tbm4") {
          key = "TBM > 3"
        }

        return [key.toUpperCase(), data.regional, data.kebun, data.luas, data.totalSeleksiKebun, data.colorCategory, data.calculatedTbm]
      })

      const wsKebun = XLSX.utils.aoa_to_sheet([headersKebun, ...dataKebun])


      const headersKebunBelumMengisi = ["Jenis TBM", "Regional", "Kode Kebun", "Nama Kebun", "Luasan Input", "Total Luas Kebun", "Progress"]


      // Regional summary sheet
      const headersRegional = ["Jenis TBM", "Regional", "Total Seleksi Regional"]

      const dataRegional = scoresRegional.map((item) => {
        let key = Object.keys(item)[0]

        const data = item[key]

        if (key === "tbm4") {
          key = "TBM > 3"
        }

        return [key.toUpperCase(), data.regional, data.totalSeleksiRegional]
      })

      const wsRegional = XLSX.utils.aoa_to_sheet([headersRegional, ...dataRegional])

      // Apply styles
      const headerStyle = {
        fill: { fgColor: { rgb: "10CCAD" } },
        font: { color: { rgb: "FFFFFF" }, bold: true },
      }

      const colorMapping = {
        gold: "FFA500",
        green: "00a300",
        red: "FF0000",
        black: "000000",
      }

        // Apply header styles to all sheets
        ;[
          { sheet: ws, headers: headers },
          { sheet: wsKebun, headers: headersKebun },
          { sheet: wsRegional, headers: headersRegional },
        ].forEach(({ sheet, headers }) => {
          headers.forEach((_, colIndex) => {
            const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIndex })
            if (!sheet[cellRef]) sheet[cellRef] = {}
            sheet[cellRef].s = headerStyle
          })
        })

      // Apply color styles to detail sheet
      data.forEach((row, rowIndex) => {
        const color = row[18]?.toLowerCase()
        if (colorMapping[color as keyof typeof colorMapping]) {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: 18 })
          ws[cellRef] = ws[cellRef] || {}
          ws[cellRef].s = {
            fill: { fgColor: { rgb: colorMapping[color as keyof typeof colorMapping] } },
            font: { color: { rgb: "FFFFFF" }, bold: true },
          }
        }
      })

      // Apply color styles to kebun sheet
      dataKebun.forEach((row, rowIndex) => {
        const color = row[5]?.toLowerCase()
        if (colorMapping[color as keyof typeof colorMapping]) {
          const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: 5 })
          wsKebun[cellRef] = wsKebun[cellRef] || {}
          wsKebun[cellRef].s = {
            fill: { fgColor: { rgb: colorMapping[color as keyof typeof colorMapping] } },
            font: { color: { rgb: "FFFFFF" }, bold: true },
          }
        }
      })

      // Add sheets to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Detail Seleksi")
      XLSX.utils.book_append_sheet(wb, wsKebun, "Rekap per Kebun")
      XLSX.utils.book_append_sheet(wb, wsRegional, "Rekap per Regional")
      // XLSX.utils.book_append_sheet(wb, wsKebunBelumMengisi, "Kebun Belum Mengisi")

      // Write file
      XLSX.writeFile(wb, `Hasil Seleksi TBM Bulan ${bulan.label} Tahun ${tahun.label}.xlsx`)

      toast.success("Download complete!", { id: loadingToast })
    } catch (error) {
      console.error("Error exporting data:", error)
      toast.error("Failed to download file", { id: loadingToast })
    }
  }

  // Navigation links
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
        isActive: true,
      },
      {
        title: "Monica",
        href: "/dashboard-monica",
        isActive: false,
      },
      {
        title: 'Monev TU (Inspire-KKMV)',
        href: '/dashboard-inspire',
        isActive: false,
      },
      {
        title: 'Dashboard Monev TU',
        href: '/dashboard-monev',
        isActive: false,
      },
    ]
  }

  const [percentageAreal, setPercentageAreal] = useState([])
  useEffect(() => {
    const fetchAreal = async () => {
      try {
        const response = await axios.post(apiUrl + "/vw-areal-calculate", { tahun: tahun.value })
        const totalLuasanArray = response.data.map((item: any) => item.total_luasan)
        setPercentageAreal(totalLuasanArray)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    if (bulan && tahun) {
      fetchAreal()
    }
  }, [bulan, tahun]) // Depend on bulan and tahun values


  const [loading, setLoading] = useState(false)
  const [awal, setAwal] = useState<any[]>([])
  const [error, setError] = useState<any>(null)

  const fetchInvesAwal = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/get-vegetatif-progress/${tahun.value}`)
      setAwal(response.data)

      console.log("awal", response.data)
    } catch (error: any) {
      console.error('Error fetching Awal:', error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }

  function calculateWeightedAverage(data: any[], tbm: string) {
    const regionalMap: any = {};

    let filteredData = selectedCard.ctg === "tbm-all" ? data : data.filter(item => item.vw_fase_tbm === tbm);
    if (filteredData.length === 0) {
      return [];
    }


    // Kelompokkan data berdasarkan regional
    filteredData.forEach(item => {
      if (!regionalMap[item.regional]) {
        regionalMap[item.regional] = {
          luasTotal: 0,
          weightedScores: {
            ascoreLingkarBatang: 0,
            ascoreJumlahPelepah: 0,
            ascoreTinggiBatang: 0,
            ascoreKerapatanPokok: 0,
            totalSeleksian: 0
          },
          colorCategories: {},
          count: 0
        };
      }

      const regional = regionalMap[item.regional];
      const luas = item.luas || 0;

      // Hitung weighted scores
      regional.weightedScores.ascoreLingkarBatang += item.ascoreLingkarBatang * luas;
      regional.weightedScores.ascoreJumlahPelepah += item.ascoreJumlahPelepah * luas;
      regional.weightedScores.ascoreTinggiBatang += item.ascoreTinggiBatang * luas;
      regional.weightedScores.ascoreKerapatanPokok += item.ascoreKerapatanPokok * luas;
      regional.weightedScores.totalSeleksian += item.totalSeleksian * luas;

      // Hitung total luas
      regional.luasTotal += luas;

      // Hitung kategori warna
      if (!regional.colorCategories[item.colorCategory]) {
        regional.colorCategories[item.colorCategory] = 0;
      }
      regional.colorCategories[item.colorCategory] += 1;

      // Hitung jumlah data
      regional.count += 1;
    });

    // Hitung rata-rata tertimbang dan tentukan kategori warna dominan
    const result = Object.keys(regionalMap).map(regional => {
      const data = regionalMap[regional];
      const luasTotal = data.luasTotal;

      return {
        regional,
        ascoreLingkarBatang: data.weightedScores.ascoreLingkarBatang / luasTotal,
        ascoreJumlahPelepah: data.weightedScores.ascoreJumlahPelepah / luasTotal,
        ascoreTinggiBatang: data.weightedScores.ascoreTinggiBatang / luasTotal,
        ascoreKerapatanPokok: data.weightedScores.ascoreKerapatanPokok / luasTotal,
        totalSeleksian: data.weightedScores.totalSeleksian / luasTotal,
        colorCategory: Object.keys(data.colorCategories).reduce((a, b) =>
          data.colorCategories[a] > data.colorCategories[b] ? a : b
        ),
        luas: data.luasTotal,
        count: data.count
      };
    });

    return result;
  }


  function calculateWeightedAverageByRegionalAndKebun(data: any[], selectedRegional: string, tbm: string) {
    // First filter data by selected regional if provided
    let filteredData = selectedRegional
      ? selectedCard.ctg === "tbm-all" ? data.filter(item => item.regional === selectedRegional)
        : data.filter(item => item.regional === selectedRegional && item.vw_fase_tbm === tbm)
      : data;


    const kebunMap: any = {};
    console.log("filteredData", filteredData)

    // Group data by kebun
    filteredData.forEach(item => {
      if (!kebunMap[item.kebun]) {
        kebunMap[item.kebun] = {
          luasTotal: 0,
          weightedScores: {
            ascoreLingkarBatang: 0,
            ascoreJumlahPelepah: 0,
            ascoreTinggiBatang: 0,
            ascoreKerapatanPokok: 0,
            totalSeleksian: 0
          },
          colorCategories: {},
          count: 0,
          regional: item.regional // Keep regional reference
        };
      }

      const kebun = kebunMap[item.kebun];
      const luas = item.luas || 0;

      // Calculate weighted scores
      kebun.weightedScores.ascoreLingkarBatang += item.ascoreLingkarBatang * luas;
      kebun.weightedScores.ascoreJumlahPelepah += item.ascoreJumlahPelepah * luas;
      kebun.weightedScores.ascoreTinggiBatang += item.ascoreTinggiBatang * luas;
      kebun.weightedScores.ascoreKerapatanPokok += item.ascoreKerapatanPokok * luas;
      kebun.weightedScores.totalSeleksian += item.totalSeleksian * luas;

      // Calculate total area
      kebun.luasTotal += luas;

      // Calculate color categories
      if (!kebun.colorCategories[item.colorCategory]) {
        kebun.colorCategories[item.colorCategory] = 0;
      }
      kebun.colorCategories[item.colorCategory] += 1;

      // Count data points
      kebun.count += 1;
    });

    // Calculate weighted averages and determine dominant color category
    const result = Object.keys(kebunMap).map(kebun => {
      const data = kebunMap[kebun];
      const luasTotal = data.luasTotal;

      return {
        kebun,
        regional: data.regional,
        ascoreLingkarBatang: data.weightedScores.ascoreLingkarBatang / luasTotal,
        ascoreJumlahPelepah: data.weightedScores.ascoreJumlahPelepah / luasTotal,
        ascoreTinggiBatang: data.weightedScores.ascoreTinggiBatang / luasTotal,
        ascoreKerapatanPokok: data.weightedScores.ascoreKerapatanPokok / luasTotal,
        totalSeleksian: data.weightedScores.totalSeleksian / luasTotal,
        colorCategory: Object.keys(data.colorCategories).reduce((a, b) =>
          data.colorCategories[a] > data.colorCategories[b] ? a : b
        ),
        luas: data.luasTotal,
        count: data.count
      };
    });

    return result;
  }

  const [weightedAverages, setWeightedAverages] = useState<any[]>([]);
  useEffect(() => {
    if (tahun) {
      fetchInvesAwal()
    }
  }, [tahun])

  useEffect(() => {
    let calculatedAverages;

    if (watch("rpc")?.value === "all") {
      calculatedAverages = calculateWeightedAverage(scoresAllRegional, selectedCard.ctg);
      // Sort by Regional Name (A-Z)
      calculatedAverages.sort((a, b) => a.regional.localeCompare(b.regional));
    } else {
      calculatedAverages = calculateWeightedAverageByRegionalAndKebun(
        scoresAllKebun,
        watch("rpc")?.value,
        selectedCard.ctg
      );
      // Sort by Kebun Name (A-Z)
      calculatedAverages.sort((a, b) => a.kebun.localeCompare(b.kebun));
    }

    setWeightedAverages(calculatedAverages);
  }, [scoresAllRegional, scoresAllKebun, watch("rpc")?.value, selectedCard.ctg]);


  useEffect(() => {
    // Ekstrak semua pica_vegetatif_id ke dalam array
    const idsToFilter = picaResults.map(item => item.pica_vegetatif_id);

    // Filter scoresAll berdasarkan id yang ada dalam idsToFilter
    const filteredScoresAll = scoresAll.filter(item => idsToFilter.includes(item.id));

    // merge filteredScoresAll with picaResults
    const mergedResults = filteredScoresAll.map(score => {
      const picaResult = picaResults.find(pica => pica.pica_vegetatif_id === score.id);
      return {
        ...score,
        ...picaResult,
      };
    });

    setPicaResults2(mergedResults);
  }, [picaResults, scoresAll]);


  useEffect(() => {
    if (account_type === "kebun" && userKebun && userRpc) {
      // Otomatis set kebun user
      const kebunOption: { value: string; label: string } = { value: userKebun, label: userKebun };
      setKebunOptions([kebunOption]);

      if (kebunOption) {
        setValue("kebun", kebunOption);
        handleKebunChange(kebunOption);

        const filteredAfd = scoresAll.filter(
          (item: any) =>
            item.regional === userRpc &&
            item.kebun === userKebun
        );



        const afdNames: string[] = Array.from(new Set(filteredAfd.map((item: any) => item.afdeling as string))) as string[];

        setAfdOptions(
          afdNames.map((afd) => ({
            value: afd,
            label: afd,
          }))
        )
      }


      setValue("afd", null);

      // Otomatis set RPC user
      const rpcOption = rpcOptions.find(option => option.value === userRpc);
      if (rpcOption) {
        setValue("rpc", rpcOption);
      }
    } else if (getRegionalKebun && rpc.value) {
      // Logika original untuk non-kebun account
      if (selectedCard.ctg === "tbm-all") {
        const selectedRegional = getRegionalKebun?.regionals.find(
          (regional) => regional.name === rpc.value
        );
        setValue("kebun", null);
        const kebunSet = new Set(
          selectedRegional?.kebuns.map((kebun) => kebun.kode_kebun)
        );
        const uniqueKebun = Array.from(kebunSet).map((kebun) => {
          const kebunData = selectedRegional?.kebuns.find(
            (kebunItem) => kebunItem.kode_kebun === kebun
          );
          return { value: kebun, label: kebunData?.nama_kebun };
        });
        setKebunOptions(uniqueKebun || []);
      } else {

      }
    }
  }, [getRegionalKebun, rpc.value, selectedCard.ctg, account_type, userKebun, userRpc, scoresAll]);

  const captureRef = useRef<HTMLDivElement | null>(null);
  const handleDownloadCard = async () => {
    if (captureRef.current) {
      domtoimage.toPng(captureRef.current)
        .then((dataUrl: any) => {
          const link = document.createElement('a');
          link.download = 'tbm-recap.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((error: any) => {
          console.error('Snapshot failed:', error);
        });
    } else {
      console.error('Snapshot failed: captureRef.current is null');
    }
  };


  return (
    <Layout>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className="ml-auto flex items-center space-x-4">
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <DashboardHeader
          fullname={fullname}
          control={control}
          tahunOptions={tahunOptions}
          bulanOptions={bulanOptions}
          defaultTahun={defaultTahun}
          defaultBulan={defaultBulan}
          onDownload={handleDownload}
        />

        <br />

        <Summary
          dataProps={{
            tbm1DataRegional,
            tbm2DataRegional,
            tbm3DataRegional,
            tbm4DataRegional,
            luasan: percentageAreal,
            tbmDataScorePelepahBlok,
            tbmDataScoreLingkarBlok,
            data: colorData,
            dataLuas: colorDataLuas,
            score: scores,
            isReset,
            dataTbm: {
              ...tbmData,
              tahun: watch("tahun"),
            },
          }}
          onCardClick={handleCardClick}
        />

        <>
          <div className="w-full items-center align-middle">

            {/* {selectedCard.type !== "color" && ( */}
            <>
              <div className="grid sm:grid-cols-1 lg:grid-cols-[50%_50%] mt-5">
                <h2 className="text-2xl font-bold mt-3">
                  PICA Cluster {selectedCard.name} <br />
                  {rpc ? "" + rpc.label : ""} {kebun ? " - " + kebun.label : ""} {afd ? " - " + afd.label : ""}
                  <strong>
                    &nbsp; ( {bulan ? bulan.label : ""} {tahun ? tahun.label : ""} )
                  </strong>
                </h2>
                <div className="flex gap-3 mt-1">
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
                          if (account_type !== "kebun") { // Hanya bisa diubah jika bukan account kebun
                            field.onChange(selectedOption);
                            handleRpcChange(selectedOption);
                          }
                        }}
                        isDisabled={account_type === "kebun"} // Disable jika account kebun

                      />
                    )}
                  />

                  <Controller
                    name="kebun"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={customStyles}
                        placeholder="Pilih Kebun"
                        isSearchable
                        options={kebunOptions}
                        onChange={(selectedOption) => {
                          if (account_type !== "kebun") { // Hanya bisa diubah jika bukan account kebun
                            field.onChange(selectedOption);
                            setValue("afd", null);
                            handleKebunChange(selectedOption);
                          }
                        }}
                        isDisabled={account_type === "kebun"} // Disable jika account kebun

                      />
                    )}
                  />

                  <Controller
                    name="afd"
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={customStyles}
                        placeholder="Pilih Afdeling"
                        isSearchable
                        options={afdOptions}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption)
                        }}
                      />
                    )}
                  />


                  <div className="-ml-5 flex">
                    <h2 className="text-lg mt-1 ml-5 mr-2">Sort by : </h2>
                    <Controller
                      name="blok"
                      control={control}
                      render={({ field }) => (
                        <Select
                          styles={customStyles}
                          placeholder="Pilih Blok / Luasan"
                          isSearchable
                          defaultValue={{ value: "blok", label: "Blok" }}
                          options={[
                            { value: "blok", label: "Blok" },
                            { value: "luasan", label: "Luasan" },
                          ]}
                          {...field}
                        />
                      )}
                    />
                  </div>
                  <Button
                    className="flex items-center rounded-full"
                    onClick={() => {
                      setSelectedCard({ type: "", name: "Keseluruhan TBM", circular: "", ctg: "tbm-all", val: 0 })
                      setValue("rpc", { value: "all", label: "Semua RPC" })
                      setValue("kebun", null)
                      setValue("afd", null)
                      setKebunOptions([])
                      setAfdOptions([])
                      setIsReset(true)
                      setIsColor(false)
                      setScoresAllColor([])
                      setColor("default")
                    }}
                  >
                    <FaSync style={{ animation: "spin 8s linear infinite" }} />
                  </Button>

                </div>
              </div>

              <div className="grid sm:grid-cols-1 lg:grid-cols-[40%_60%]">
                <div className="items-center justify-center align-middle lg:mr-4">
                  <div className="mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                    <h2 className="text-xl font-semibold">
                      Rekapitulasi {blok ? blok.label : "Blok"} {selectedCard.name}
                    </h2>
                    <hr className="my-2 border-cyan-400" />
                    <div className="grid lg:grid-cols-1">
                      <div className="grid sm:grid-cols-1 lg:grid-cols-[40%_60%]">
                        <p className="text-xs font-semibold text-cyan-300 -mb-9">
                          *Grafik Per {blok ? blok.label : "Blok"}
                          <br />
                          <strong>
                            &nbsp; ( {bulan ? bulan.label : ""} {tahun ? tahun.label : ""} )
                          </strong>
                        </p>
                        <p className="float-end text-end text-sm font-semibold text-cyan-300 -mb-5">
                          {rpc ? rpc.label : ""} {kebun ? " - " + kebun.label : ""} {afd ? " - " + afd.label : ""}
                        </p>

                      </div>

                      <DonutChart
                        dataprops={{
                          untuk: watch("blok")?.value,
                          scoreAll: scoresAll,
                          rpc: rpc,
                          kebun: kebun,
                          afd: afd,
                          kebunOptions: kebunOptions.map((kebun) => kebun.value),
                          ctg: selectedCard.ctg,
                          title: selectedCard.name,
                        }}
                      />
                      <SummaryTBM
                        dataprops={{
                          untuk: watch("blok")?.value,
                          scoreAll: scoresAll,
                          rpc: rpc,
                          kebun: kebun,
                          afd: afd,
                          kebunOptions: kebunOptions.map((kebun) => kebun.value),
                          ctg: selectedCard.ctg,
                          title: selectedCard.name,
                        }}
                        onCardTbmClick={handleCard2ClickTBM}
                      />
                    </div>
                  </div>
                </div>

                <div className="items-center justify-center align-middle">
                  <div className="mt-5">
                    <div className="items-center justify-center align-middle">
                      <div className="mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                        <div className="grid lg:grid-cols-1">
                          <StockAnalysisChart
                            dataprops={{
                              untuk: watch("blok")?.value,
                              scoreAll: isColor ? scoresAllColor : scoresAll,
                              rpc: rpc,
                              kebun: kebun,
                              afd: afd,
                              kebunOptions: kebunOptions.map((kebun) => kebun.value),
                              ctg: selectedCard.ctg,
                              title: selectedCard.name,
                              color: color
                            }}
                            onEventClick={handleCardClick}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-1 lg:grid-cols-1">


                <div className="items-center justify-center align-middle">
                  <div className="mt-5">
                    <div className="items-center justify-center align-middle">
                      <div className="mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">

                        <div className="grid lg:grid-cols-1">
                          <ApexBarChart data={awal}
                            tbm={selectedCard.ctg} rpcSelected={rpc.value} rpcOrKebun={rpc.value === "all" ? "regional" : "kebun"} kebunSelected={kebun?.value}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="grid sm:grid-cols-1 lg:grid-cols-1">

                <div className="items-center justify-center align-middle">
                  <div className="mt-5">
                    <div className="items-center justify-center align-middle">
                      <div className="mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                        <div className="grid lg:grid-cols-1">
                          <div className="">
                            <h2 className="text-xl font-semibold">
                              Detail {selectedCard.name} {rpc ? "" + rpc.label : ""} {kebun ? " - " + kebun.label : ""} {afd ? " - " + afd.label : ""}
                              <strong>
                                &nbsp; ( {bulan ? bulan.label : ""} {tahun ? tahun.label : ""} )
                              </strong>
                            </h2>

                            <div className="overflow-x-auto">
                              <table className="mt-5 min-w-full border-collapse w-full border border-cyan-900 bg-white dark:bg-[#0a192f] dark:text-white">
                                <thead className="bg-[#1ea297]">
                                  <tr className=" text-white">
                                    <th className="border px-2 py-2 border-cyan-900 text-center w-1/6">
                                      {rpcValue !== "all" ? (
                                        kebun?.value !== "all" ? (
                                          <div className="flex items-center justify-between">
                                            <span>Kebun</span>
                                            <span className="text-xs text-white">({kebun?.label})</span>
                                          </div>
                                        ) : (
                                          <div className="flex items-center justify-between">
                                            <span>Kebun</span>
                                            <span className="text-xs text-white">({rpc?.label})</span>
                                          </div>
                                        )
                                      ) : (
                                        <div className="flex items-center justify-center">
                                          <span>Regional</span>
                                          <span className="text-xs text-white">({rpc?.label})</span>
                                        </div>
                                      )}
                                    </th>
                                    <th className="border border-cyan-900 px-2 py-2 text-center w-1/6 ">Tinggi Tanaman</th>
                                    <th className="border border-cyan-900 px-2 py-2 text-center w-1/6 ">Jumlah Pelepah</th>
                                    <th className="border border-cyan-900 px-2 py-2 text-center w-1/6 ">Lingkar Batang</th>
                                    <th className="border border-cyan-900 px-2 py-2 text-center w-1/6 ">Kerapatan Pokok</th>
                                    <th className="border border-cyan-900 px-2 py-2 text-center w-1/6 ">Nilai PICA</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {weightedAverages

                                    .map((item: any, index: number) => {
                                      const getColorClass = (score: number) => {
                                        if (score > 92) return 'bg-gradient-to-br to-yellow-700 from-yellow-500';
                                        if (score > 87) return 'bg-gradient-to-br to-green-900 from-green-500';
                                        if (score > 82) return 'bg-gradient-to-br to-red-800 from-red-500';
                                        return 'bg-gradient-to-br to-black from-gray-500';
                                      };

                                      return (
                                        <tr key={index} className={`border-b hover:bg-slate-100 dark:hover:bg-slate-800`}>
                                          <td className="border px-2 py-2 border-cyan-900 text-center">
                                            {watch("rpc")?.value === "all"
                                              ? item.regional
                                              : (watch("kebun")?.value === "all" ? item.kebun : item.kebun)
                                            }
                                          </td>
                                          <td className={`border px-2 py-2 border-cyan-900 text-center`}>
                                            <div className={getColorClass(item.ascoreTinggiBatang.toFixed(2) || 0) + " text-center rounded-lg py-2"}>
                                              {item.ascoreTinggiBatang.toFixed(2)}
                                            </div>
                                          </td>
                                          <td className={`border px-2 py-2 border-cyan-900 text-center`}>
                                            <div className={getColorClass(item.ascoreJumlahPelepah.toFixed(2) || 0) + " text-center rounded-lg py-2"}>
                                              {item.ascoreJumlahPelepah.toFixed(2)}
                                            </div>
                                          </td>
                                          <td className={`border px-2 py-2 border-cyan-900 text-center`}>
                                            <div className={getColorClass(item.ascoreLingkarBatang.toFixed(2) || 0) + " text-center rounded-lg py-2"}>
                                              {item.ascoreLingkarBatang.toFixed(2)}
                                            </div>
                                          </td>
                                          <td className={`border px-2 py-2 border-cyan-900 text-center`}>
                                            <div className={getColorClass(item.ascoreKerapatanPokok.toFixed(2) || 0) + " text-center rounded-lg py-2"}>
                                              {item.ascoreKerapatanPokok.toFixed(2)}
                                            </div>
                                          </td>
                                          <td className={`border px-2 py-2 border-cyan-900 text-center`}>
                                            <div className={getColorClass(item.totalSeleksian.toFixed(2) || 0) + " text-center rounded-lg py-2"}>
                                              {item.totalSeleksian.toFixed(2)}
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  }
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
            
             <br/>

                <div className="grid sm:grid-cols-1 lg:grid-cols-1">
                  <div className="grid sm:grid-cols-1 lg:grid-cols-1">
                    <div className="items-center justify-center align-middle">
                      <div className="" ref={captureRef}>
                        <TbmCorporateRecap
                          scoresAll={scoresAll}
                          rpc={rpc}
                          kebun={kebun}
                          afd={afd}
                          selectedCard={selectedCard}
                          bulan={bulan}
                          tahun={tahun}
                          handleDownload={handleDownloadCard}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-1 lg:grid-cols-1">
                <div className="items-center justify-center align-middle">
                  <div className="mt-5">
                    <div className="items-center justify-center align-middle">
                      <div className="mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                        <h2 className="text-xl font-semibold">
                          Top Problem Identification

                        </h2>
                        <hr className="my-2 border-cyan-400" />
                        <div className="grid lg:grid-cols-1">
                          <ProblemIdentificationChart
                            isDarkMode={isDarkMode}
                            picaResults={picaResults2}
                            rpc={rpc?.value}
                            kebun={kebun?.value}
                            afd={afd?.value}
                            ctg={selectedCard.ctg}
                            bulan={bulan?.value}
                            tahun={tahun?.value}
                          />

                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
              <div className="grid sm:grid-cols-1 lg:grid-cols-[30%_70%]">
                <div className="items-cent
                er justify-center align-middle lg:mr-4">
                  <div className="mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                    <h2 className="text-xl font-semibold">
                      <h1 className="title">Corrective Action</h1>

                    </h2>
                    <hr className="my-2 border-cyan-400" />

                    <PlanByTimeframe isDarkMode={isDarkMode} />


                  </div>
                </div>

                <div className="items-center justify-center align-middle">
                  <div className="mt-5">
                    <div className="items-center justify-center align-middle">
                      <div className="mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950">
                        <h2 className="text-xl font-semibold">
                          Progress Corrective Action Berjangka

                        </h2>
                        <hr className="my-2 border-cyan-400" />

                        <ProgressByTimeframe isDarkMode={isDarkMode} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </>
          </div>
        </>
      </Layout.Body>
      <Layout.Footer>
      </Layout.Footer>
    </Layout>
  )
}

function DashboardHeader({
  control,
  fullname,
  tahunOptions,
  bulanOptions,
  defaultTahun,
  defaultBulan,
  onDownload,
}: {
  control: any
  fullname: string
  tahunOptions: any
  bulanOptions: any[]
  defaultTahun: any
  defaultBulan: any
  onDownload: () => void
}) {
  return (
    <div className="mb-2 flex items-center justify-between space-y-2">
      <div className="flex items-center space-x-2">
        <FcDoughnutChart size={40} style={{ animation: "spin 4s linear infinite" }} />
        <h1 className="text-xl font-bold tracking-tight">Dashboard PICA Immature</h1>
      </div>
      <h1 className="text-xl">Hi, Welcome back {fullname}👋</h1>
      <div className="lg:flex sm:grid sm:grid-cols-1 items-center space-x-2">
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
          render={({ field }) => <Select {...field} styles={customStyles} options={bulanOptions} />}
        />

        <Button onClick={onDownload} className="flex items-center rounded-full" variant={"secondary"}>
          <span className="ml-2">Export Excel</span>
          &nbsp;
          <img
            width="28"
            height="28"
            src="https://img.icons8.com/fluency/28/microsoft-excel-2019.png"
            alt="microsoft-excel-2019"
          />
        </Button>
      </div>
    </div>
  )
}
