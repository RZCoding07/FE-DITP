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
import StockAnalysisChartBar from '@/components/custom/bar-chart'
import DonutChartTbm from '@/components/custom/donut-chart-tbm'
import DonutChart from '@/components/custom/donut-chart'
import KuadranChart from '@/components/custom/kuadran'
import { Summary as STbm } from '@/components/summarytbm'
import * as XLSX from 'xlsx-js-style'
import toast from 'react-hot-toast'
import { FaEyeDropper, FaRecycle, FaSync } from 'react-icons/fa'
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from '@mui/material'
import { text } from 'stream/consumers'

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

  const [kebunOptions, setKebunOptions] = useState([])
  const [afdOptions, setAfdOptions] = useState([])
  const [scores, setScores] = useState<any[]>([])
  const [tbmRes, setTbmRes] = useState<any[]>([])
  const [isKebun, setIsKebun] = useState<boolean>(false)
  const [isTbm, setIsTbm] = useState<boolean>(true)

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
          duration: 2000,
        })

        for (let i = 1; i < 5; i++) {
          const tahunTanam = tahun.value - i
          const response = await fetchVegetativeProc({
            input_filtered_by: 'Blok',
            input_regional: null,
            input_kebun: null,
            input_afdeling: null,
            input_blok: null,
            input_bulan: bulan.value,
            input_tahun: tahun.value,
            input_tahun_tanam: tahunTanam,
            input_tbm: 'tbm' + i,
          })

          setTbmRes((prev) => [...prev, Object.values(response.data)])

          const newScores = Object.values(response.data).map((item: any) => {
            //  console length response.data
            // console.log('response.data',  Object.values(response.data).length)
            let age = bulan.value * i
            if (age > 36) {
              age = 36
            }
            const blok = item.blok
            const scoreLingkarBatang =
              getScoreLingkarBatang(age, parseFloat(item.lingkar_batang_cm)) *
              0.4
            const scoreJumlahPelepah =
              getScoreJumlahPelepah(age, parseFloat(item.jumlah_pelepah_bh)) *
              0.2

            const scoreTinggiBatang =
              getScoreTinggiTanaman(age, parseFloat(item.tinggi_tanaman_cm)) *
              0.1

            const scoreKerapatanPokok =
              getScoreKerapatanPokok(
                age,
                parseFloat(item.jumlah_pokok_awal_tanam),
                parseFloat(item.jumlah_pokok_sekarang)
              ) * 0.3


            const totalSeleksian =
              scoreLingkarBatang +
              scoreJumlahPelepah +
              scoreTinggiBatang +
              scoreKerapatanPokok

            let colorCategory = ''

            if (totalSeleksian <= 80) {
              colorCategory = 'black'
            } else if (totalSeleksian > 80 && totalSeleksian <= 89) {
              colorCategory = 'red'
            } else if (totalSeleksian > 89 && totalSeleksian <= 96) {
              colorCategory = 'green'
            } else if (totalSeleksian > 96) {
              colorCategory = 'gold'
            } else {
              colorCategory = ''
            }

            let luas = parseFloat(item.luas_ha)
            let regional = item.regional
            let kebun = item.kebun
            let lingkar = parseFloat(item.lingkar_batang_cm)
            let tinggi = parseFloat(item.tinggi_tanaman_cm)
            let jumPelepah = parseFloat(item.jumlah_pelepah_bh)

            if (scoreLingkarBatang === 0 || scoreJumlahPelepah === 0 || scoreTinggiBatang === 0 || scoreKerapatanPokok === 0 || totalSeleksian === 0 || colorCategory === '' || luas === 0) {
              console.log('Data dengan score 0:', {
                age,
                blok,
                lingkar,
                scoreLingkarBatang,
                scoreJumlahPelepah,
                tinggi,
                scoreTinggiBatang,
                scoreKerapatanPokok,
                totalSeleksian,
                colorCategory,
                luas,
                jumPelepah
              });
            }

            let afdeling = item.afdeling


            setScores((prev) => [
              ...prev,
              {
                [`tbm${i}`]: {
                  regional,
                  kebun,
                  afdeling,
                  blok,
                  scoreLingkarBatang,
                  scoreJumlahPelepah,
                  scoreTinggiBatang,
                  scoreKerapatanPokok,
                  totalSeleksian,
                  colorCategory,
                  luas,
                  jumPelepah
                },
              },
            ])

            setColorData((prev) => ({
              ...prev,
              hitam: totalSeleksian <= 80 ? prev.hitam + 1 : prev.hitam,
              merah:
                totalSeleksian > 80 && totalSeleksian <= 89
                  ? prev.merah + 1
                  : prev.merah,
              hijau:
                totalSeleksian > 89 && totalSeleksian <= 96
                  ? prev.hijau + 1
                  : prev.hijau,
              emas: totalSeleksian > 96 ? prev.emas + 1 : prev.emas,
            }))

            setColorDataLuas((prev) => ({
              ...prev,
              hitam: totalSeleksian <= 80 ? prev.hitam + luas : prev.hitam,
              merah:
                totalSeleksian > 80 && totalSeleksian <= 89
                  ? prev.merah + luas
                  : prev.merah,
              hijau:
                totalSeleksian > 89 && totalSeleksian <= 96
                  ? prev.hijau + luas
                  : prev.hijau,
              emas: totalSeleksian > 96 ? prev.emas + luas : prev.emas,
            }))

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
            }
          })



          const totalLuasHa: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.luas_ha),
            0
          )

          const totalPokokSekarang: number = Object.values(
            response.data
          ).reduce(
            (acc: number, curr: any) =>
              acc + parseFloat(curr.jumlah_pokok_sekarang),
            0
          )

          const totalCalJumlahPelepah: number = Object.values(
            response.data
          ).reduce(
            (acc: number, curr: any) =>
              acc + parseFloat(curr.cal_jumlah_pelepah),
            0
          )

          const totalCalLingkarBatang: number = Object.values(
            response.data
          ).reduce(
            (acc: number, curr: any) =>
              acc + parseFloat(curr.cal_lingkar_batang),
            0
          )

          tbmResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalLuasHa

          pokokSekarangResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalPokokSekarang

          calJumlahPelepahResults[`tbm${i as 1 | 2 | 3 | 4}`] =
            totalCalJumlahPelepah

          calLingkarBatangResults[`tbm${i as 1 | 2 | 3 | 4}`] =
            totalCalLingkarBatang

          avgPelepahResults[`tbm${i as 1 | 2 | 3 | 4}`] =
            totalCalJumlahPelepah / totalPokokSekarang

          avgLingkarBatangResults[`tbm${i as 1 | 2 | 3 | 4}`] =
            totalCalLingkarBatang / totalPokokSekarang

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
            }

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
            }
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

  useEffect(() => {
    if (rpc) {
      const fetchKebunData = async () => {
        try {
          const response = await fetchKebun({
            rpc: rpc.value,
          })

          const kebun = response.map((item: any) => ({
            value: item.kebun,
            label: item.kebun,
          }))

          setKebunOptions(kebun)
          setValue('kebun', null)
          setValue('afd', null)
        } catch (error) {
          console.error('Error fetching kebun:', error)
        }
      }

      fetchKebunData()
    }
  }, [rpc])

  useEffect(() => {
    if (kebun) {
      const fetchAfdData = async () => {
        try {
          const response = await fetchAfd({
            rpc: rpc.value,
            kebun: kebun.value,
          })

          const afd = response.map((item: any) => ({
            value: item.afdeling,
            label: item.afdeling,
          }))

          setAfdOptions(afd)
          setValue('afd', null)
        } catch (error) {
          console.error('Error fetching afd:', error)
        }
      }

      fetchAfdData()
    }
  }, [kebun])

  const [selectedCard, setSelectedCard] = useState({
    type: 'all',
    name: 'Keseluruhan TBM',
    ctg: 'tbm-all',
    circular: '',
    val: 4,

  })
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

  const handleCardClick = (cardData: any) => {
    // console.log('tbmRes', tbmRes)
    setSelectedCard(cardData) // Simpan parameter atau lakukan tindakan lainnya
    setValue('rpc', { value: 'all', label: 'Semua RPC' })
    setIsKebun(false)
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



  useEffect(() => {
    if (rpcValue !== 'all') {
      console.log('selectedCard', selectedCard)

      if (selectedCard.val < 4) {
        const distinctByTbm = scores.filter(score => Object.keys(score)[0] === selectedCard.ctg);
        const distinctByRegional = distinctByTbm.filter(score => score[Object.keys(score)[0]].regional === rpcValue);
        const countByColor = (color: string) => {
          const distincKebunByReg = distinctByRegional.map(item => item[Object.keys(item)[0]].kebun);
          // countby colot and distinct kebun
          let sumColor: { [key: string]: number } = {};
          let sumLuas: { [key: string]: number } = {};
          sumColor[color] = 0;
          sumLuas[color] = 0;
          let data = [...new Set(distincKebunByReg)].map(kebun => {
            // Filter for items matching the current kebun and color
            const filteredItems = distinctByRegional.filter(item => item[Object.keys(item)[0]].kebun === kebun && item[Object.keys(item)[0]].colorCategory === color);

            // Ensure sumColor and sumLuas are updated correctly
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
                            tbmData,
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
                            score: scores,
                            ctg: selectedCard.ctg,
                            title: selectedCard.name,
                            dataTbm: {
                              ...tbmData,
                              tahun: watch('tahun'),
                            },
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
                            onCardClick={handleCardClick}
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

                            {isKebun === false && (
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

                                {blok && blok.value === 'luasan' && (
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
                                )}

                                {blok && blok.value === 'blok' && (

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
                              </>

                            )}

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>


                <DataPicaCluster
                  control={control}
                  rpc={rpc}
                  kebun={kebun}
                  afd={afd}
                  blok={blok}
                  name={selectedCard.name}
                  ctg={selectedCard.ctg}
                  selectedCard={selectedCard}
                  bulan={bulan}
                  tahun={tahun}
                  rpcOptions={rpcOptions}
                  kebunOptions={kebunOptions}
                  afdOptions={afdOptions}
                  tbmDataScorePelepahBlok={tbmDataScorePelepahBlok}
                  tbmDataScoreLingkarBlok={tbmDataScoreLingkarBlok}
                  scores={scores}
                />


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

function DataPicaCluster({
  control,
  rpc,
  kebun,
  afd,
  blok,
  name,
  ctg,
  selectedCard,
  bulan,
  tahun,
  rpcOptions,
  kebunOptions,
  afdOptions,
  tbmDataScorePelepahBlok,
  tbmDataScoreLingkarBlok,
  scores,
}: {
  control: any
  rpc: any
  kebun: any
  afd: any
  blok: any
  ctg: any
  selectedCard: any
  name: string
  bulan: any
  tahun: any
  rpcOptions: any[]
  kebunOptions: any[]
  afdOptions: any[]
  tbmDataScorePelepahBlok: {
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
  }
  tbmDataScoreLingkarBlok: {
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
  }
  scores: any[]
}) {
  return (
    <>

      <div className="grid">
        <div className='items-center justify-center align-middle'>
          <div className='mt-5 rounded-lg border border-cyan-500 bg-white p-5 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-slate-900 dark:to-slate-950'>
            <div className='w-full items-center align-middle'>
              <div className='flex justify-between'>
                <h2 className='text-xl font-semibold'>
                  Result Problem Identification & Corrective Action {name}
                </h2>

              </div>
            </div>
            <hr className='my-3 border-cyan-400' />

            <div className='items-center justify-center align-middle mr-4'>
              <div className='mt-5 rounded-lg border border-cyan-500 bg-white p-3 shadow-md shadow-cyan-500 dark:bg-gradient-to-br dark:from-cyan-700 dark:to-cyan-600'>
                <div className='flex justify-between align-middle items-center'>
                  <h2 className='text-xl font-semibold'>
                    Total {blok.label} Merah Hitam {name}
                  </h2>

                </div>
                <hr className='my-2 mt-4 border-cyan-400' />

                <div className='mt-5 grid lg:grid-cols-1 sm:grid-cols-1'>
                  <StockAnalysisChartBar
                    dataprops={{
                      scores,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </>
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
  } else if (frondCount >= threshold.score90) {
    return 90
  } else if (frondCount >= threshold.score80) {
    return 80
  } else if (frondCount < threshold.score80) {
    return 80
  } else {
    return 0
  }
}

function getScoreTinggiTanaman(age: any, value: any) {
  const rulesTinggiTanaman: any = {
    '1': { min: Math.ceil(21), max: Math.ceil(21) },
    '2': { min: Math.ceil(22.74), max: Math.ceil(24.02) },
    '3': { min: Math.ceil(24.28), max: Math.ceil(27.04) },
    '4': { min: Math.ceil(26.22), max: Math.ceil(30.06) },
    '5': { min: Math.ceil(27.96), max: Math.ceil(33.08) },
    '6': { min: Math.ceil(29.7), max: Math.ceil(36.1) },
    '7': { min: Math.ceil(36.37), max: Math.ceil(41.07) },
    '8': { min: Math.ceil(42.67), max: Math.ceil(46.03) },
    '9': { min: Math.ceil(28), max: Math.ceil(51) },
    '10': { min: Math.ceil(53.33), max: Math.ceil(56.37) },
    '11': { min: Math.ceil(58.67), max: Math.ceil(63.03) },
    '12': { min: Math.ceil(64), max: Math.ceil(69.7) },
    '13': { min: Math.ceil(69.82), max: Math.ceil(74.2) },
    '14': { min: Math.ceil(75.63), max: Math.ceil(78.7) },
    '15': { min: Math.ceil(80.65), max: Math.ceil(83.2) },
    '16': { min: Math.ceil(85.57), max: Math.ceil(87.7) },
    '17': { min: Math.ceil(90.28), max: Math.ceil(93.08) },
    '18': { min: Math.ceil(95.4), max: Math.ceil(98.9) },
    '19': { min: Math.ceil(101.92), max: Math.ceil(104.62) },
    '20': { min: Math.ceil(108.43), max: Math.ceil(110.33) },
    '21': { min: Math.ceil(114.95), max: Math.ceil(116.05) },
    '22': { min: Math.ceil(121.47), max: Math.ceil(121.77) },
    '23': { min: Math.ceil(127.28), max: Math.ceil(127.98) },
    '24': { min: Math.ceil(133.2), max: Math.ceil(134.5) },
    '25': { min: Math.ceil(139.42), max: Math.ceil(139.83) },
    '26': { min: Math.ceil(144.33), max: Math.ceil(146.47) },
    '27': { min: Math.ceil(149.25), max: Math.ceil(153.1) },
    '28': { min: Math.ceil(154.17), max: Math.ceil(159.73) },
    '29': { min: Math.ceil(159.08), max: Math.ceil(166.37) },
    '30': { min: Math.ceil(164), max: Math.ceil(173) },
    '31': { min: Math.ceil(164), max: Math.ceil(173) },
    '32': { min: Math.ceil(164), max: Math.ceil(173) },
    '33': { min: Math.ceil(164), max: Math.ceil(173) },
    '34': { min: Math.ceil(164), max: Math.ceil(173) },
    '35': { min: Math.ceil(164), max: Math.ceil(173) },
    '36': { min: Math.ceil(164), max: Math.ceil(173) }
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
