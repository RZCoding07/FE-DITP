import React, { useEffect, useState, useMemo } from 'react'
import { Controller } from 'react-hook-form'
import { Layout } from '@/components/custom/layout'
import { Button } from '@/components/custom/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Search } from '@/components/search'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ThemeSwitch from '@/components/theme-switch'
import { TopNav } from '@/components/top-nav'
import { UserNav } from '@/components/user-nav'
import { FcDoughnutChart, FcBarChart } from 'react-icons/fc'
import { IconPdf } from '@tabler/icons-react'
import cookie from 'js-cookie'
import { Player, Controls } from '@lottiefiles/react-lottie-player'
import { Summary } from '@/components/summary'
import Select from 'react-select'
import { useDashboardForm } from '@/hooks/use-dashboard-form'
import { fetchVegetativeProc, fetchKebun, fetchAfd } from '@/utils/api_immature'
import { TOP_NAV } from '@/utils/constants'
import { customStyles } from '@/styles/select-styles'
import { StockAnalysisChart } from '@/components/custom/horizontal-bar-chart'
import StockAnalysisChartArea from '@/components/custom/area-chart'
import { StockAnalysisChartKebun } from '@/components/custom/horizontal-kebun-bar-chart'
import { StockAnalysisChartKebunColor } from '@/components/custom/horizontal-kebun-bar-chart-color'
import StockAnalysisChartBar from '@/components/custom/bar-chart'
import DonutChartTbm from '@/components/custom/donut-chart-tbm'
import DonutChart from '@/components/custom/donut-chart'
import KuadranChart from '@/components/custom/kuadran'
import { Summary as STbm } from '@/components/summarytbm'
import * as XLSX from 'xlsx-js-style'
import toast from 'react-hot-toast'
import StackedBarChart from '@/components/custom/stacked-bar-chart'
import { FaEyeDropper, FaRecycle, FaSync } from 'react-icons/fa'
import { regionalKebunData } from '@/data/regional-kebun'
import { kebunAfdBlok } from '@/data/kebun-afd-blok'

export default function Dashboard() {
  const user = cookie.get('user')
  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'

  const {
    control,
    watch,
    setValue,
    errors,
    isSubmitting,
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

  const [countRedBlock, setCountRedBlock] = useState(0)
  const [countBlackBlock, setCountBlackBlock] = useState(0)

  // countRedBlock and countBlackBlock TBM 1 - 4
  const [countRedBlockTbm1, setCountRedBlockTbm1] = useState(0)
  const [countRedBlockTbm2, setCountRedBlockTbm2] = useState(0)
  const [countRedBlockTbm3, setCountRedBlockTbm3] = useState(0)
  const [countRedBlockTbm4, setCountRedBlockTbm4] = useState(0)

  const [countBlackBlockTbm1, setCountBlackBlockTbm1] = useState(0)
  const [countBlackBlockTbm2, setCountBlackBlockTbm2] = useState(0)
  const [countBlackBlockTbm3, setCountBlackBlockTbm3] = useState(0)
  const [countBlackBlockTbm4, setCountBlackBlockTbm4] = useState(0)

  function parseCSV(csvText: any) {
    const rows = csvText.split(/\r?\n/); // Split CSV text into rows, handling '\r' characters
    const headers = rows[0].split(','); // Extract headers (assumes the first row is the header row)
    const data = []; // Initialize an array to store parsed data
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(','); // Split the row, handling '\r' characters
      const rowObject: any = {}; // Initialize an object to store the row data
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
    }
    return data;
  }

  const [selectedRpc, setSelectedRpc] = useState('all')
  const [selectedKebun, setSelectedKebun] = useState({ value: '', label: '' })
  const [selectedAfd, setSelectedAfd] = useState('')

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

  const rpcOptions = [
    { value: 'all', label: 'Semua RPC' },
    { value: 'RPC1', label: 'RPC 1' },
    { value: 'RPC2', label: 'RPC 2' },
    { value: 'RPC3', label: 'RPC 3' },
    { value: 'RPC4', label: 'RPC 4' },
    { value: 'RPC5', label: 'RPC 5' },
    { value: 'RPC6', label: 'RPC 6' },
    { value: 'RPC7', label: 'RPC 7' },
    { value: 'RPC2N2', label: 'RPC2N2' },
    { value: 'RPC2N14', label: 'RPC2N14' },
  ]

  const [kebunOptions, setKebunOptions] = useState<{ value: string; label: string }[]>([])
  const [afdOptions, setAfdOptions] = useState<{ value: string; label: string }[]>([])
  const [scores, setScores] = useState<any[]>([])
  const [tbmRes, setTbmRes] = useState<any[]>([])
  const [isKebun, setIsKebun] = useState<boolean>(false)
  const [isAfd, setIsAfd] = useState<boolean>(false)
  const [isTbm, setIsTbm] = useState<boolean>(true)
  const [regionalBlackBlockCount, setRegionalBlackBlockCount] = useState<any>({})
  const [colorData, setColorData] = useState({
    emas: 0,
    hijau: 0,
    merah: 0,
    hitam: 0,
  })

  const [colorDataLuas, setColorDataLuas] = useState({
    emas: 0,
    hijau: 0,
    merah: 0,
    hitam: 0,
  })

  const [colorDataDonat, setColorDataDonat] = useState({
    emas: 0,
    hijau: 0,
    merah: 0,
    hitam: 0,
  })

  const [colorDataLuasDonat, setColorDataLuasDonat] = useState({
    emas: '',
    hijau: '',
    merah: '',
    hitam: ''
  })


  useEffect(() => {
    const fetchProcVegetatifDefault = async () => {

      try {
        // Reset all values to zero
        setTbmRes([]);  // reset tbmRes array
        setScores([]);  // reset scores array
        setColorData({
          hitam: 0,
          merah: 0,
          hijau: 0,
          emas: 0,
        });  // reset colorData
        setColorDataLuas({
          hitam: 0,
          merah: 0,
          hijau: 0,
          emas: 0,
        });  // reset colorDataLuas
        setTbmData({
          tbm1: 0,
          tbm2: 0,
          tbm3: 0,
          tbm4: 0,
        });  // reset tbmData
        setTbmDataScorePelepahBlok({
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        });  // reset tbmDataScorePelepahBlok
        setTbmDataScoreLingkarBlok({
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        });  // reset tbmDataScoreLingkarBlok

        const tbmResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const pokokSekarangResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const calJumlahPelepahResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const calLingkarBatangResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const avgPelepahResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const avgLingkarBatangResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const scoreLingkarBatangResults: {
          tbm1: {
            score100: number
            score90: number
            score80: number
            total: number
          }
          tbm2: {
            score100: number
            score90: number
            score80: number
            total: number
          }
          tbm3: {
            score100: number
            score90: number
            score80: number
            total: number
          }
        } = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        }

        const scoreJumlahPelepahResults: {
          tbm1: {
            score100: number
            score90: number
            score80: number
            total: number
          }
          tbm2: {
            score100: number
            score90: number
            score80: number
            total: number
          }
          tbm3: {
            score100: number
            score90: number
            score80: number
            total: number
          }
        } = {
          tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
          tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
        }

        const loader = toast.loading(`Memuat data untuk Keseluruhan TBM...`, {
          duration: 20000,
        })

        for (let i = 1; i < 5; i++) {
          const tahunTanam = tahun.value - i;
          const response = await fetchVegetativeProc({
            input_tbm: 'tbm' + i,
            input_tahun_tanam: tahunTanam,
          });

          setTbmRes((prev) => [...prev, Object.values(response.data)]);

          const regionalBlackBlockCount: { [key: string]: number } = {};

          const newScores = Object.values(response.data).map((item: any) => {
            let age = bulan.value * i;
            if (age > 36) {
              age = 36;
            }
            const blok = item.blok;
            const scoreLingkarBatang =
              getScoreLingkarBatang(age, parseFloat(item.lingkar_batang_cm)) * 0.4;
            const scoreJumlahPelepah =
              getScoreJumlahPelepah(age, parseFloat(item.jumlah_pelepah_bh)) * 0.2;

            const scoreTinggiBatang =
              getScoreTinggiTanaman(age, parseFloat(item.tinggi_tanaman_cm)) * 0.1;

            const scoreKerapatanPokok =
              getScoreKerapatanPokok(
                age,
                parseFloat(item.jumlah_pokok_awal_tanam),
                parseFloat(item.jumlah_pokok_sekarang)
              ) * 0.3;

            const totalSeleksian =
              scoreLingkarBatang +
              scoreJumlahPelepah +
              scoreTinggiBatang +
              scoreKerapatanPokok;

            let colorCategory = '';

            if (totalSeleksian < 80) {
              colorCategory = 'black';
              // Jika colorCategory adalah black, hitung berdasarkan regional
              const regional = item.regional;
              if (regionalBlackBlockCount[regional]) {
                regionalBlackBlockCount[regional] += 1;
              } else {
                regionalBlackBlockCount[regional] = 1;
              }
            } else if (totalSeleksian >= 80 && totalSeleksian < 90) {
              colorCategory = 'red';
            } else if (totalSeleksian >= 90 && totalSeleksian < 97) {
              colorCategory = 'green';
            } else if (totalSeleksian >= 97) {
              colorCategory = 'gold';
            }

            const luas = parseFloat(item.luas_ha);
            const regional = item.regional;
            const kebun = item.kebun;
            const lingkar = parseFloat(item.lingkar_batang_cm);
            const tinggi = parseFloat(item.tinggi_tanaman_cm);
            const jumPelepah = parseFloat(item.jumlah_pelepah_bh);

            // Menyimpan data ke state
            setScores((prev) => [
              ...prev,
              {
                [`tbm${i}`]: {
                  regional,
                  kebun,
                  afdeling: item.afdeling,
                  blok,
                  scoreLingkarBatang,
                  scoreJumlahPelepah,
                  scoreTinggiBatang,
                  scoreKerapatanPokok,
                  totalSeleksian,
                  colorCategory,
                  luas,
                  jumPelepah,
                },
              },
            ]);

            // Set color data untuk hitam, merah, hijau, emas
            setColorData((prev) => ({
              ...prev,
              hitam: totalSeleksian <= 80 ? prev.hitam + 1 : prev.hitam,
              merah: totalSeleksian > 80 && totalSeleksian <= 89 ? prev.merah + 1 : prev.merah,
              hijau: totalSeleksian > 89 && totalSeleksian <= 96 ? prev.hijau + 1 : prev.hijau,
              emas: totalSeleksian > 96 ? prev.emas + 1 : prev.emas,
            }));

            // Set color data luas per kategori
            setColorDataLuas((prev) => ({
              ...prev,
              hitam: totalSeleksian <= 80 ? prev.hitam + luas : prev.hitam,
              merah: totalSeleksian > 80 && totalSeleksian <= 89 ? prev.merah + luas : prev.merah,
              hijau: totalSeleksian > 89 && totalSeleksian <= 96 ? prev.hijau + luas : prev.hijau,
              emas: totalSeleksian > 96 ? prev.emas + luas : prev.emas,
            }));

            return {
              [`tbm${i}`]: {
                regional,
                blok,
                scoreLingkarBatang,
                scoreJumlahPelepah,
                scoreTinggiBatang,
                scoreKerapatanPokok,
                totalSeleksian,
                colorCategory,
                luas,
              },
            };
          });

          // Rekap jumlah blok hitam per regional
          setRegionalBlackBlockCount((prev: any) => ({
            ...prev,
            [`tbm${i}`]: regionalBlackBlockCount,
          }));

          // Menghitung total luas dan pokok untuk rekap
          const totalLuasHa: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.luas_ha),
            0
          );

          const totalPokokSekarang: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.jumlah_pokok_sekarang),
            0
          );

          const totalCalJumlahPelepah: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.cal_jumlah_pelepah),
            0
          );

          const totalCalLingkarBatang: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.cal_lingkar_batang),
            0
          );

          tbmResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalLuasHa;

          pokokSekarangResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalPokokSekarang;

          calJumlahPelepahResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalCalJumlahPelepah;

          calLingkarBatangResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalCalLingkarBatang;

          avgPelepahResults[`tbm${i as 1 | 2 | 3 | 4}`] =
            totalCalJumlahPelepah / totalPokokSekarang;

          avgLingkarBatangResults[`tbm${i as 1 | 2 | 3 | 4}`] =
            totalCalLingkarBatang / totalPokokSekarang;

          if (i < 4) {
            scoreJumlahPelepahResults[`tbm${i as 1 | 2 | 3}`] = {
              score100: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 100
              ).length,
              score90: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 90
              ).length,
              score80: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 80
              ).length,
              total: newScores.length,
            };

            scoreLingkarBatangResults[`tbm${i as 1 | 2 | 3}`] = {
              score100: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 100
              ).length,
              score90: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 90
              ).length,
              score80: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 80
              ).length,
              total: newScores.length,
            };
          }
        }

        setTbmData(tbmResults)
        setTbmDataScorePelepahBlok(scoreJumlahPelepahResults)
        setTbmDataScoreLingkarBlok(scoreLingkarBatangResults)
        toast.success('Seluruh data TBM berhasil ditampilkan!', {
          id: loader,
          duration: 2000,
        })
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (bulan && tahun) {
      fetchProcVegetatifDefault()
    }
  }, [bulan, tahun])



  const [selectedCard, setSelectedCard] = useState({
    type: 'all',
    name: 'Keseluruhan TBM',
    ctg: 'tbm-all',
    circular: '',
    val: 4,
  })

  const [selectedCardTbm, setSelectedCardTbm] = useState<any | null>(null)

  const [colorSummaryTbm, setColorSummaryTbm] = useState<any | null>(null)

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

  const handleCardClick = (cardData: any) => {
    // console.log('tbmRes', tbmRes)
    setSelectedCard(cardData) // Simpan parameter atau lakukan tindakan lainnya
    setValue('rpc', { value: 'all', label: 'Semua RPC' })
    setValue('kebun', null)
    setValue('afd', null)
    setIsKebun(false)
    setIsAfd(false)
  }

  const [isColorKebun, setisColorKebun] = useState<boolean>(false)

  const handleCardTbmClick = (cardData: any) => {
    setIsKebun(true)
    setisColorKebun(true)
    setColorSummaryTbm(cardData.circular)
  }

  const handleEventClick = (eventData: any) => {
    // console.log('tbmRes', tbmRes)
    setSelectedEvent(eventData) // Simpan parameter atau lakukan tindakan lainnya
    setValue('rpc', rpcOptions.find((item) => item.value === eventData.selectedCategory) || { value: '', label: '' })
    setIsKebun(true)
  }

  const handleResetClick = () => {
    {
      setSelectedCard({ type: '', name: 'Keseluruhan TBM', circular: '', ctg: 'tbm-all', val: 4 })
      setSelectedEvent(null)
      setIsKebun(false)
      setValue('rpc', { value: 'all', label: 'Semua RPC' })
      setValue('kebun', null)
      setValue('afd', null)

    }
  }



  let topNav: { title: string; href: string; isActive: boolean }[] = []

  if (account_type === 'Superadmin') {
    topNav = [
      {
        title: 'Nursery',
        href: '/dashboard-nursery',
        isActive: false,
      },
      {
        title: 'Replanting (TU/TK/TB)',
        href: '/dashboard-replanting',
        isActive: false,
      },
      {
        title: 'Immature',
        href: '/dashboard-immature',
        isActive: true,
      },
      {
        title: 'Monica',
        href: '/dashboard-monica',
        isActive: false,
      },
    ]
  } else {
    topNav = []
  }

  const getTbmWithColorCategoryEmas = (tbm: string) => {
    const filteredScores = scores.filter((score) => {
      const tbmKey = Object.keys(score)[0];
      return tbmKey === tbm && score[tbmKey].colorCategory === 'gold';
    });

    if (filteredScores.length > 0) {
      return filteredScores[0][tbm];
    }
    return null; // Jika tidak ada data yang sesuai
  };


  const [tbm1ColorCount, setTbm1ColorCount] = useState<any>({});
  const [tbm2ColorCount, setTbm2ColorCount] = useState<any>({});
  const [tbm3ColorCount, setTbm3ColorCount] = useState<any>({});
  const [tbm4ColorCount, setTbm4ColorCount] = useState<any>({});

  const [tbm1LuasByColor, setTbm1LuasByColor] = useState<any>({});
  const [tbm2LuasByColor, setTbm2LuasByColor] = useState<any>({});
  const [tbm3LuasByColor, setTbm3LuasByColor] = useState<any>({});
  const [tbm4LuasByColor, setTbm4LuasByColor] = useState<any>({});


  const [tbm1DataRegional, setTbm1DataRegional] = useState<any>({});
  const [tbm2DataRegional, setTbm2DataRegional] = useState<any>({});
  const [tbm3DataRegional, setTbm3DataRegional] = useState<any>({});
  const [tbm4DataRegional, setTbm4DataRegional] = useState<any>({});


  function sumLuasByColorCategory(data: any) {
    return data.reduce((acc: any, item: any) => {
      const color = item.colorCategory;
      acc[color] = (acc[color] || 0) + item.luas; // Menambahkan luas untuk colorCategory
      return acc;
    }, {});
  }


  // Fungsi untuk menghitung jumlah setiap colorCategory
  function countColorCategories(data: any) {
    return data.reduce((acc: any, item: any) => {
      const color = item.colorCategory;
      acc[color] = (acc[color] || 0) + 1; // Menambahkan jumlah untuk colorCategory
      return acc;
    }, {});
  }


  useEffect(() => {
    let score = scores
    let z = score.reduce((acc: any, x: any) => {
      const key = Object.keys(x)[0];
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(Object.values(x)[0]);
      return acc;
    }, {});

    // Mendapatkan data untuk setiap tbm
    let tbm1Data = z['tbm1'] ?? []
    let tbm2Data = z['tbm2'] ?? []
    let tbm3Data = z['tbm3'] ?? []
    let tbm4Data = z['tbm4'] ?? []

    // Menghitung jumlah untuk setiap colorCategory dalam setiap tbm
    let tbm1ColorCount = countColorCategories(tbm1Data);
    let tbm2ColorCount = countColorCategories(tbm2Data);
    let tbm3ColorCount = countColorCategories(tbm3Data);
    let tbm4ColorCount = countColorCategories(tbm4Data);

    // Menghitung total luas untuk setiap colorCategory dalam setiap tbm
    let tbm1LuasByColor = sumLuasByColorCategory(tbm1Data);
    let tbm2LuasByColor = sumLuasByColorCategory(tbm2Data);
    let tbm3LuasByColor = sumLuasByColorCategory(tbm3Data);
    let tbm4LuasByColor = sumLuasByColorCategory(tbm4Data);

    setTbm1ColorCount(tbm1ColorCount);
    setTbm2ColorCount(tbm2ColorCount);
    setTbm3ColorCount(tbm3ColorCount);
    setTbm4ColorCount(tbm4ColorCount);

    setTbm1LuasByColor(tbm1LuasByColor);
    setTbm2LuasByColor(tbm2LuasByColor);
    setTbm3LuasByColor(tbm3LuasByColor);
    setTbm4LuasByColor(tbm4LuasByColor);

    const rpcOpt = ["RPC1", "RPC2", "RPC3", "RPC4", "RPC5", "RPC6", "RPC7", "RPC2N2", "RPC2N14"]

    // buat tbm1Data rekap per regional
    let tbm1DataRegional =
      tbm1Data.reduce((acc: any, x: any) => {
        if (!acc[x.regional]) {
          acc[x.regional] = [];
        }
        acc[x.regional].push(x);
        return acc;
      }, {})

    tbm1DataRegional = rpcOpt.reduce((acc: any, x: any) => {
      // Jika tidak ada data untuk regional tertentu, isi dengan array 0 item
      if (!tbm1DataRegional[x]) {
        tbm1DataRegional[x] = [];
      }
      return acc;
    }, tbm1DataRegional);

    // buat tbm2Data rekap per regional
    let tbm2DataRegional =
      tbm2Data.reduce((acc: any, x: any) => {
        if (!acc[x.regional]) {
          acc[x.regional] = [];
        }
        acc[x.regional].push(x);
        return acc;
      }, {})

    tbm2DataRegional = rpcOpt.reduce((acc: any, x: any) => {
      // Jika tidak ada data untuk regional tertentu, isi dengan array 0 item
      if (!tbm2DataRegional[x]) {
        tbm2DataRegional[x] = [];
      }
      return acc;
    }
      , tbm2DataRegional);

    // buat tbm3Data rekap per regional
    let tbm3DataRegional =
      tbm3Data.reduce((acc: any, x: any) => {
        if (!acc[x.regional]) {
          acc[x.regional] = [];
        }
        acc[x.regional].push(x);
        return acc;
      }, {});

    tbm3DataRegional = rpcOpt.reduce((acc: any, x: any) => {
      // Jika tidak ada data untuk regional tertentu, isi dengan array 0 item
      if (!tbm3DataRegional[x]) {
        tbm3DataRegional[x] = [];
      }
      return acc;
    }
      , tbm3DataRegional);

    // buat tbm4Data rekap per regional
    let tbm4DataRegional =
      tbm4Data.reduce((acc: any, x: any) => {
        if (!acc[x.regional]) {
          acc[x.regional] = [];
        }
        acc[x.regional].push(x);
        return acc;
      }, {});

    tbm4DataRegional = rpcOpt.reduce((acc: any, x: any) => {
      // Jika tidak ada data untuk regional tertentu, isi dengan array 0 item
      if (!tbm4DataRegional[x]) {
        tbm4DataRegional[x] = [];
      }
      return acc;
    }
      , tbm4DataRegional);


    setTbm1DataRegional(tbm1DataRegional);
    setTbm2DataRegional(tbm2DataRegional);
    setTbm3DataRegional(tbm3DataRegional);
    setTbm4DataRegional(tbm4DataRegional);


  }, [selectedCard, scores])

  const rpcValue = watch('rpc')?.value


  const distinctKebunByRPC = useMemo(() => {
    if (rpcValue !== 'all') {
      return scores.filter((score) => {
        const key = Object.keys(score)[0];
        return score[key].regional === rpcValue;
      });
    }
    return [];
  }, [rpcValue, selectedCard.name, scores]);

  const distinctCategories = useMemo(() => {
    return [...new Set(distinctKebunByRPC.map((item: any) => item[Object.keys(item)[0]].kebun))];
  }, [distinctKebunByRPC]);

  const countBlok = useMemo(() => {
    return distinctCategories.map((category: any) => {
      return {
        category: category,
        filter: distinctKebunByRPC.filter((item: any) => item[Object.keys(item)[0]].kebun === category).length
      };
    });
  }, [distinctCategories, distinctKebunByRPC]);

  const sumLuasBlok = useMemo(() => {
    return distinctCategories.map((category: any) => {
      return {
        category: category,
        filter:
          (distinctKebunByRPC.filter((item: any) => item[Object.keys(item)[0]].kebun === category)
            .reduce((acc: any, curr: any) => acc + curr[Object.keys(curr)[0]].luas, 0)).toFixed(2)
      };
    });
  }, [distinctCategories, distinctKebunByRPC]);


  const [emasColorCountKebun, setEmasColorCountKebun] = useState<any>({});
  const [hijauColorCountKebun, setHijauColorCountKebun] = useState<any>({});
  const [merahColorCountKebun, setMerahColorCountKebun] = useState<any>({});
  const [hitamColorCountKebun, setHitamColorCountKebun] = useState<any>({});


  const [emasLuasByColorKebun, setEmasLuasByColorKebun] = useState<any>({});
  const [hijauLuasByColorKebun, setHijauLuasByColorKebun] = useState<any>({});
  const [merahLuasByColorKebun, setMerahLuasByColorKebun] = useState<any>({});
  const [hitamLuasByColorKebun, setHitamLuasByColorKebun] = useState<any>({});




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


  useEffect(() => {
    if (rpcValue !== 'all') {

      if (selectedCard.val < 4) {
        const distinctByTbm = scores.filter(score => Object.keys(score)[0] === selectedCard.ctg);
        const distinctByRegional = distinctByTbm.filter(score => score[Object.keys(score)[0]].regional === rpcValue);
        const countByColor = (color: string) => {
          const distincKebunByReg = distinctByRegional.map(item => item[Object.keys(item)[0]].kebun);
          let sumColor: { [key: string]: number } = {};
          let sumLuas: { [key: string]: number } = {};
          sumColor[color] = 0;
          sumLuas[color] = 0;
          let data = [...new Set(distincKebunByReg)].map(kebun => {
            const filteredItems = distinctByRegional.filter(item => item[Object.keys(item)[0]].kebun === kebun && item[Object.keys(item)[0]].colorCategory === color);
            const colorCount = filteredItems.length;
            const luasSum = filteredItems.reduce((acc, curr) => acc + curr[Object.keys(curr)[0]].luas, 0);
            sumColor[color] += colorCount;
            sumLuas[color] += luasSum;
            return {
              category: kebun,
              sumColor: sumColor[color],  // This should now safely return the correct value
              sumLuas: sumLuas[color].toFixed(2),  // Ensure it's a fixed-point number
              filterBlok: distinctByRegional.filter(item => item[Object.keys(item)[0]].kebun === kebun && item[Object.keys(item)[0]].colorCategory === color).length,
              filterLuas: distinctByRegional.filter(item => item[Object.keys(item)[0]].kebun === kebun && item[Object.keys(item)[0]].colorCategory === color).reduce((acc, curr) => acc + curr[Object.keys(curr)[0]].luas, 0).toFixed(2),
            };
          });
          return data;
        };


        const sumLuasByColor = (color: any) => {
          return distinctKebunByRPC
            .filter(item => item[Object.keys(item)[0]].colorCategory === color)
            .reduce((acc, curr) => acc + curr[Object.keys(curr)[0]].luas, 0)
            .toFixed(2);
        };

        const emasSumColor = countByColor('gold') ?? [];
        const hijauSumColor = countByColor('green') ?? [];
        const merahSumColor = countByColor('red') ?? [];
        const hitamSumColor = countByColor('black') ?? [];
        setEmasColorCountKebun(emasSumColor);
        setHijauColorCountKebun(hijauSumColor);
        setMerahColorCountKebun(merahSumColor);
        setHitamColorCountKebun(hitamSumColor);



        // Menggunakan optional chaining
        const emasSumColorLuas = emasSumColor?.[emasSumColor.length - 1]?.sumLuas ?? 0;
        const hijauSumColorLuas = hijauSumColor?.[hijauSumColor.length - 1]?.sumLuas ?? 0;
        const merahSumColorLuas = merahSumColor?.[merahSumColor.length - 1]?.sumLuas ?? 0;
        const hitamSumColorLuas = hitamSumColor?.[hitamSumColor.length - 1]?.sumLuas ?? 0;

        // get sumColor last index with default 0
        const emasSumColorLast = emasSumColor?.[emasSumColor.length - 1]?.sumColor ?? 0;
        const hijauSumColorLast = hijauSumColor?.[hijauSumColor.length - 1]?.sumColor ?? 0;
        const merahSumColorLast = merahSumColor?.[merahSumColor.length - 1]?.sumColor ?? 0;
        const hitamSumColorLast = hitamSumColor?.[hitamSumColor.length - 1]?.sumColor ?? 0;

        setColorDataDonat({
          emas: emasSumColorLast,
          hijau: hijauSumColorLast,
          merah: merahSumColorLast,
          hitam: hitamSumColorLast,
        });

        setColorDataLuasDonat({
          emas: emasSumColorLuas,
          hijau: hijauSumColorLuas,
          merah: merahSumColorLuas,
          hitam: hitamSumColorLuas,
        });


        const distinctCategories = [...new Set(distinctByRegional.map(item => item[Object.keys(item)[0]].kebun))];

        const countBlok = distinctCategories.map(category => ({
          category,
          filter: distinctByRegional.filter(item => item[Object.keys(item)[0]].kebun === category).length
        }));

        const sumLuasBlok = distinctCategories.map(category => ({
          category,
          filter: distinctByRegional
            .filter(item => item[Object.keys(item)[0]].kebun === category)
            .reduce((acc, curr) => acc + curr[Object.keys(curr)[0]].luas, 0)
            .toFixed(2)
        }));

        const name = selectedCard.val === 3 ? 'TBM > 3' : `TBM ${selectedCard.val + 1}`;

        setIsTbm(false);


        handleEventClick({
          name,
          value: selectedCard.val,
          color: selectedCard.circular,
          categories: distinctCategories,
          allData: tbmRes[selectedCard.val],
          countBlok,
          sumLuasBlok,
          selectedCategory: rpcValue
        });
      } else {
        setIsTbm(true);
      }
    } else {
      setIsTbm(true);

      if (selectedCard.name === 'Keseluruhan TBM') {
        handleResetClick();
      } else {
        setIsKebun(false);
      }
    }
  }, [rpcValue, selectedCard, scores, distinctCategories, countBlok, sumLuasBlok]);


  const getDataScoreAll = (tbm: string) => {
    const filteredScores = scores.filter((score) => {
      const tbmKey = Object.keys(score)[0];
      return tbmKey === tbm;
    });

    if (filteredScores.length > 0) {
      return filteredScores;
    }
    return null; // Jika tidak ada data yang sesuai
  }

  const handleRpcChange = (selectedOption: any) => {
    setSelectedRpc(selectedOption.value);
    const selectedRegional = regionalKebunData.regionals.find(
      (regional) => regional.name === selectedOption.value
    );
    setValue('kebun', null);
    setKebunOptions(
      selectedRegional ? selectedRegional.kebuns.map((kebun) => ({ value: kebun, label: kebun })) : []
    );
  };


  const [countAfdBlok, setCountAfdBlok] = useState<any[]>([])
  const [sumLuasAfdBlok, setSumLuasAfdBlok] = useState<any[]>([])

  const handleKebunChange = (selectedOption: any) => {
    setSelectedKebun(selectedOption)
    const getAfdelingByKebun = (kebun: string) => {
      const afdelingSet = new Set(
        kebunAfdBlok.filter(item => item.kebun === kebun).map(item => item.afdeling)
      );
      return Array.from(afdelingSet);
    };

    setSelectedKebun(selectedOption);

    const availableAfdeling = getAfdelingByKebun(selectedOption.value);
    const afdelingOptions = availableAfdeling.map(afd => ({ value: afd, label: afd }));
    setValue('afd', null);
    setAfdOptions(afdelingOptions);

    const tbmResults = tbmRes[selectedCard.val]

    const hasilBanyak = tbmResults.filter((item: { kebun: any }) => item.kebun === selectedOption.value)

    // distinc afdeling
    const distinctAfd = [...new Set(hasilBanyak.map((item: any) => item.afdeling))];

    // count afdeling blok
    const countAfd = distinctAfd.map((category: any) => {
      return {
        category: category,
        filter: hasilBanyak.filter((item: any) => item.afdeling === category).length
      };
    });

    // sum luas afdeling blok
    const sumLuasAfd = distinctAfd.map((category: any) => {
      return {
        category: category,
        filter: hasilBanyak
          .filter((item: any) => item.afdeling === category)
          .reduce((acc: number, curr: any) => {
            const luas = parseFloat(curr.luas_ha) || 0; // Pastikan hanya angka valid yang dijumlahkan
            return acc + luas;
          }, 0)
          .toFixed(2)
      };
    });


    setSelectedEvent({
      name: selectedOption.label,
      value: selectedOption.value,
      color: selectedCard.circular,
      categories: distinctAfd,
      allData: tbmResults,
      countBlok: countAfd,
      sumLuasBlok: sumLuasAfd,
      selectedCategory: selectedRpc
    });

    setCountAfdBlok(countAfd);
    setSumLuasAfdBlok(sumLuasAfd);


  }


  const handleAfdChange = (selectedOption: any) => {
    setSelectedAfd(selectedOption)
    const tbmResults = tbmRes[selectedCard.val]
    
    const rpc = selectedRpc
    const kebun = selectedKebun.value

    const hasilBanyak = tbmResults.filter((item: any) => item.regional === rpc && item.kebun === kebun && item.afdeling === selectedOption.value)
    const distinctBlok = [...new Set(hasilBanyak.map((item: any) => item.blok))];
    const countBlok = distinctBlok.map((category: any) => {
      return {
        category: category,
        filter: hasilBanyak.filter((item: any) => item.blok === category).length
      };
    });

    const sumLuasBlok = distinctBlok.map((category: any) => {
      return {
        category: category,
        filter: hasilBanyak
          .filter((item: any) => item.blok === category)
          .reduce((acc: number, curr: any) => {
            const luas = parseFloat(curr.luas_ha) || 0; // Pastikan hanya angka valid yang dijumlahkan
            return acc + luas;
          }, 0)
          .toFixed(2)
      };
    });

    setSelectedEvent({
      name: selectedOption.label,
      value: selectedOption.value,
      color: selectedCard.circular,
      categories: distinctBlok,
      allData: tbmResults,
      countBlok: countBlok,
      sumLuasBlok: sumLuasBlok,
      selectedCategory: selectedRpc
    });

    setCountAfdBlok(countBlok);
    setSumLuasAfdBlok(sumLuasBlok)
  }

  const [isColorGraphVisible, setIsColorGraphVisible] = useState(true);

  const handleHideColorGraph = () => {
    setisColorKebun(false); // Hide the color graph
    setIsColorGraphVisible((prev) => !prev); // Toggle the visibility
  };

  const handleDownload = () => {
    // Menampilkan toast loading
    const loadingToast = toast.loading('Downloading... Please wait!', {
      position: 'top-right',
    });

    // Menyusun data dalam format array yang bisa digunakan untuk XLSX
    const headers = ["Jenis TBM", "Regional", "Kebun", "Afdeling", "Blok", "Luasan", "Jumlah Pelepah", "Score Lingkar Batang", "Score Jumlah Pelepah", "Score Tinggi Batang", "Score Kerapatan Pokok", "Total Seleksian", "Kategori Warna"];

    // Mengonversi data menjadi array 2D
    const data = scores.map((item) => {
      let key = Object.keys(item)[0];
      const data = item[key];
      if (key === 'tbm4') {
        key = 'TBM > 3'
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
      ];
    });



    // Create the worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);

    // Styling the header
    const headerStyle = {
      fill: {
        fgColor: { rgb: "10CCAD" }, // Background color for header
      },
      font: {
        color: { rgb: "FFFFFF" }, // White font for header
        bold: true,
      },
    };

    // Apply header styles (for the first row)
    ws['A1'].s = headerStyle;
    ws['B1'].s = headerStyle;
    ws['C1'].s = headerStyle;
    ws['D1'].s = headerStyle;
    ws['E1'].s = headerStyle;
    ws['F1'].s = headerStyle;
    ws['G1'].s = headerStyle;
    ws['H1'].s = headerStyle;
    ws['I1'].s = headerStyle;
    ws['J1'].s = headerStyle;
    ws['K1'].s = headerStyle;
    ws['L1'].s = headerStyle;
    ws['M1'].s = headerStyle;

    // Custom background color for "Kategori Warna"
    const colorMapping: any = {
      'gold': 'FFA500',
      'green': '00a300',
      'red': 'FF0000',
      'black': '000000'
    };

    // Apply background color for "Kategori Warna" column (column K, index 10)
    data.forEach((row, rowIndex) => {
      const color = row[12]?.toLowerCase(); // Access the Kategori Warna value (column 10)
      if (colorMapping[color]) {
        const cellRef = XLSX.utils.encode_cell({ r: rowIndex + 1, c: 12 }); // Row index is +1 because of header
        ws[cellRef] = ws[cellRef] || {}; // Ensure the cell exists
        ws[cellRef].s = {
          fill: {
            fgColor: { rgb: colorMapping[color] }, // Set background color
          },
          font: {
            color: { rgb: "FFFFFF" }, // White font for header
            bold: true,
          },
        };
      }
    });

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // Menyimpan file excel
    XLSX.writeFile(wb, `Hasil Seleksi TBM Bulan ${bulan.label} Tahun ${tahun.label}.xlsx`);

    // Menutup toast loading dan menampilkan toast selesai
    toast.loading('Downloading... Please wait!', {
      id: loadingToast,
      duration: 2000,
    });
  };


  return (
    <Layout>
      <Layout.Header>
        <TopNav links={topNav} />
        <div className='ml-auto flex items-center space-x-4'>
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

        {/* <WelcomeBanner /> */}
        <br />

        <Summary
          dataProps={{
            tbm1DataRegional,
            tbm2DataRegional,
            tbm3DataRegional,
            tbm4DataRegional,
            tbmData,
            tbmDataScorePelepahBlok,
            tbmDataScoreLingkarBlok,
            data: colorData,
            dataLuas: colorDataLuas,
            score: scores,
            dataTbm: {
              ...tbmData,
              tahun: watch('tahun'),
            },
          }}
          onCardClick={handleCardClick}
        />

        <>
          <div className='w-full items-center align-middle'>

            {selectedCard.type === 'color' && (
              <>
                <div className='items-center justify-center align-middle mr-4'>
                  <div className='mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                    <div className='flex justify-between align-middle items-center'>
                      <h2 className='text-2xl font-semibold'>
                        Grafik Rincian {selectedCard.name}
                      </h2>

                      <Button
                        variant={'secondary'}
                        onClick={handleResetClick}
                        className='flex items-center rounded-full'
                      >
                        <img
                          width='20'
                          height='20'
                          src='https://img.icons8.com/external-beshi-flat-kerismaker/28/external-Hide-user-interface-beshi-flat-kerismaker.png'
                          alt='external-Hide-user-interface-beshi-flat-kerismaker'
                        />{' '}
                        <span className='ml-2'>Hide Chart</span>
                      </Button>

                    </div>
                    <hr className='my-2 mt-4 border-cyan-400' />

                    <div className='mt-5 grid lg:grid-cols-2 gap-5 sm:grid-cols-1'>
                      <StockAnalysisChart
                        dataprops={{
                          rpc,
                          kebun,
                          afd,
                          dataset: tbmRes,
                          untuk: 'Total Luasan',
                          score: scores,
                          title: selectedCard.name,
                          color: selectedCard.circular,
                          val: selectedCard.val,
                        }}
                        onEventClick={handleEventClick}
                      />
                      <StockAnalysisChart
                        dataprops={{
                          rpc,
                          kebun,
                          afd,
                          dataset: tbmRes,
                          untuk: 'Total Blok',
                          score: scores,
                          title: selectedCard.name,
                          color: selectedCard.circular,
                          val: selectedCard.val,
                        }}
                        onEventClick={handleEventClick}
                      />
                    </div>
                  </div>
                </div>
              </>
            )}
            {selectedCard.type !== 'color' && (

              <>

                <div className="grid sm:grid-cols-1 lg:grid-cols-[53%_47%] mt-5">
                  <h2 className='text-2xl font-bold mt-3'>
                    PICA Cluster {selectedCard.name} {' '}
                    {rpc ? ' - ' + rpc.label : ''} {kebun ? ' - ' + kebun.label : ''}{' '}
                    {afd ? ' - ' + afd.label : ''}
                    <strong>
                      &nbsp; (  {bulan ? bulan.label : ''} {tahun ? tahun.label : ''} )
                    </strong>
                  </h2>
                  <div className='flex gap-3 mt-1'>
                    <Controller
                      name='rpc'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          styles={customStyles}
                          placeholder='Pilih RPC'
                          isSearchable
                          options={rpcOptions}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption); // Update form value
                            handleRpcChange(selectedOption); // Custom handler function
                          }}
                        />
                      )}
                    />

                    <Controller
                      name='kebun'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}

                          styles={customStyles}
                          placeholder='Pilih Kebun'
                          isSearchable
                          options={kebunOptions}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption); // Update form value
                            handleKebunChange(selectedOption); // Custom handler function]
                          }
                          }
                        />
                      )}
                    />

                    <Controller
                      name='afd'
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          styles={customStyles}
                          placeholder='Pilih Afdeling'
                          isSearchable
                          options={afdOptions}
                          onChange={(selectedOption) => {
                            field.onChange(selectedOption); // Update form value
                            handleAfdChange(selectedOption); // Custom handler function]
                          }
                          }
                        />
                      )}
                    />

                    <Button className='flex items-center rounded-full'
                      onClick={() => {
                        setSelectedCard({ type: '', name: 'Keseluruhan TBM', circular: '', ctg: 'tbm-all', val: 0 })
                        setSelectedEvent(null)
                        setIsKebun(false)
                        setValue('rpc', { value: 'all', label: 'Semua RPC' })
                        setValue('kebun', null)
                        setValue('afd', null)
                      }}
                    >
                      <FaSync style={{ animation: 'spin 8s linear infinite' }} />
                    </Button>


                    <div className='-ml-5 flex'>

                      <h2 className='text-lg mt-1 ml-5 mr-2'>Sortir berdasarkan : </h2>
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


                </div>

                <div className="grid sm:grid-cols-1 lg:grid-cols-[40%_60%]" >
                  <div className='items-center justify-center align-middle lg:mr-4'>
                    <div className='mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                      <h2 className='text-xl font-semibold'>Rekapitulasi  {blok ? blok.label : 'Blok'} {selectedCard.name}
                      </h2>
                      <hr className='my-2 border-cyan-400' />
                      <div className="grid lg:grid-cols-1">
                        <div className="grid sm:grid-cols-1 lg:grid-cols-[40%_60%]">
                          <p className='text-xs font-semibold text-cyan-300 -mb-9                                            '>
                            *Grafik Per {blok ? blok.label : 'Blok'}<br />
                            <strong>
                              &nbsp; (  {bulan ? bulan.label : ''} {tahun ? tahun.label : ''} )
                            </strong>
                          </p>
                          <p className='float-end text-end text-sm font-semibold text-cyan-300 -mb-5'>

                            {rpc ? rpc.label : ''} {kebun ? ' - ' + kebun.label : ''}{' '}
                            {afd ? ' - ' + afd.label : ''}

                          </p>
                        </div>
                        <DonutChartTbm
                          dataprops={{
                            rpc: watch('rpc'),
                            data: colorData,
                            dataLuas: colorDataLuas,
                            dataDnt: colorDataDonat,
                            dataLuasDnt: colorDataLuasDonat,
                            tbm1ColorCount,
                            tbm2ColorCount,
                            tbm3ColorCount,
                            tbm4ColorCount,
                            tbm1LuasByColor,
                            tbm2LuasByColor,
                            tbm3LuasByColor,
                            tbm4LuasByColor,
                            blok: blok ? blok.value : 'blok',
                            ctg: selectedCard.ctg,
                            title: selectedCard.name,

                          }} />
                        <div>
                          <STbm
                            dataProps={{
                              tbmData,
                              rpc: watch('rpc'),
                              data: colorData,
                              dataLuas: colorDataLuas,
                              dataDnt: colorDataDonat,
                              dataLuasDnt: colorDataLuasDonat,
                              score: scores,
                              tbm1ColorCount,
                              tbm2ColorCount,
                              tbm3ColorCount,
                              tbm4ColorCount,
                              tbm1LuasByColor,
                              tbm2LuasByColor,
                              tbm3LuasByColor,
                              tbm4LuasByColor,
                              ctg: selectedCard.ctg,
                              title: selectedCard.name,

                              dataTbm: {
                                ...tbmData,
                                tahun: watch('tahun'),
                              },
                            }}
                            onCardTbmClick={handleCardTbmClick}
                          />
                        </div>
                      </div>
                    </div>

                  </div>

                  <div className='items-center justify-center align-middle'>

                    <div className='mt-5'>
                      <div className='items-center justify-center align-middle'>
                        <div className='mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                          <div className="grid lg:grid-cols-1">

                            {isKebun === false && isAfd == false && (
                              <>
                                {blok && blok.value === 'blok' && (
                                  <StockAnalysisChart
                                    dataprops={{
                                      dataset: tbmRes,
                                      untuk: 'Total Blok',
                                      score: scores,
                                      rpc: rpc,
                                      kebun: kebun,
                                      afd: afd,
                                      ctg: selectedCard.ctg,
                                      title: selectedCard.name,
                                      color: selectedCard.circular,
                                      val: selectedCard.val,
                                    }}
                                    onEventClick={handleEventClick}
                                  />
                                )}

                                {blok && blok.value === 'luasan' && (
                                  <StockAnalysisChart
                                    dataprops={{
                                      dataset: tbmRes,
                                      untuk: 'Total Luasan',
                                      score: scores,
                                      ctg: selectedCard.ctg,
                                      rpc: rpc,
                                      kebun: kebun,
                                      afd: afd,
                                      title: selectedCard.name,
                                      color: selectedCard.circular,
                                      val: selectedCard.val,
                                    }}
                                    onEventClick={handleEventClick}
                                  />
                                )}
                              </>

                            )}

                            {selectedEvent && isKebun && (
                              <>

                                {blok && blok.value === 'luasan' && isColorKebun == false && (
                                  <>
                                    <StockAnalysisChartKebun
                                      dataprops={{
                                        rpc,
                                        kebun,
                                        afd,
                                        datasets: tbmRes,
                                        score: scores,
                                        dataset: selectedEvent.sumLuasBlok,
                                        untuk: 'Total Luasan',
                                        categories: selectedEvent.categories,
                                        title: selectedEvent.name,
                                        color: selectedEvent.color,
                                        val: selectedCard.val,
                                        category: selectedEvent.selectedCategory,
                                      }}
                                      onEventClick={handleEventClick}
                                    />

                                  </>
                                )}
                                {blok && blok.value === 'luasan' && isColorKebun == true && (
                                  <>
                                    <StockAnalysisChartKebunColor
                                      isColorGraphVisible={isColorGraphVisible}  // Passing visibility prop
                                      onHideColorGraph={handleHideColorGraph}  // Passing toggle function
                                      dataprops={{
                                        rpc,
                                        kebun,
                                        afd,
                                        blok,
                                        datasets: tbmRes,
                                        score: scores,
                                        color: colorSummaryTbm,
                                        dataset: colorSummaryTbm == 'gold' ? emasColorCountKebun : colorSummaryTbm == 'green' ? hijauColorCountKebun : colorSummaryTbm == 'red' ? merahColorCountKebun : hitamColorCountKebun,
                                        untuk: 'Total Luasan',
                                        categories: selectedEvent.categories,
                                        title: selectedEvent.name,
                                        val: selectedCard.val,
                                        category: selectedEvent.selectedCategory,
                                      }}
                                      onEventClick={handleEventClick}
                                    />
                                  </>
                                )}

                                {blok && blok.value === 'blok' && isColorKebun == false && (
                                  <StockAnalysisChartKebun
                                    dataprops={{
                                      rpc,
                                      kebun,
                                      afd,
                                      datasets: tbmRes,
                                      score: scores,
                                      dataset: selectedEvent.countBlok,
                                      categories: selectedEvent.categories,
                                      untuk: 'Total Blok',
                                      title: selectedEvent.name,
                                      color: selectedEvent.color,
                                      val: selectedCard.val,
                                      category: selectedEvent.selectedCategory,
                                    }}
                                    onEventClick={handleEventClick}
                                  />

                                )}


                                {blok && blok.value === 'blok' && isColorKebun == true && (
                                  <StockAnalysisChartKebunColor
                                    isColorGraphVisible={isColorGraphVisible}  // Passing visibility prop
                                    onHideColorGraph={handleHideColorGraph}  // Passing toggle function
                                    dataprops={{
                                      rpc,
                                      kebun,
                                      afd,
                                      blok,
                                      datasets: tbmRes,
                                      score: scores,
                                      color: colorSummaryTbm,
                                      dataset: colorSummaryTbm == 'gold' ? emasColorCountKebun : colorSummaryTbm == 'green' ? hijauColorCountKebun : colorSummaryTbm == 'red' ? merahColorCountKebun : hitamColorCountKebun,
                                      untuk: 'Total Blok',
                                      categories: selectedEvent.categories,
                                      title: selectedEvent.name,
                                      val: selectedCard.val,
                                      category: selectedEvent.selectedCategory,
                                    }}
                                    onEventClick={handleEventClick}
                                  />)}



                              </>

                            )}

                            {isKebun == false && isAfd == true && (
                              <>

                                {blok && blok.value === 'luasan' && isColorKebun == false && (
                                  <>
                                    <StockAnalysisChartKebun
                                      dataprops={{
                                        rpc,
                                        kebun,
                                        afd,
                                        datasets: tbmRes,
                                        score: scores,
                                        dataset: sumLuasAfdBlok,
                                        untuk: 'Total Luasan',
                                        categories: selectedEvent.categories,
                                        title: selectedEvent.name,
                                        color: selectedEvent.color,
                                        val: selectedCard.val,
                                        category: selectedEvent.selectedCategory,
                                      }}
                                      onEventClick={handleEventClick}
                                    />

                                  </>
                                )}
                                {blok && blok.value === 'luasan' && isColorKebun == true && (
                                  <>
                                    <StockAnalysisChartKebunColor
                                      isColorGraphVisible={isColorGraphVisible}  // Passing visibility prop
                                      onHideColorGraph={handleHideColorGraph}  // Passing toggle function
                                      dataprops={{
                                        rpc,
                                        kebun,
                                        afd,
                                        blok,
                                        datasets: tbmRes,
                                        score: scores,
                                        color: colorSummaryTbm,
                                        dataset: colorSummaryTbm == 'gold' ? emasColorCountKebun : colorSummaryTbm == 'green' ? hijauColorCountKebun : colorSummaryTbm == 'red' ? merahColorCountKebun : hitamColorCountKebun,
                                        untuk: 'Total Luasan',
                                        categories: selectedEvent.categories,
                                        title: selectedEvent.name,
                                        val: selectedCard.val,
                                        category: selectedEvent.selectedCategory,
                                      }}
                                      onEventClick={handleEventClick}
                                    />
                                  </>
                                )}

                                {blok && blok.value === 'blok' && isColorKebun == false && (
                                  <StockAnalysisChartKebun
                                    dataprops={{
                                      rpc,
                                      kebun,
                                      afd,
                                      datasets: tbmRes,
                                      score: scores,
                                      dataset: countAfdBlok,
                                      categories: selectedEvent.categories,
                                      untuk: 'Total Blok',
                                      title: selectedEvent.name,
                                      color: selectedEvent.color,
                                      val: selectedCard.val,
                                      category: selectedEvent.selectedCategory,
                                    }}
                                    onEventClick={handleEventClick}
                                  />

                                )}


                                {blok && blok.value === 'blok' && isColorKebun == true && (
                                  <StockAnalysisChartKebunColor
                                    isColorGraphVisible={isColorGraphVisible}  // Passing visibility prop
                                    onHideColorGraph={handleHideColorGraph}  // Passing toggle function
                                    dataprops={{
                                      rpc,
                                      kebun,
                                      afd,
                                      blok,
                                      datasets: tbmRes,
                                      score: scores,
                                      color: colorSummaryTbm,
                                      dataset: colorSummaryTbm == 'gold' ? emasColorCountKebun : colorSummaryTbm == 'green' ? hijauColorCountKebun : colorSummaryTbm == 'red' ? merahColorCountKebun : hitamColorCountKebun,
                                      untuk: 'Total Blok',
                                      categories: selectedEvent.categories,
                                      title: selectedEvent.name,
                                      val: selectedCard.val,
                                      category: selectedEvent.selectedCategory,
                                    }}
                                    onEventClick={handleEventClick}
                                  />)}



                              </>

                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="grid">
                  <div className='items-center justify-center align-middle'>
                    <div className='mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
                      <div className='w-full items-center align-middle'>
                        <div className='flex justify-between'>
                          <h2 className='text-xl font-semibold'>
                            Result Problem Identification & Corrective Action {selectedCard.name}
                          </h2>

                        </div>
                      </div>
                      <hr className='my-3 border-cyan-400' />

                      <div className='items-center justify-center align-middle mr-4'>
                        <div className='mt-5 rounded-lg border border-cyan-500 bg-white p-3 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-cyan-700 dark:to-cyan-600'>
                          <div className='flex justify-between align-middle items-center'>
                            <h2 className='text-xl font-semibold'>
                              Total {blok.label} Merah Hitam {selectedCard.name}
                            </h2>

                          </div>
                          <hr className='my-2 mt-4 border-cyan-400' />

                          <div className='mt-5 grid lg:grid-cols-1 sm:grid-cols-1'>
                            <StockAnalysisChartBar
                              dataProps={
                                {
                                  rpc,
                                  kebun,
                                  afd,
                                  blok,
                                  ctg: selectedCard.ctg,
                                  title: selectedCard.name,
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
                            {/* <KuadranChart /> */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


              </>

            )}
          </div>
        </>

      </Layout.Body>
    </Layout >
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
  fullname: any
  tahunOptions: any
  bulanOptions: any
  defaultTahun: any
  defaultBulan: any
  onDownload: any
}) {
  return (
    <div className='mb-2 flex items-center justify-between space-y-2 '>
      <div className='flex items-center space-x-2 '>
        <FcDoughnutChart
          size={40}
          style={{ animation: 'spin 4s linear infinite' }}
        />
        <h1 className='text-2xl font-bold tracking-tight'>
          Dashboard PICA TBM
        </h1>
      </div>
      <h1>Hi, Welcome back {fullname}👋</h1>
      <div className='lg:flex sm:grid sm:grid-cols-1 items-center space-x-2'>
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

        <Button className='flex items-center rounded-full'
          variant={'secondary'}
        >
          Download
          <IconPdf size={20} className='ml-2 bg-red-500 text-white' />
        </Button>

        <Button
          onClick={() => {
            onDownload()
          }}
          className='flex items-center rounded-full'
        >

          <span className='ml-2'>Export Excel</span>

          &nbsp;

          <img width="28" height="28" src="https://img.icons8.com/fluency/28/microsoft-excel-2019.png" alt="microsoft-excel-2019" />

        </Button>

      </div>
    </div>
  )
}

function WelcomeBanner() {
  return (
    <div className='py-5'>
      <div className='rounded-xl bg-gradient-to-r from-blue-500 via-green-500 to-green-500 p-6 py-5 shadow-lg'>
        <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
          <div>
            <h4 className='text-2xl font-bold text-white'>
              Selamat Datang Di PICA TBM
            </h4>
            <p className='text-white'>
              Problem Identification & Corrective Action TBM PT Perkebunan
              Nusantara IV
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


function getScoreLingkarBatang(age: any, value: any) {
  // Input validation
  if (age < 1 || age > 36) {
    console.log(age)
    return 0
  }

  const thresholds: any = {
    1: { score100: 51, score90: [46, 50], score80: 46 },
    2: { score100: 64, score90: [58, 63], score80: 58 },
    3: { score100: 77, score90: [69, 76], score80: 69 },
    4: { score100: 90, score90: [81, 89], score80: 81 },
    5: { score100: 103, score90: [93, 102], score80: 93 },
    6: { score100: 116, score90: [104, 115], score80: 104 },
    7: { score100: 122, score90: [109, 121], score80: 109 },
    8: { score100: 127, score90: [114, 126], score80: 114 },
    9: { score100: 133, score90: [120, 132], score80: 120 },
    10: { score100: 138, score90: [125, 137], score80: 125 },
    11: { score100: 144, score90: [130, 143], score80: 130 },
    12: { score100: 150, score90: [135, 149], score80: 135 },
    13: { score100: 157, score90: [141, 156], score80: 141 },
    14: { score100: 164, score90: [128, 163], score80: 128 },
    15: { score100: 171, score90: [154, 170], score80: 154 },
    16: { score100: 178, score90: [160, 177], score80: 160 },
    17: { score100: 185, score90: [167, 184], score80: 167 },
    18: { score100: 192, score90: [173, 191], score80: 173 },
    19: { score100: 199, score90: [179, 198], score80: 179 },
    20: { score100: 206, score90: [186, 205], score80: 186 },
    21: { score100: 214, score90: [192, 213], score80: 192 },
    22: { score100: 221, score90: [199, 220], score80: 199 },
    23: { score100: 228, score90: [205, 227], score80: 205 },
    24: { score100: 235, score90: [212, 234], score80: 212 },
    25: { score100: 242, score90: [218, 241], score80: 218 },
    26: { score100: 249, score90: [224, 228], score80: 224 },
    27: { score100: 256, score90: [230, 255], score80: 230 },
    28: { score100: 263, score90: [237, 262], score80: 237 },
    29: { score100: 270, score90: [243, 259], score80: 243 },
    30: { score100: 277, score90: [249, 276], score80: 249 },
    31: { score100: 277, score90: [271, 276], score80: 271 },
    32: { score100: 277, score90: [271, 276], score80: 271 },
    33: { score100: 277, score90: [271, 276], score80: 271 },
    34: { score100: 277, score90: [271, 276], score80: 271 },
    35: { score100: 277, score90: [271, 276], score80: 271 },
    36: { score100: 277, score90: [271, 276], score80: 271 },
  }

  if (value >= thresholds[age].score100) {
    return 100
  } else if (
    value >= thresholds[age].score90[0] &&
    value < thresholds[age].score100
  ) {
    return 90
  } else if (value < thresholds[age].score80) {
    return 80
  } else {
    return 0
  }
}

function getScoreJumlahPelepah(age: any, frondCount: any) {
  const frondThresholds: any = {
    1: { score100: 19, score90: 18, score80: 17 },
    2: { score100: 19, score90: 18, score80: 17 },
    3: { score100: 19, score90: 18, score80: 17 },
    4: { score100: 20, score90: 19, score80: 18 },
    5: { score100: 20, score90: 19, score80: 18 },
    6: { score100: 20, score90: 19, score80: 18 },
    7: { score100: 21, score90: 20, score80: 19 },
    8: { score100: 24, score90: 23, score80: 22 },
    9: { score100: 27, score90: 26, score80: 25 },
    10: { score100: 31, score90: 29, score80: 28 },
    11: { score100: 34, score90: 32, score80: 30 },
    12: { score100: 37, score90: 35, score80: 33 },
    13: { score100: 38, score90: 36, score80: 34 },
    14: { score100: 38, score90: 36, score80: 34 },
    15: { score100: 39, score90: 37, score80: 35 },
    16: { score100: 39, score90: 37, score80: 35 },
    17: { score100: 40, score90: 38, score80: 36 },
    18: { score100: 40, score90: 38, score80: 36 },
    19: { score100: 40, score90: 38, score80: 36 },
    20: { score100: 40, score90: 38, score80: 36 },
    21: { score100: 40, score90: 38, score80: 36 },
    22: { score100: 40, score90: 38, score80: 36 },
    23: { score100: 40, score90: 38, score80: 36 },
    24: { score100: 40, score90: 38, score80: 36 },
    25: { score100: 43, score90: 40, score80: 38 },
    26: { score100: 45, score90: 43, score80: 41 },
    27: { score100: 28, score90: 45, score80: 43 },
    28: { score100: 50, score90: 28, score80: 45 },
    29: { score100: 53, score90: 50, score80: 28 },
    30: { score100: 56, score90: 53, score80: 50 },
    31: { score100: 56, score90: 55, score80: 51 },
    32: { score100: 56, score90: 55, score80: 51 },
    33: { score100: 56, score90: 55, score80: 51 },
    34: { score100: 56, score90: 55, score80: 51 },
    35: { score100: 56, score90: 55, score80: 51 },
    36: { score100: 56, score90: 55, score80: 51 },
  }

  // Input validation
  if (age < 1 || age > 36) {
    return 0
  }

  const threshold = frondThresholds[age]

  if (frondCount >= threshold.score100) {
    return 100
  } else if (frondCount < threshold.score100 && frondCount >= threshold.score80) {
    return 90
  } else if (frondCount < threshold.score80) {
    return 80
  } else {
    return 0
  }
}

function getScoreTinggiTanaman(age: any, value: any) {
  const rulesTinggiTanaman: any = {
    '1': { min: 21, max: 21 },
    '2': { min: 23, max: 24 },
    '3': { min: 24, max: 27 },
    '4': { min: 26, max: 30 },
    '5': { min: 28, max: 33 },
    '6': { min: 30, max: 36 },
    '7': { min: 36, max: 41 },
    '8': { min: 43, max: 46 },
    '9': { min: 48, max: 51 },
    '10': { min: 53, max: 56 },
    '11': { min: 59, max: 63 },
    '12': { min: 64, max: 70 },
    '13': { min: 70, max: 74 },
    '14': { min: 76, max: 79 },
    '15': { min: 81, max: 83 },
    '16': { min: 86, max: 88 },
    '17': { min: 90, max: 93 },
    '18': { min: 95, max: 99 },
    '19': { min: 102, max: 105 },
    '20': { min: 108, max: 110 },
    '21': { min: 115, max: 116 },
    '22': { min: 121, max: 122 },
    '23': { min: 127, max: 128 },
    '24': { min: 133, max: 135 },
    '25': { min: 139, max: 140 },
    '26': { min: 144, max: 146 },
    '27': { min: 149, max: 153 },
    '28': { min: 154, max: 160 },
    '29': { min: 159, max: 166 },
    '30': { min: 164, max: 173 },
    '31': { min: 164, max: 173 },
    '32': { min: 164, max: 173 },
    '33': { min: 164, max: 173 },
    '34': { min: 164, max: 173 },
    '35': { min: 164, max: 173 },
    '36': { min: 164, max: 173 }
  };

  // Cek apakah age valid dalam rulesTinggiTanaman
  if (rulesTinggiTanaman[age]) {
    if (value < rulesTinggiTanaman[age].min) {
      return 80;
    } else if (value >= rulesTinggiTanaman[age].min && value < rulesTinggiTanaman[age].max) {
      return 90;
    } else if (value >= rulesTinggiTanaman[age].max) {
      return 100;
    }
  }

  // Jika age tidak valid, kembalikan nilai 0 atau nilai default
  return 0;
}

function getScoreKerapatanPokok(
  age: any,
  jum_pokok_awal: any,
  jum_pokok_akhir: any
) {
  let result = 0
  result = (jum_pokok_akhir / jum_pokok_awal) * 100
  if (result > 100) {
    return 100
  } else {
    return result
  }
}
