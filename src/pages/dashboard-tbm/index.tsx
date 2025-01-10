import React, { useEffect, useState } from 'react'
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
import { RobotInvestasi } from '@/components/loatie'
import { Summary } from '@/components/summary'
import Select from 'react-select'
import { useDashboardForm } from '@/hooks/use-dashboard-form'
import { fetchVegetativeProc } from '@/utils/api'
import { TOP_NAV } from '@/utils/constants'
import { customStyles } from '@/styles/select-styles'
import DonutChart from '@/components/custom/donut-chart'

export default function Dashboard() {
  const user = cookie.get('user')
  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'

  const {
    control,
    watch,
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

  const [tbmDataPopulasi, setTbmDataPopulasi] = useState({
    tbm1: 0,
    tbm2: 0,
    tbm3: 0,
    tbm4: 0,
  })

  const [tbmDataJumlahPelepah, setTbmDataJumlahPelepah] = useState({
    tbm1: 0,
    tbm2: 0,
    tbm3: 0,
    tbm4: 0,
  })

  const [tbmDataLingkarBatang, setTbmDataLingkarBatang] = useState({
    tbm1: 0,
    tbm2: 0,
    tbm3: 0,
    tbm4: 0,
  })

  const [colorData, setColorData] = useState({
    hitam: 0,
    hijau: 0,
    kuning: 0,
    oren: 0,
  })

  const [rpcOptions, setRpcOptions] = useState([])
  const [kebunOptions, setKebunOptions] = useState([])

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

        const countEmastbmResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const countHijautbmResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const countMerahtbmResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

        const countHitamtbmResults: {
          tbm1: number
          tbm2: number
          tbm3: number
          tbm4: number
        } = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }

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

          const totalLuasHa: number = Object.values(response.data).reduce(
            (acc: number, curr: any) => acc + parseFloat(curr.total_luas_ha),
            0
          )

          tbmResults[`tbm${i as 1 | 2 | 3 | 4}`] = totalLuasHa
        }

        setTbmData(tbmResults)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    if (bulan && tahun) {
      fetchProcVegetatifDefault()
    }
  }, [bulan, tahun])

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
          control={control}
          tahunOptions={tahunOptions}
          bulanOptions={bulanOptions}
          defaultTahun={defaultTahun}
          defaultBulan={defaultBulan}
        />

        <WelcomeBanner />

        <Summary
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
        />

        <div className='float-end -mt-5'>
          <RobotInvestasi />
        </div>
      </Layout.Body>
    </Layout>
  )
}

function DashboardHeader({
  control,
  tahunOptions,
  bulanOptions,
  defaultTahun,
  defaultBulan,
}: {
  control: any
  tahunOptions: any
  bulanOptions: any
  defaultTahun: any
  defaultBulan: any
}) {
  return (
    <div className='mb-2 flex items-center justify-between space-y-2'>
      <div className='flex items-center space-x-2'>
        <FcDoughnutChart size={40} />
        <h1 className='text-2xl font-bold tracking-tight'>
          Dashboard PICA TBM
        </h1>
      </div>

      <div className='flex items-center space-x-2'>
        <Select
          styles={customStyles}
          options={tahunOptions}
          defaultValue={defaultTahun}
          {...control.register('tahun')}
        />
        <Select
          styles={customStyles}
          options={bulanOptions}
          defaultValue={defaultBulan}
          {...control.register('bulan')}
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
}: {
  control: any
  rpc: any
  kebun: any
  afd: any
  bulan: any
  tahun: any
  rpcOptions: any[]
  kebunOptions: any[]
}) {
  return (
    <div className='align-end mt-5 grid grid-cols-4 items-center gap-1'>
      <h2 className='text-2xl font-bold'>
        Data PICA Cluster{' '}
        <strong>
          {bulan ? bulan.label : ''} {tahun ? tahun.label : ''}
        </strong>
        <br />
        <strong>
          {rpc ? rpc.label : ''} {kebun ? ' - ' + kebun.label : ''}{' '}
          {afd ? ' - ' + afd.label : ''}
        </strong>
      </h2>
      <Select
        styles={customStyles}
        placeholder='Pilih RPC'
        isSearchable
        options={rpcOptions}
        {...control.register('rpc')}
        value={rpc}
      />
      <Select
        styles={customStyles}
        placeholder='Pilih Kebun'
        isSearchable
        options={kebunOptions}
        {...control.register('kebun')}
        value={kebun}
      />
      <Select
        styles={customStyles}
        placeholder='Pilih Afdeling'
        isSearchable
        options={kebunOptions}
        {...control.register('afd')}
        value={afd}
      />
      <DonutChart />
    </div>
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
