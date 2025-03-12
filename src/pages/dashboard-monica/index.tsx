import { useState, useEffect } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import axios from 'axios'
import { UserNav } from '@/components/user-nav'
import { FcDoughnutChart } from 'react-icons/fc'
import { TopNav } from '@/components/top-nav'
import { columns } from './components/columns.tsx'
import { columns as colRekap } from './components/col-rekap.tsx'
import { columns as colPekerjaan } from './components/col-pekerjaan.tsx'
import { Loading } from '@/components/ui/loading.tsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import cookie from 'js-cookie'
import { DataTable } from './components/data-table.tsx'
import { DataTablePekerjaan } from './components/data-table-pekerjaan.tsx'
import { Button } from '@/components/custom/button.tsx'

const user = cookie.get('user')
const account_type = user ? JSON.parse(user).account_type : ''

export default function Tasks() {
  const [countAll, setCountAll] = useState(0)
  const [countZero, setCountZero] = useState(0)
  const [countFourty, setCountFourty] = useState(0)
  const [countSixty, setCountSixty] = useState(0)
  const [countNinety, setCountNinety] = useState(0)
  const [countHundred, setCountHundred] = useState(0)
  const [data, setData] = useState([])
  const [dataRekbesar, setDataRekBesar] = useState([])
  const [dataRekap, setDataRekap] = useState([])
  const [progressmasters, setProgressmasters] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [p_pks, setP_pks] = useState(0)
  const [p_tekpol, setP_tekpol] = useState(0)
  const [p_hps, setP_hps] = useState(0)
  const [p_pengadaan, setP_pengadaan] = useState(0)
  const [p_sppbj, setP_sppbj] = useState(0)
  const [selectedValueRekBesar, setSelectedValueRekBesar] = useState('Mesin & Instalasi');

  const apiUrl = import.meta.env.VITE_API_MONICA

  type HousingData = {
    regional: string
    rkapAmount: number
    rkapPackage: number
    hpsAmount: string
    hpsPackage: number
    sppbjAmount: string
    sppbjPackage: number
  }

  const cdata: HousingData[] = [
    {
      regional: 'RPC1 (ex N3)',
      rkapAmount: 35.16,
      rkapPackage: 82,
      hpsAmount: '-',
      hpsPackage: 0,
      sppbjAmount: '#######',
      sppbjPackage: 89,
    },
    {
      regional: 'RPC2 (ex N4)',
      rkapAmount: 28.08,
      rkapPackage: 19,
      hpsAmount: '-',
      hpsPackage: 1,
      sppbjAmount: '#######',
      sppbjPackage: 12,
    },
    {
      regional: 'RPC3 (ex N5)',
      rkapAmount: 3.64,
      rkapPackage: 12,
      hpsAmount: '-',
      hpsPackage: 0,
      sppbjAmount: '#######',
      sppbjPackage: 14,
    },
    // Add more data as needed
  ]

  const handleClickProgrees = (progress: string) => {
    const data = dataRekap
    if (progress === 'keseluruhan') {
      const totalHPS = data.reduce((sum: any, item: any) => sum + item.hps, 0)
      const totalTekpol = data.reduce(
        (sum: any, item: any) => sum + item.total_tekpol,
        0
      )
      const totalPengadaan = data.reduce(
        (sum: any, item: any) => sum + item.pengadaan,
        0
      )
      const totalSPPBJ = data.reduce(
        (sum: any, item: any) => sum + item.sppbj,
        0
      )
      // Set state values
      setP_hps(totalHPS)
      setP_tekpol(totalTekpol)
      setP_pengadaan(totalPengadaan)
      setP_sppbj(totalSPPBJ)
    } else if (progress === 'ditn') {
      const targetSubInvestasi = [
        'Alat Pengangkutan (Transportasi)',
        'Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)',
        'Mesin & Instalasi',
      ]

      // Filter data berdasarkan target sub investasi
      const filteredData = data.filter((item: any) =>
        targetSubInvestasi.includes(item.sub_investasi)
      )

      // Sum nilai value_sppbj dari data yang difilter
      const hps = filteredData.reduce(
        (sum: any, item: any) => sum + item.hps,
        0
      )
      const totalTekpol = filteredData.reduce(
        (sum: any, item: any) => sum + item.total_tekpol,
        0
      )

      const totalPengadaan = filteredData.reduce(
        (sum: any, item: any) => sum + item.pengadaan,
        0
      )

      const totalSPPBJ = filteredData.reduce(
        (sum: any, item: any) => sum + item.sppbj,
        0
      )

      // Set state values
      setP_hps(hps)
      setP_tekpol(totalTekpol)
      setP_pengadaan(totalPengadaan)
      setP_sppbj(totalSPPBJ)
    } else if (progress == 'dtis') {
      const targetSubInvestasi = [
        'Jalan, Jembatan & Saluran Air',
        'Bangunan Perumahan',
        'Bangunan Perusahaan',
      ]

      // Filter data berdasarkan target sub investasi
      const filteredData = data.filter((item: any) =>
        targetSubInvestasi.includes(item.sub_investasi)
      )

      // Sum nilai value_sppbj dari data yang difilter
      const hps = filteredData.reduce(
        (sum: any, item: any) => sum + item.hps,
        0
      )
      const totalTekpol = filteredData.reduce(
        (sum: any, item: any) => sum + item.total_tekpol,
        0
      )

      const totalPengadaan = filteredData.reduce(
        (sum: any, item: any) => sum + item.pengadaan,
        0
      )

      const totalSPPBJ = filteredData.reduce(
        (sum: any, item: any) => sum + item.sppbj,
        0
      )

      // Set state values
      setP_hps(hps)
      setP_tekpol(totalTekpol)
      setP_pengadaan(totalPengadaan)
      setP_sppbj(totalSPPBJ)
    }
  }

  const getAllRecordsperRPCRekeningBesar = async (rekBesar: string) => {
    setLoading(true)
    try {
      const response = await fetch(
        `${apiUrl}/monica/getAllRecordsperRPCRekeningBesar`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            rekeningBesar: rekBesar,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()

      if (data) {
        setDataRekBesar(data)
          setLoading(false)
      }
    } catch (error: any) {
      console.error('Failed to fetch progress:', error.message)
    }
  }

  const fetchAllProgress = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/monica/getAllRecordsProgress`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({
          type: progressmasters,
        }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
        setLoading(false)
      }

      const data = await response.json()

      if (data) {
        setData(data)
        setTimeout(() => {
          setLoading(false)
        }, 1300)
      }
    } catch (error: any) {
      console.error('Failed to fetch progress:', error.message)
    }
  }

  const fetchAllRekap = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${apiUrl}/monica/getAllRekap`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
        setLoading(false)
      }

      const data = await response.json()

      if (data) {
        setDataRekap(data)

        const totalHPS = data.reduce((sum: any, item: any) => sum + item.hps, 0)
        const totalTekpol = data.reduce(
          (sum: any, item: any) => sum + item.total_tekpol,
          0
        )
        const totalPengadaan = data.reduce(
          (sum: any, item: any) => sum + item.pengadaan,
          0
        )
        const totalSPPBJ = data.reduce(
          (sum: any, item: any) => sum + item.sppbj,
          0
        )
        // Set state values
        setP_hps(totalHPS)
        setP_tekpol(totalTekpol)
        setP_pengadaan(totalPengadaan)
        setP_sppbj(totalSPPBJ)

        setTimeout(() => {
          setLoading(false)
        }, 1300)
      }
    } catch (error: any) {
      console.error('Failed to fetch progress:', error.message)
    }
  }

  const handleChange = (value: string) => {
    console.log('Selected Value:', value);
    setSelectedValueRekBesar(value);
    getAllRecordsperRPCRekeningBesar(value);
  };

  useEffect(() => {
    fetchAllRekap()
  }, [])

  useEffect(() => {
    if (progressmasters !== '') {
      fetchAllProgress()
    }
  }, [progressmasters])

  useEffect(() => {
    getAllRecordsperRPCRekeningBesar(selectedValueRekBesar);
  }
  , [selectedValueRekBesar]);

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <TopNav links={topNav} />

        <div className='ml-auto flex items-center space-x-4'>
          <Search />
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex w-full items-center justify-between rounded-lg bg-gradient-to-br p-4 shadow-2xl transition-shadow'>
          <div className='flex items-center space-x-2'>
            <FcDoughnutChart
              size={40}
              style={{ animation: 'spin 6s linear infinite' }}
            />
            <h1 className='text-2xl font-bold tracking-tight'>
              Dashboard Monica
            </h1>
          </div>

          {/* TopNav ke kanan */}
          <div className='flex space-x-2'>
            <TopNav links={topNavNew} className='text-end' />
          </div>
        </div>

        <div className='rounded-lg bg-gradient-to-r from-blue-500 to-green-500 p-6 shadow-lg'>
          <div className='flex flex-col lg:flex-row lg:items-center lg:justify-between'>
            <div>
              <h4 className='text-2xl font-bold text-white'>
                Selamat Datang Di MONICA
              </h4>
              <p className='text-white'>
                Monitoring Investasi Capital Expenditure PTPN IV
              </p>
            </div>
            <div className='mt-4 lg:mt-0' />
          </div>
        </div>

        <Tabs
          orientation='vertical'
          defaultValue='keseluruhan'
          className='space-y-4'
        >
          <div className='w-full overflow-x-auto pt-5'>
            <TabsList>
              <TabsTrigger
                value='keseluruhan'
                onClick={() => handleClickProgrees('keseluruhan')}
              >
                Keseluruhan
              </TabsTrigger>
              <TabsTrigger
                value='paketPekerjaan'
                onClick={() => handleClickProgrees('ditn')}
              >
                Investasi Tanaman (DITN)
              </TabsTrigger>
              <TabsTrigger
                value='regional'
                onClick={() => handleClickProgrees('dtis')}
              >
                Infrastruktur (DINF)
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>

        <div className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5'>
          {/* Progress Di <br/> PKS */}
          <button
            className='text-start'
            onClick={() => {
              setProgressmasters('pks')
            }}
          >
            <div className='flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900  dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-lg font-semibold'>
                    PROGRESS DI <br /> Unit
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {p_pks}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/pks.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>
          <button
            className='text-start'
            onClick={() => {
              setProgressmasters('tekpol')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-lg font-semibold'>
                    PROGRESS DI <br /> TEKPOL
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {p_tekpol}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img
                  src='/tekpol.png'
                  alt='PKS'
                  className='w-16'
                  style={{ animation: 'spin 6s linear infinite' }}
                />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>
          <button
            className='text-start'
            onClick={() => {
              setProgressmasters('hps')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-lg font-semibold'>
                    PROGRESS DI <br /> HPS
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {p_hps}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/hps.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>
          <button
            className='text-start'
            onClick={() => {
              setProgressmasters('pengadaan')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-lg font-semibold'>
                    PROGRESS DI <br /> PENGADAAN
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {p_pengadaan}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/pengadaan.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>
          <button
            className='text-start'
            onClick={() => {
              setProgressmasters('sppbj')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-lg font-semibold'>
                    <br />
                    Terbit SPPBJ
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {p_sppbj}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/sppbj.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>
        </div>

        <div className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5'>
          {/* Progress Di <br/> PKS */}
          <button
            className='text-end'
            onClick={() => {
              setProgressmasters('pks')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-start text-lg font-semibold'>
                    PROGRESS <br />
                    0%
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {countZero}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/progress.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>
          <button
            className='text-end'
            onClick={() => {
              setProgressmasters('p_0')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-start text-lg font-semibold'>
                    PROGRESS <br />
                    1% - 40%
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {countFourty}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/progress.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>

          <button
            className='text-start'
            onClick={() => {
              setProgressmasters('hps')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-start text-lg font-semibold'>
                    PROGRESS <br />
                    41% - 60%
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {countSixty}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/progress.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>
          <button
            className='text-start'
            onClick={() => {
              setProgressmasters('pengadaan')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-start text-lg font-semibold'>
                    PROGRESS <br />
                    61% - 99%
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {countNinety}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/progress.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>

          <button
            className='text-start'
            onClick={() => {
              setProgressmasters('sppbj')
            }}
          >
            <div className=' flex flex-col justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/30 dark:from-slate-900 dark:to-slate-950'>
              <div className='flex items-center justify-between'>
                <div>
                  <h4 className='mb-2 text-start text-lg font-semibold'>
                    PROGRESS <br />
                    100%
                  </h4>
                  <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                    {countHundred}{' '}
                    <span className='text-lg text-green-300'>PAKET</span>
                  </h2>
                </div>
                <img src='/progress.png' alt='PKS' className='w-16' />
              </div>
              <div className='text-end'>
                <span className='text-green-3 00 cursor-pointer text-sm font-semibold'>
                  LIHAT DETAIL →
                </span>
              </div>
            </div>
          </button>
        </div>
        {progressmasters !== '' ? (
          <div className='mt-5 flex h-full w-full items-center justify-center'>
            <div className='w-full rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900'>
              <div className='flex'>
                <h2 className='text-2xl font-semibold'>
                  <img
                    width='30'
                    height='30'
                    className='float-left mb-5 ml-auto mr-3'
                    src='https://img.icons8.com/flat-round/3 0/bar-chart--v1.png'
                    alt='bar-chart--v1'
                  />
                  Progress Pekerjaan Di{' '}
                  <span className='uppercase'> {progressmasters}</span>
                </h2>
                <Button
                  className='ml-auto'
                  onClick={() => setProgressmasters('')}
                >
                  Kembali
                </Button>
              </div>

              {progressmasters !== '' ? (
                loading ? (
                  // Membuat elemen di tengah secara vertikal dan horizontal
                  <div className='mt-5 flex h-full items-center justify-center'>
                    <Loading />
                  </div>
                ) : error ? (
                  <p>Error fetching data</p>
                ) : (
                  <>
                    <DataTable data={data} columns={columns} />
                  </>
                )
              ) : null}
            </div>
          </div>
        ) : null}
        {progressmasters == '' ? (
          <Tabs
            orientation='vertical'
            defaultValue='keseluruhan'
            className='space-y-4'
          >
            <div className='w-full overflow-x-auto pt-5'>
              <TabsList>
                <TabsTrigger value='keseluruhan'>Keseluruhan</TabsTrigger>
                <TabsTrigger value='paketPekerjaan'>
                  Paket Pekerjaan
                </TabsTrigger>
                <TabsTrigger value='regional'>Regional</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value='keseluruhan' className='space-y-4'>
              <div className='mt-5 flex h-full w-full items-center justify-center'>
                <div className='0 w-full  rounded-lg border-2 bg-slate-50 bg-gradient-to-bl p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-900  dark:to-slate-950 '>
                  <div className='flex'>
                    <h2 className='text-2xl font-semibold capitalize'>
                      <img
                        width='30'
                        height='30'
                        className='float-left mb-5 ml-auto mr-3'
                        src='https://img.icons8.com/flat-round/3 0/bar-chart--v1.png'
                        alt='bar-chart--v1'
                      />
                      Rekapitulasi Progress Pekerjaan Investasi
                    </h2>
                    <br />
                  </div>
                  {loading ? (
                    <div className='flex h-full items-center justify-center'>
                      <Loading />
                    </div>
                  ) : error ? (
                    <p>Error fetching data</p>
                  ) : (
                    <DataTable data={dataRekap} columns={colRekap} />
                  )}
                </div>
              </div>
            </TabsContent>
            <TabsContent value='paketPekerjaan' className='space-y-4'>
              <div className='mt-5 flex h-full w-full items-center justify-center'>
                <div className='0 w-full  rounded-lg border-2 bg-slate-50 bg-gradient-to-bl p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-900  dark:to-slate-950 '>
                  <div className='flex'>
                    <h2 className='text-2xl font-semibold capitalize'>
                      <img
                        width='30'
                        height='30'
                        className='float-left mb-5 ml-auto mr-3'
                        src='https://img.icons8.com/flat-round/3 0/bar-chart--v1.png'
                        alt='bar-chart--v1'
                      />
                      Rekapitulasi Progress Paket Pekerjaan {selectedValueRekBesar}
                    </h2>
                    <br />
                  </div>
                  {loading ? (
                    <div className='flex h-full items-center justify-center'>
                      <Loading />
                    </div>
                  ) : error ? (
                    <p>Error fetching data</p>
                  ) : (
                    <>
                      <Select defaultValue={selectedValueRekBesar} onValueChange={handleChange}>
                        <SelectTrigger className='w-[400px] float-end'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value='Mesin & Instalasi'>
                              Mesin & Instalasi
                            </SelectItem>
                            <SelectItem value='Investasi Kecil (Alat Pertanian & Perlengkapan Kantor)'>
                              Investasi Kecil (Alat Pertanian & Perlengkapan
                              Kantor)
                            </SelectItem>
                            <SelectItem value='Bangunan Perumahan'>
                              Bangunan Perumahan
                            </SelectItem>
                            <SelectItem value='Bangunan Perusahaan'>
                              Bangunan Perusahaan
                            </SelectItem>
                            <SelectItem value='Jalan, Jembatan & Saluran Air'>
                              Jalan, Jembatan & Saluran Air
                            </SelectItem>
                            <SelectItem value='Alat Pengangkutan (Transportasi)'>
                              Alat Pengangkutan (Transportasi)
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <DataTablePekerjaan sub_investasi={selectedValueRekBesar} data={dataRekbesar} columns={colPekerjaan} />
                    </>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        ) : null}
      </Layout.Body>
    </Layout>
  )
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
      isActive: false,
    },
    {
      title: 'Monica',
      href: '/dashboard-monica',
      isActive: true,
    },
  ]
} else {
  topNav = []
}

const topNavNew = [
  {
    title: 'Investasi Awal (SINUSA)',
    href: '/investasi-awal',
    isActive: false,
  },
  {
    title: 'Sumber IPS',
    href: '/sumber-ips',
    isActive: false,
  },
  {
    title: 'Progress Lap. Investasi',
    href: '/sumber-ips',
    isActive: false,
  },
]