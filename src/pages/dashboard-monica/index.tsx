import { useState, useEffect } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { FcDoughnutChart } from 'react-icons/fc'
import { TopNav } from '@/components/top-nav'

export default function Tasks() {
  const [countAll, setCountAll] = useState(0)
  const [countZero, setCountZero] = useState(0)
  const [countFourty, setCountFourty] = useState(0)
  const [countSixty, setCountSixty] = useState(0)
  const [countNinety, setCountNinety] = useState(0)
  const [countHundred, setCountHundred] = useState(0)
  const [data , setData] = useState([])

  const [p_pks, setP_pks] = useState(0)
  const [p_tekpol, setP_tekpol] = useState(0)
  const [p_hps, setP_hps] = useState(0)
  const [p_pengadaan, setP_pengadaan] = useState(0)
  const [p_sppbj, setP_sppbj] = useState(0)

  const apiUrl = import.meta.env.VITE_API_MONICA

  const fetchCountProgreses = async () => {
    const Tahun = new Date().getFullYear()
    try {
      const response = await fetch(`${apiUrl}/monica/countAllResults`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ tahun: Tahun }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status == 200) {
        setCountAll(data.countAll)
        setCountZero(data.countZero)
        setCountFourty(data.countFourty)
        setCountSixty(data.countSixty)
        setCountNinety(data.countNinety)
        setCountHundred(data.countHundred)
      }
    } catch (error: any) {
      console.error('Failed to fetch count:', error.message)
    }
  }

  const fetchProgressSummary = async () => {
    const Tahun = new Date().getFullYear()
    try {
      const response = await fetch(`${apiUrl}/monica/getProgressSummary`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ tahun: Tahun }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`)
      }

      const data = await response.json()

      if (data.status == 200) {
        setP_pks(data.p_pks)
        setP_tekpol(data.p_tekpol)
        setP_hps(data.p_hps)
        setP_pengadaan(data.p_pengadaan)
        setP_sppbj(data.p_sppbj)
      }
    } catch (error: any) {
      console.error('Failed to fetch progress:', error.message)
    }
  }

  useEffect(() => {
    fetchCountProgreses()
    fetchProgressSummary()
  }, [])

  return (
    <Layout>
      {/* ===== Top Heading ===== */}
      <Layout.Header sticky>
        <TopNav links={topNav} />

        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <FcDoughnutChart size={40} />
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
          <div className='flex flex-col xl:flex-row xl:items-center xl:justify-between'>
            <div>
              <h4 className='text-2xl font-bold text-white'>
                Selamat Datang Di MONICA
              </h4>
              <p className='text-white'>
                Monitoring Pekerjaan Lapangan Capital Expenditure PTPN IV
              </p>
            </div>
            <div className='mt-4 xl:mt-0' />
          </div>
        </div>

        <div className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5'>
          {/* Progress Di <br/> PKS */}
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PROGRESS DI <br /> Unit
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {p_pks} <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/pks.png' alt='PKS' className='w-16' />
            </div>
          </a>
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PROGRESS DI <br /> TEKPOL
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {p_tekpol}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/tekpol.png' alt='PKS' className='w-16' />
            </div>
          </a>
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PROGRESS DI <br /> HPS
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {p_hps}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/hps.png' alt='PKS' className='w-16' />
            </div>
          </a>
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PROGRESS DI <br /> PENGADAAN
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {p_pengadaan}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/pengadaan.png' alt='PKS' className='w-16' />
            </div>
          </a>
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  <br />
                  Terbit SPPBJ
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {p_sppbj}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/sppbj.png' alt='PKS' className='w-16' />
            </div>
          </a>
        </div>

        <div className='mt-5 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-5'>
          {/* Progress Di <br/> PKS */}
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PROGRESS <br />
                  0%
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {countZero}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/progress.png' alt='PKS' className='w-16' />
            </div>
          </a>
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PROGRESS <br />
                  1% - 40%
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {countFourty}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/progress.png' alt='PKS' className='w-16' />
            </div>
          </a>
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PROGRESS <br />
                  41% - 60%
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {countSixty}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/progress.png' alt='PKS' className='w-16' />
            </div>
          </a>
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PROGRESS <br />
                  61% - 99%
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {countNinety}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/progress.png' alt='PKS' className='w-16' />
            </div>
          </a>
          <a>
            <div className='flex items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md hover:shadow-lg hover:shadow-green-300/50 dark:from-slate-900 dark:to-slate-950'>
              <div>
                <h4 className='mb-2 text-lg font-semibold'>
                  PEKERJAAN SELESAI <br />
                  100%
                </h4>
                <h2 className='text-3xl font-bold text-gray-900 dark:text-white'>
                  {countHundred}{' '}
                  <span className='text-lg text-green-500'>PAKET</span>
                </h2>
              </div>
              <img src='/progress.png' alt='PKS' className='w-16' />
            </div>
          </a>
        </div>
      </Layout.Body>
    </Layout>
  )
}

const topNav = [
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
