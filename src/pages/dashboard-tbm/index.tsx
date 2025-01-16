import React, { useEffect, useState } from 'react'
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
import DonutChart from '@/components/custom/donut-chart'
import { StockAnalysisChart } from '@/components/custom/horizontal-bar-chart'
import { StockAnalysisChartKebun } from '@/components/custom/horizontal-kebun-bar-chart'

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
    { value: 'RPC1', label: 'RPC 1' },
    { value: 'RPC2', label: 'RPC 2' },
    { value: 'RPC3', label: 'RPC 3' },
    { value: 'RPC4', label: 'RPC 4' },
    { value: 'RPC5', label: 'RPC 5' },
    { value: 'RPC6', label: 'RPC 6' },
    { value: 'RPC7', label: 'RPC 7' },
    { value: 'RPC2(EX-N2)', label: 'RPC 2(EX-N2)' },
    { value: 'RPC2(EX-N14)', label: 'RPC 2(EX-N14)' },
  ]

  const [kebunOptions, setKebunOptions] = useState([])
  const [afdOptions, setAfdOptions] = useState([])
  const [scores, setScores] = useState<any[]>([])
  const [tbmRes, setTbmRes] = useState<any[]>([])
  const [isKebun, setIsKebun] = useState<boolean>(false)

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

  const rpc = watch('rpc')
  const kebun = watch('kebun')
  const afd = watch('afd')
  const bulan = watch('bulan')
  const tahun = watch('tahun')

  useEffect(() => {
    const emasScores = scores.filter((score: any) => {
      return (Object.values(score)[0] as any).scoreTinggiBatang == 0
    })

    console.log('emasScores', emasScores)
  }, [scores])
  useEffect(() => {
    const fetchProcVegetatifDefault = async () => {
      try {
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
            const age = bulan.value
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
            }

            let luas = parseFloat(item.luas_ha)
            let regional = item.regional
            let kebun = item.kebun

            setScores((prev) => [
              ...prev,
              {
                [`tbm${i}`]: {
                  regional,
                  kebun,
                  blok,
                  scoreLingkarBatang,
                  scoreJumlahPelepah,
                  scoreTinggiBatang,
                  scoreKerapatanPokok,
                  totalSeleksian,
                  colorCategory,
                  luas,
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

  const [selectedCard, setSelectedCard] = useState<any | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null)

  const handleCardClick = (cardData: any) => {
    // console.log('tbmRes', tbmRes)
    setSelectedCard(cardData) // Simpan parameter atau lakukan tindakan lainnya
    setIsKebun(false)
  }

  const handleEventClick = (eventData: any) => {
    // console.log('tbmRes', tbmRes)
    setSelectedEvent(eventData) // Simpan parameter atau lakukan tindakan lainnya
    setIsKebun(true)
  }

  const dataRules = [
    {
      show: true,
      name: 'Emas',
      progress: 1,
      circular: 'gold',
      rules: 'Kelas A : 97 - 100',
      image: '/2.png',
      color: '#FFA500',
      textColor: '#ffffff',
    },

    {
      show: true,
      name: 'Hijau',
      progress: 1,
      rules: 'Kelas B : 90 - 96',
      circular: 'green',
      image: '/2.png',
      color: '#00a300',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Merah',
      progress: 1,
      rules: 'Kelas C : 81 - 89',
      circular: 'red',
      image: '/2.png',
      color: '#FF0000',
      textColor: '#ffffff',
    },
    {
      show: true,
      name: 'Hitam',
      rules: 'Kelas D : < 80',
      progress: 1,
      circular: 'black',
      image: '/2.png',
      color: '#000000',
      textColor: '#ffffff',
    },
  ]

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
        />

        <WelcomeBanner />

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
        <div className='flex'>
          {dataRules.map((item, i) =>
            item.show ? (
              <div
                key={i}
                className='mt-5 block w-full bg-gradient-to-br   dark:from-slate-900 dark:via-slate-950 dark:to-slate-950'
                style={{
                  background: `linear-gradient(135deg, ${item.color} 55%, ${item.color}69 45%)`,
                  borderColor: item.color,
                }}
              >
                <div className='flex items-center justify-between px-4 py-1'>
                  <p className='text-sm font-semibold capitalize text-white'>
                    {item.name}
                  </p>
                  <span className='text-end text-xs font-semibold text-white'>
                    {item.rules}
                  </span>
                </div>
              </div>
            ) : null
          )}
        </div>
        {selectedCard && (
     <>
     <div className="align-middle items-center w-full">
       <div className="mt-5 flex justify-between">
        <h2 className='font-semibold text-2xl'>Grafik Rincian {selectedCard.name} Per Regional</h2>
         <Button
           variant={'secondary'}
           onClick={() => setSelectedCard(null)}
           className="flex rounded-full items-center"
         >
           <img
             width="20"
             height="48"
             src="https://img.icons8.com/external-beshi-flat-kerismaker/48/external-Hide-user-interface-beshi-flat-kerismaker.png"
             alt="external-Hide-user-interface-beshi-flat-kerismaker"
           />{' '}
           <span className="ml-2">Hide Chart</span>
         </Button>
       </div>
   
       <div className="mt-5 grid grid-cols-2 gap-4">
         <StockAnalysisChart
           dataprops={{
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
   </>
   
        )}
        {selectedEvent && isKebun && (
          <div className='mt-5 grid grid-cols-2 gap-4'>
            <StockAnalysisChartKebun
              dataprops={{
                dataset: selectedEvent.sumLuasBlok,
                untuk: 'Total Luasan',
                categories: selectedEvent.categories,
                title: selectedEvent.name,
                color: selectedEvent.color,
                val: selectedEvent.val,
                category: selectedEvent.selectedCategory,
              }}
              onEventClick={handleEventClick}
            />
            <StockAnalysisChartKebun
              dataprops={{
                dataset: selectedEvent.countBlok,
                categories: selectedEvent.categories,
                untuk: 'Total Blok',
                title: selectedEvent.name,
                color: selectedEvent.color,
                val: selectedEvent.val,
                category: selectedEvent.selectedCategory,
              }}
              onEventClick={handleEventClick}
            />
          </div>
        )}
        <DataPicaCluster
          control={control}
          rpc={rpc}
          kebun={kebun}
          afd={afd}
          bulan={bulan}
          tahun={tahun}
          rpcOptions={rpcOptions}
          kebunOptions={kebunOptions}
          afdOptions={afdOptions}
          tbmDataScorePelepahBlok={tbmDataScorePelepahBlok}
          tbmDataScoreLingkarBlok={tbmDataScoreLingkarBlok}
        />
      </Layout.Body>
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
}: {
  control: any
  fullname: any
  tahunOptions: any
  bulanOptions: any
  defaultTahun: any
  defaultBulan: any
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
      <div className='flex items-center space-x-2'>
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

        <Button className='flex items-center rounded-full'>
          Download
          <IconPdf size={20} className='ml-2 bg-red-500 text-white' />
        </Button>
      </div>
    </div>
  )
}

function WelcomeBanner() {
  return (
    <div className='py-5'>
      <div className='rounded-xl bg-gradient-to-r from-blue-500 via-green-500 to-green-500 p-6 py-5 shadow-lg'>
        <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between'>
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
  bulan,
  tahun,
  rpcOptions,
  kebunOptions,
  afdOptions,
  tbmDataScorePelepahBlok,
  tbmDataScoreLingkarBlok,
}: {
  control: any
  rpc: any
  kebun: any
  afd: any
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
}) {
  return (
    <>
      <div className='align-end mt-5 grid grid-cols-[30%_70%] items-center'>
        <h2 className='text-2xl font-bold'>
          PICA Cluster {rpc ? rpc.label : ''} {kebun ? ' / ' + kebun.label : ''}{' '}
          {afd ? ' / ' + afd.label : ''} <br />
          <strong>
            {bulan ? bulan.label : ''} {tahun ? tahun.label : ''}
          </strong>
        </h2>
        <div className='grid grid-cols-5 items-center gap-3'>
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
                styles={customStyles}
                placeholder='Pilih Kebun'
                isSearchable
                options={kebunOptions}
                {...field}
              />
            )}
          />

          <Controller
            name='afd'
            control={control}
            render={({ field }) => (
              <Select
                styles={customStyles}
                placeholder='Pilih Afdeling'
                isSearchable
                options={afdOptions}
                {...field}
              />
            )}
          />

          <Select
            styles={customStyles}
            placeholder='Pilih Blok / Luasan'
            isSearchable
            defaultValue={{ value: 'blok', label: 'Blok' }}
            options={[
              { value: 'blok', label: 'Blok' },
              { value: 'luasan', label: 'Luasan' },
            ]}
            {...control.register('blok')}
            value={afd}
          />
          <div className='flex'>
            <Button className='flex items-center rounded-full'>
              <FaSync style={{ animation: 'spin 8s linear infinite' }} />
            </Button>
          </div>
        </div>
      </div>

      <DonutChart
        tbmDataScorePelepahBlok={tbmDataScorePelepahBlok}
        tbmDataScoreLingkarBlok={tbmDataScoreLingkarBlok}
      />
      <div className='float-end -mt-5 flex justify-center align-middle'></div>
    </>
  )
}

function getScoreLingkarBatang(age: any, value: any) {
  // Input validation
  if (age < 1 || age > 36) {
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
    14: { score100: 164, score90: [148, 163], score80: 148 },
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
    26: { score100: 249, score90: [224, 248], score80: 224 },
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
    value <= thresholds[age].score90[1]
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
    27: { score100: 48, score90: 45, score80: 43 },
    28: { score100: 50, score90: 48, score80: 45 },
    29: { score100: 53, score90: 50, score80: 48 },
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
    '3': { min: Math.ceil(24.48), max: Math.ceil(27.04) },
    '4': { min: Math.ceil(26.22), max: Math.ceil(30.06) },
    '5': { min: Math.ceil(27.96), max: Math.ceil(33.08) },
    '6': { min: Math.ceil(29.7), max: Math.ceil(36.1) },
    '7': { min: Math.ceil(36.37), max: Math.ceil(41.07) },
    '8': { min: Math.ceil(42.67), max: Math.ceil(46.03) },
    '9': { min: Math.ceil(48), max: Math.ceil(51) },
    '10': { min: Math.ceil(53.33), max: Math.ceil(56.37) },
    '11': { min: Math.ceil(58.67), max: Math.ceil(63.03) },
    '12': { min: Math.ceil(64), max: Math.ceil(69.7) },
    '13': { min: Math.ceil(69.82), max: Math.ceil(74.2) },
    '14': { min: Math.ceil(75.63), max: Math.ceil(78.7) },
    '15': { min: Math.ceil(80.65), max: Math.ceil(83.2) },
    '16': { min: Math.ceil(85.57), max: Math.ceil(87.7) },
    '17': { min: Math.ceil(90.48), max: Math.ceil(93.08) },
    '18': { min: Math.ceil(95.4), max: Math.ceil(98.9) },
    '19': { min: Math.ceil(101.92), max: Math.ceil(104.62) },
    '20': { min: Math.ceil(108.43), max: Math.ceil(110.33) },
    '21': { min: Math.ceil(114.95), max: Math.ceil(116.05) },
    '22': { min: Math.ceil(121.47), max: Math.ceil(121.77) },
    '23': { min: Math.ceil(127.48), max: Math.ceil(127.98) },
    '24': { min: Math.ceil(133.2), max: Math.ceil(134.5) },
    '25': { min: Math.ceil(139.42), max: Math.ceil(139.83) },
    '26': { min: Math.ceil(144.33), max: Math.ceil(146.47) },
    '27': { min: Math.ceil(149.25), max: Math.ceil(153.1) },
    '28': { min: Math.ceil(154.17), max: Math.ceil(159.73) },
    '29': { min: Math.ceil(159.08), max: Math.ceil(166.37) },
    '30': { min: Math.ceil(164), max: Math.ceil(173) },
  }

  if (value < rulesTinggiTanaman[age].min) {
    return 80
  } else if (
    value >= rulesTinggiTanaman[age].min &&
    value <= rulesTinggiTanaman[age].max
  ) {
    return 90
  } else if (value > rulesTinggiTanaman[age].max) {
    return 100
  } else {
    return 0
  }
}

function getScoreKerapatanPokok(
  age: any,
  jum_pokok_awal: any,
  jum_pokok_akhir: any
) {
  return (jum_pokok_akhir / jum_pokok_awal) * 100
}
