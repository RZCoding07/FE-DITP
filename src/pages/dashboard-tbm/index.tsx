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
import { FaRecycle, FaSync } from 'react-icons/fa'

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
    { value: 'RPC4', label: 'RPC 4' },
    { value: 'RPC6', label: 'RPC 6' },
  ]

  const [kebunOptions, setKebunOptions] = useState([])
  const [afdOptions, setAfdOptions] = useState([])

  const [colorData, setColorData] = useState({
    hitam: 0,
    hijau: 0,
    kuning: 0,
    oren: 0,
  })

  const rpc = watch('rpc')
  const kebun = watch('kebun')
  const afd = watch('afd')
  const bulan = watch('bulan')
  const tahun = watch('tahun')

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
          })

          const newScores = Object.values(response.data).map((item: any) => {
            const age = bulan.value
            const blok = item.blok
            const scoreLingkarBatang = getScoreLingkarBatang(
              age,
              parseFloat(item.rata_rata_lingkar_batang)
            )
            const scoreJumlahPelepah = getScoreJumlahPelepah(
              age,
              parseFloat(item.rata_rata_jumlah_pelepah)
            )

            return {
              [`tbm${i}`]: {
                blok,
                scoreLingkarBatang,
                scoreJumlahPelepah,
              },
            }
          })

          const totalLuasHa: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.total_luas_ha),
            0
          )

          const totalPokokSekarang: number = Object.values(
            response.data
          ).reduce(
            (acc: number, curr: any) =>
              acc + parseFloat(curr.total_jumlah_pokok_sekarang),
            0
          )

          const totalCalJumlahPelepah: number = Object.values(
            response.data
          ).reduce(
            (acc: number, curr: any) =>
              acc + parseFloat(curr.total_cal_jumlah_pelepah),
            0
          )

          const totalCalLingkarBatang: number = Object.values(
            response.data
          ).reduce(
            (acc: number, curr: any) =>
              acc + parseFloat(curr.total_cal_lingkar_batang),
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
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 'Skor 100'
              ).length,
              score90: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 'Skor 90'
              ).length,
              score80: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreJumlahPelepah === 'Skor 80'
              ).length,
              total: newScores.length,
            }

            scoreLingkarBatangResults[`tbm${i as 1 | 2 | 3}`] = {
              score100: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 'Skor 100'
              ).length,
              score90: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 'Skor 90'
              ).length,
              score80: newScores.filter(
                (item: any) => item[`tbm${i}`].scoreLingkarBatang === 'Skor 80'
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

  return (
    <Layout>
      <Layout.Header>
        <TopNav links={TOP_NAV} />
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
          tbmData={tbmData}
          tbmDataScorePelepahBlok={tbmDataScorePelepahBlok}
          tbmDataScoreLingkarBlok={tbmDataScoreLingkarBlok}
          data={colorData}
          dataTbm={{
            ...tbmData,
            tahun: watch('tahun'),
          }}
        />

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
      <div className='float-end -mt-5 flex justify-center align-middle'>
      </div>
    </>
  )
}

function getScoreLingkarBatang(age: any, value: any) {
  // Input validation
  if (age < 1 || age > 36) {
    return 'Age must be between 1 and 36'
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
    return 'Skor 100'
  } else if (
    value >= thresholds[age].score90[0] &&
    value <= thresholds[age].score90[1]
  ) {
    return 'Skor 90'
  } else if (value < thresholds[age].score80) {
    return 'Skor 80'
  } else {
    return 'Invalid value'
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
    31: { score100: 56, score90: [51, 56], score80: 51 },
    32: { score100: 56, score90: [51, 56], score80: 51 },
    33: { score100: 56, score90: [51, 56], score80: 51 },
    34: { score100: 56, score90: [51, 56], score80: 51 },
    35: { score100: 56, score90: [51, 56], score80: 51 },
    36: { score100: 56, score90: [51, 56], score80: 51 },
  }

  // Input validation
  if (age < 1 || age > 36) {
    return 'Age must be between 1 and 36'
  }

  const threshold = frondThresholds[age]

  // For ages 31-36 where score90 is a range
  if (age >= 31) {
    if (frondCount > threshold.score100) {
      return 'Skor 100'
    } else if (
      frondCount >= threshold.score90[0] &&
      frondCount <= threshold.score90[1]
    ) {
      return 'Skor 90'
    } else if (frondCount < threshold.score80) {
      return 'Skor 80'
    }
  } else {
    // For ages 1-30 where score90 is a single value
    if (frondCount >= threshold.score100) {
      return 'Skor 100'
    } else if (frondCount === threshold.score90) {
      return 'Skor 90'
    } else if (frondCount <= threshold.score80) {
      return 'Skor 80'
    }
  }
}

function getScoreKerapatanPokok({ score }: { score: number }) {
  if (score >= 140 && score <= 143) {
    return 'Skor 100'
  } else if (score >= 130 && score <= 139) {
    return 'Skor 90'
  } else if (score < 130) {
    return 'Skor 80'
  } else {
    return 'Invalid score'
  }
}
