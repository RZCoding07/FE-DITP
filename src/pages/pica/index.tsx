'use client'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns.1'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Controller } from 'react-hook-form'
import { customStyles } from '@/styles/select-styles'
import React, { useState, useEffect, useRef, useId } from 'react'
import cookie from 'js-cookie'
import Papa from 'papaparse'
import { BsFillCheckCircleFill, BsTrash } from 'react-icons/bs'
import readXlsxFile from 'read-excel-file'
import { FaFileExcel } from 'react-icons/fa'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Box, CircularProgress, Typography } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import slugify from 'slugify'
import Select from 'react-select'
import axios from 'axios'
import StockAnalysisChartBar from '@/components/custom/bar-chart'
import { fetchDistinctYearsMonth, fetchKebun } from '@/utils/api_immature'
import { SelectOption } from '@/utils/types'
import { MONTH_NAMES } from '@/utils/constants'
import { fetchDistinctYears } from '@/utils/api_immature'
import { fetchVegetativeProc } from '@/utils/api_immature'
import {

  getScoreJumlahPelepah,
  getScoreKerapatanPokok,
  getScoreLingkarBatang,
  getScoreTinggiTanaman,

  getScorePanjangRachis,
  getScoreLebarPetiola,
  getScoreTebalPetiola,
  getScoreJumlahAnakDaun,
  getScorePanjangAnakDaun,
  getScoreLebarAnakDaun,

  getColorJumlahPelepah,
  getColorLingkarBatang,
  getColorTinggiTanaman,

  getColorPanjangRachis,
  getColorLebarPetiola,
  getColorTebalPetiola,
  getColorJumlahAnakDaun,
  getColorPanjangAnakDaun,
  getColorLebarAnakDaun,
} from "@/components/custom/calculation-scores"
import {
  processScoreData,
  countColorCategories,
  sumLuasByColorCategory,
  processRegionalData,
} from "@/utils/dashboard-helper"
import * as XLSX from "xlsx-js-style"

// Define the header style for Excel export
const headerStyle = {
  fill: { fgColor: { rgb: "10CCAD" } },
  font: { color: { rgb: "FFFFFF" }, bold: true },
  alignment: { horizontal: "center" },
};

export default function PicaTbm() {
  const [isLoadingUpload, setIsLoadingUpload] = useState(false)
  const [isUploadingDone, setIsUploadingDone] = useState(false)
  const [progressValue, setProgressValue] = useState(0)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [awal, setAwal] = useState([])

  const [picaData, setPicaData] = useState<any[]>([])

  // Get user data from cookie
  const user = JSON.parse(cookie.get('user') || '{}')
  const accountType = user?.account_type || 'superadmin'
  const userRpc = user?.rpc || null
  const userKebun = user?.kebun || null

  // Filter RPC options based on user role
  const getFilteredRpcOptions = () => {
    const allRpcOptions = [
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
    ]

    if (accountType === 'Superadmin') {
      return allRpcOptions
    } else if (accountType === 'regional') {
      return allRpcOptions.filter(option => 
        option.value === 'all' || option.value === userRpc
      )
    } else if (accountType === 'kebun') {
      // Kebun users should only see their RPC
      return allRpcOptions.filter(option => option.value === userRpc)
    }
    return allRpcOptions
  }

  const rpcOptions = getFilteredRpcOptions()

  // Filter data based on user role
  const filterDataByRole = (data: any[]) => {
    if (accountType === 'Superadmin') {
      return data
    } else if (accountType === 'regional') {
      return data.filter(item => item.regional === userRpc)
    } else if (accountType === 'kebun') {
      return data.filter(item => item.kebun === userKebun)
    }
    return data
  }

  useEffect(() => {
    const fetchPicaData = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_IMMATURE}/pica-all`)
        const data = response.data

        // Filter data based on user role
        const filteredData = filterDataByRole(data.data || [])
        
        console.log('Pica Data:', filteredData)
        setPicaData(filteredData)
        setLoading(false)
      } catch (error: any) {
        console.error('Error fetching data:', error)
        setError(error)
        setLoading(false)
      }
    }

    fetchPicaData()
  }, [])

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm()

  const router = useNavigate()

  const bulan: any = watch('bulan')
  const tahun: any = watch('tahun')

  const [bulanOptions, setBulanOptions] = useState<SelectOption[]>([])
  const [tahunOptions, setTahunOptions] = useState<SelectOption[]>([])
  const [defaultBulan, setDefaultBulan] = useState<SelectOption | null>(null)
  const [defaultTahun, setDefaultTahun] = useState<SelectOption | null>(null)
  const [selectedTbm, setSelectedTbm] = useState('keseluruhan-tbm')

  const [hasInitialized, setHasInitialized] = useState(false)

  const handleTbmChange = (selectedOption: any) => {
    setSelectedTbm(selectedOption.value);
  }

  // Main state variables
  const [scores, setScores] = useState<any[]>([])
  const [scoresAll, setScoresAll] = useState<any[]>([])
  const [scoresRegional, setScoresRegional] = useState<any[]>([])
  const [scoresKebun, setScoresKebun] = useState<any[]>([])
  const [tbmRes, setTbmRes] = useState<any[]>([])

  // Color data state
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

  // TBM data state
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

  // Block count state
  const [countRedBlock, setCountRedBlock] = useState<Record<string, number>>({})
  const [countBlackBlock, setCountBlackBlock] = useState<Record<string, number>>({})
  const [countRedBlockTbm1, setCountRedBlockTbm1] = useState<Record<string, number>>({})
  const [countRedBlockTbm2, setCountRedBlockTbm2] = useState<Record<string, number>>({})
  const [countRedBlockTbm3, setCountRedBlockTbm3] = useState<Record<string, number>>({})
  const [countRedBlockTbm4, setCountRedBlockTbm4] = useState<Record<string, number>>({})
  const [countBlackBlockTbm1, setCountBlackBlockTbm1] = useState<Record<string, number>>({})
  const [countBlackBlockTbm2, setCountBlackBlockTbm2] = useState<Record<string, number>>({})
  const [countBlackBlockTbm3, setCountBlackBlockTbm3] = useState<Record<string, number>>({})
  const [countBlackBlockTbm4, setCountBlackBlockTbm4] = useState<Record<string, number>>({})
  const [regionalBlackBlockCount, setRegionalBlackBlockCount] = useState<any>({})

  // Selection state
  const [selectedRpc, setSelectedRpc] = useState("all")
  const [selectedKebun, setSelectedKebun] = useState({ value: "", label: "" })
  const [selectedAfd, setSelectedAfd] = useState("")
  const [selectedCard, setSelectedCard] = useState({
    type: "all",
    name: "Keseluruhan TBM",
    ctg: "tbm-all",
    circular: "",
    val: 4,
  })

  // Excel export function
  const exportToExcel = (data: any[], selectedTbm: string) => {
    // Filter data based on user role before exporting
    const filteredData = filterDataByRole(data)
    
    // Prepare the worksheet data
    const wsData = [
      // Header row with styles
      [
        { v: "Regional", t: "s", s: headerStyle },
        { v: "Kebun", t: "s", s: headerStyle },
        { v: "Afdeling", t: "s", s: headerStyle },
        { v: "Blok", t: "s", s: headerStyle },
        { v: "Luas (Ha)", t: "s", s: headerStyle },
        { v: "Varietas", t: "s", s: headerStyle },
        { v: "Tahun Tanam", t: "s", s: headerStyle },
        { v: "Nilai Jumlah Pelepah", t: "s", s: headerStyle },
        { v: "Nilai Kerapatan Pokok", t: "s", s: headerStyle },
        { v: "Nilai Lingkar Batang", t: "s", s: headerStyle },
        { v: "Nilai Tinggi Batang", t: "s", s: headerStyle },
        { v: "Nilai Vegetatif", t: "s", s: headerStyle },
        { v: "Kategori Warna", t: "s", s: headerStyle },
        { v: "Status PICA", t: "s", s: headerStyle },
      ],
      // Data rows
      ...filteredData.map((item) => [
        item.regional,
        item.kebun,
        item.afdeling,
        item.blok,
        item.luas,
        item.varietas,
        item.tahun_tanam,
        item.scoreJumlahPelepah,
        item.scoreKerapatanPokok?.toFixed(2),
        item.scoreLingkarBatang,
        item.scoreTinggiBatang,
        item.totalSeleksian?.toFixed(2),
        {
          v: item.colorCategory === "red" ? "MERAH" : "HITAM",
          t: "s",
          s: {
            fill: {
              fgColor: {
                rgb: item.colorCategory === "red" ? "DC143C" : "000000",
              },
            },
            font: { color: { rgb: "FFFFFF" } },
          },
        },
        item.pica_id ? "Sudah Terisi" : "Belum Terisi",
      ]),
    ];

    // Create worksheet
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    // Set column widths
    ws["!cols"] = [
      { width: 10 }, // Regional
      { width: 15 }, // Kebun
      { width: 10 }, // Afdeling
      { width: 10 }, // Blok
      { width: 10 }, // Luas
      { width: 12 }, // Varietas
      { width: 12 }, // Tahun Tanam
      { width: 18 }, // Jumlah Pelepah
      { width: 18 }, // Kerapatan Pokok
      { width: 18 }, // Lingkar Batang
      { width: 16 }, // Tinggi Batang
      { width: 14 }, // Vegetatif
      { width: 14 }, // Kategori Warna
      { width: 12 }, // Status PICA
    ];

    // Create workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      ws,
      `PICA ${selectedTbm === "keseluruhan-tbm" ? "All TBM" : selectedTbm.toUpperCase()}`
    );

    // Export the file
    XLSX.writeFile(
      wb,
      `PICA_${selectedTbm === "keseluruhan-tbm" ? "All_TBM" : selectedTbm}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

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

        // Add filter based on user role
        const params: any = {
          input_bulan: Number.parseInt(bulan.value),
          input_tahun: Number.parseInt(tahun.value),
        }

        if (accountType === 'regional') {
          params.regional = userRpc
        } else if (accountType === 'kebun') {
          params.kebun = userKebun
        }

        const response = await fetchVegetativeProc(params)

        // Filter data based on user role
        let filteredData = response.data
        if (accountType === 'regional') {
          filteredData = filteredData.filter((item: any) => item.regional === userRpc)
        } else if (accountType === 'kebun') {
          filteredData = filteredData.filter((item: any) => item.kebun === userKebun)
        }

        // Group data by TBM phase
        const groupedData = filteredData.reduce((acc: Record<string, any[]>, item: any) => {
          const tbmPhase = `tbm${item.vw_fase_tbm}`;
          if (!acc[tbmPhase]) {
            acc[tbmPhase] = [];
          }
          acc[tbmPhase].push(item);
          return acc;
        }, {});

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
            getScorePanjangRachis,
            getScoreLebarPetiola,
            getScoreTebalPetiola,
            getScoreJumlahAnakDaun,
            getScorePanjangAnakDaun,
            getScoreLebarAnakDaun,

            getColorJumlahPelepah,
            getColorLingkarBatang,
            getColorTinggiTanaman,

            getColorPanjangRachis,
            getColorLebarPetiola,
            getColorTebalPetiola,
            getColorJumlahAnakDaun,
            getColorPanjangAnakDaun,
            getColorLebarAnakDaun,
          });
          
          setScores((prev) => [...prev, ...newScores]);
          setScoresAll((prev) => [...prev, ...newScoresAll]);
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

        setRegionalBlackBlockCount(regionalBlackBlockCount);
        setTbmData(tbmResults);
        setTbmDataScorePelepahBlok(scoreJumlahPelepahResults);
        setTbmDataScoreLingkarBlok(scoreLingkarBatangResults);

        toast.success("Seluruh data TBM berhasil ditampilkan!", {
          id: loader,
          duration: 2000,
        });
      } catch (error) {
        console.error("Error fetching data:", error)
        toast.error("Gagal memuat data TBM")
      }
    }

    if (bulan && tahun) {
      fetchProcVegetatifDefault()
    }
  }, [bulan, tahun, accountType, userRpc, userKebun])

  useEffect(() => {
    let z: any = []

    // buatkan z tambahin 1 index namanya data untuk seluruh data scores dipassing ke setAwal
    z = z.map((x: any) => {
      return {
        ...x,
        data: scores,
      }
    })

    if (selectedTbm !== 'keseluruhan-tbm') {
      scores.filter((x: any) => {
        if (Object.keys(x).includes(selectedTbm)) {
          z.push(Object.values(x)[0])
        }
      })
    } else {
      scores.filter((x: any) => {
        z.push(Object.values(x)[0])
      })
    }

    // buatkan z hanya memunculkan item colorCategory === 'red' dan 'black'
    z = z.filter((x: any) => x.colorCategory === 'red' || x.colorCategory === 'black')

    // Filter data based on user role
    z = filterDataByRole(z)

    console.log('Z:', z)

    setAwal(z)
  }, [scores, selectedTbm, accountType, userRpc, userKebun])

  useEffect(() => {
    const fetchBulanTahun = async () => {
      try {
        const data = await fetchDistinctYears()

        const tahun = data.map((item: any) => ({
          value: item.tahun,
          label: item.tahun.toString(),
        }))

        setTahunOptions(tahun)

        if (tahun.length > 0) {
          setDefaultTahun(tahun[0])
          setValue('tahun', tahun[0])
        }
      } catch (error) {
        console.error('Error fetching tahun:', error)
      }
    }

    if (!hasInitialized) {
      fetchBulanTahun()
      setHasInitialized(true)
    }
  }, [setValue, hasInitialized])

  useEffect(() => {
    const fetchBulan = async () => {
      if (!tahun) return

      try {
        const dataBulan = await fetchDistinctYearsMonth({
          tahun: tahun.value,
        })

        const bulan = dataBulan.map((item: any) => ({
          value: item.bulan,
          label: MONTH_NAMES[item.bulan - 1],
        }))

        setBulanOptions(bulan)

        if (bulan.length > 0) {
          setDefaultBulan(bulan[0])
          setValue('bulan', bulan[0])
        }
      } catch (error) {
        console.error('Error fetching bulan:', error)
      }
    }

    fetchBulan()
  }, [tahun, setValue])

  useEffect(() => {
    const tbm1Data = scores.filter((score: any) => {
      const tbmKey = Object.keys(score)[0];
      return tbmKey === 'tbm1';
    });

    const tbm2Data = scores.filter((score: any) => {
      const tbmKey = Object.keys(score)[0];
      return tbmKey === 'tbm2';
    });

    const tbm3Data = scores.filter((score: any) => {
      const tbmKey = Object.keys(score)[0];
      return tbmKey === 'tbm3';
    });

    const tbm4Data = scores.filter((score: any) => {
      const tbmKey = Object.keys(score)[0];
      return tbmKey === 'tbm4';
    });

    const tbm1RedData = tbm1Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
    const tbm1BlackData = tbm1Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

    const tbm2RedData = tbm2Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
    const tbm2BlackData = tbm2Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

    const tbm3RedData = tbm3Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
    const tbm3BlackData = tbm3Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

    const tbm4RedData = tbm4Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
    const tbm4BlackData = tbm4Data.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

    const dataColorRed = scores.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'red')
    rpcOptions.forEach((rpc) => {
      const tbmallRed = dataColorRed.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      const tbm1Red = tbm1RedData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      const tbm2Red = tbm2RedData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      const tbm3Red = tbm3RedData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      const tbm4Red = tbm4RedData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      setCountRedBlock((prev: any) => ({
        ...prev,
        [rpc.value]: tbmallRed.length,
      }))
      setCountRedBlockTbm1((prev: any) => ({
        ...prev,
        [rpc.value]: tbm1Red.length,
      }))
      setCountRedBlockTbm2((prev: any) => ({
        ...prev,
        [rpc.value]: tbm2Red.length,
      }))

      setCountRedBlockTbm3((prev: any) => ({
        ...prev,
        [rpc.value]: tbm3Red.length,
      }))
      setCountRedBlockTbm4((prev: any) => ({
        ...prev,
        [rpc.value]: tbm4Red.length,
      }))

      const dataColorBlack = scores.filter((score: any) => (Object.values(score)[0] as any).colorCategory === 'black')

      const tbmallBlack = dataColorBlack.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      const tbm1Black = tbm1BlackData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      const tbm2Black = tbm2BlackData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      const tbm3Black = tbm3BlackData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      const tbm4Black = tbm4BlackData.filter((score: any) => (Object.values(score)[0] as any).regional === rpc.value)
      setCountBlackBlock((prev: any) => ({
        ...prev,
        [rpc.value]: tbmallBlack.length,
      }))
      setCountBlackBlockTbm1((prev: any) => ({
        ...prev,
        [rpc.value]: tbm1Black.length,
      }))
      setCountBlackBlockTbm2((prev: any) => ({
        ...prev,
        [rpc.value]: tbm2Black.length,
      }))
      setCountBlackBlockTbm3((prev: any) => ({
        ...prev,
        [rpc.value]: tbm3Black.length,
      }))
      setCountBlackBlockTbm4((prev: any) => ({
        ...prev,
        [rpc.value]: tbm4Black.length,
      }))
    })
  }, [scores])

  const tbmOpt = [
    { value: 'keseluruhan-tbm', label: 'Keseluruhan TBM' },
    { value: 'tbm1', label: 'TBM 1' },
    { value: 'tbm2', label: 'TBM 2' },
    { value: 'tbm3', label: 'TBM 3' },
  ]

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="items-baseline flex justify-between">
                <h2 className='text-xl font-semibold'>
                  Monitoring Problem Identification
                </h2>
                <div className='-ml-5 flex gap-4'>
                  <Controller
                    name='tahun'
                    control={control}
                    defaultValue={defaultTahun}
                    render={({ field }) => (
                      <Select {...field} styles={customStyles} options={tahunOptions} />
                    )}
                  />

                  <Controller
                    name='bulan'
                    control={control}
                    defaultValue={defaultBulan}
                    render={({ field }) => (
                      <Select {...field} styles={customStyles} options={bulanOptions} />
                    )}
                  />

                  <h2 className='text-lg mt-1 ml-5 mr-2'>Pilih TBM : </h2>
                  <Controller
                    name='tbm'
                    control={control}
                    render={({ field }) => (
                      <Select
                        {...field}
                        styles={customStyles}
                        placeholder='Pilih TBM'
                        isSearchable
                        defaultValue={{ value: 'keseluruhan-tbm', label: 'Keseluruhan TBM' }}
                        options={tbmOpt}
                        onChange={(selectedOption) => {
                          field.onChange(selectedOption);
                          handleTbmChange(selectedOption);
                        }}
                      />
                    )}
                  />

                  <h2 className='text-lg mt-1 ml-5 mr-2'>Sort by : </h2>
                  <Controller
                    name='blok'
                    control={control}
                    render={({ field }) => (
                      <Select
                        styles={customStyles}
                        placeholder='Pilih Blok / Luasan'
                        isSearchable
                        defaultValue={{ value: 'blok', label: 'Blok' }}
                        options={[
                          { value: 'blok', label: 'Blok' },
                          { value: 'luasan', label: 'Luasan' },
                        ]}
                        {...field}
                      />
                    )}
                  />
                </div>
              </div>
            </CardTitle>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground'>
                PICA (Problem Identification & Corrective Action) Investasi
                Tanaman
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className='items-center justify-center align-middle mr-1 pb-5'>
              <div className='rounded-lg border border-cyan-500 bg-white p-3 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-cyan-700 dark:to-cyan-600'>
                <div className='flex justify-between align-middle items-center'>
                  <h2 className='text-xl font-semibold'>
                    Total Merah dan Hitam {selectedTbm === 'keseluruhan-tbm' ? 'Keseluruhan TBM' : selectedTbm.toUpperCase()}
                  </h2>
                </div>
                <hr className='my-2 mt-4 border-cyan-400' />

                <div className='mt-5 grid lg:grid-cols-1 sm:grid-cols-1'>
                  <StockAnalysisChartBar
                    dataProps={
                      {
                        ctg: selectedTbm,
                        countBlackBlock,
                        countRedBlock,
                        countBlackBlockTbm1,
                        countRedBlockTbm1,
                        countBlackBlockTbm2,
                        countRedBlockTbm2,
                        countBlackBlockTbm3,
                        countRedBlockTbm3,
                        countBlackBlockTbm4,
                        countRedBlockTbm4,
                      }
                    }
                  />
                </div>
              </div>
            </div>

            <Tabs
              orientation='vertical'
              defaultValue={accountType === 'Superadmin' ? 'RPC1' : userRpc || 'all'}
              className='space-y-4'
            >
              <div className='w-full overflow-x-auto pb-2 text-center'>
                <TabsList>
                  {rpcOptions.map((rpc) => (
                    <TabsTrigger key={rpc.value} value={rpc.value}>
                      {rpc.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              {rpcOptions.map((rpc) => (
                <TabsContent key={rpc.value} value={rpc.value}>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-xl font-semibold flex align-middle items-center'>
                      <img width="30" height="30" src="https://img.icons8.com/stickers/30/problem-solving.png" alt="problem-solving" />
                      &nbsp;    Data Masalah PICA {rpc.label}
                    </h2>
                    <div className='flex items-center space-x-2'>
                      <button 
                        className='flex items-center rounded-md bg-cyan-600 px-2 py-1 text-white'
                        onClick={() => exportToExcel(
                          rpc.value !== 'all' 
                            ? awal.filter((x: any) => x.regional === rpc.value) 
                            : awal, 
                          selectedTbm
                        )}
                      >
                        <FaFileExcel className='mr-1' />
                        Export Excel
                      </button>
                    </div>
                  </div>
                  <hr className='my-2 border-cyan-400' />

                  <div>
                    <DataTable
                      data={rpc.value !== 'all' ? awal.filter((x: any) => x.regional === rpc.value) : awal}
                      columns={columns}
                    />
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </Layout.Body>
    </Layout>
  )
}