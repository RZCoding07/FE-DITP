import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { columns as colPkt } from './components/col-pkt-pekerjaan'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '@/components/ui/loading'

export default function Awal() {
  const [Awal, setAwal] = useState([])
  const [PktPekerjaan, setPktPekerjaan] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_MONICA
  const fetchMonitoringSPPBJ = async () => {
    setLoading(true)
    const tahun = new Date().getFullYear()
    try {
      const response = await axios.get(`${apiUrl}/monica/getAllRecordsMSPPBJ`)
      setAwal(response.data)
    } catch (error: any) {
      console.error('Error fetching Awal:', error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }
  const fetchPktPekerjaan = async () => {
    setLoading(true)
    const tahun = new Date().getFullYear()
    try {
      const response = await axios.get(
        `${apiUrl}/monica/getAllRecordsPaketPekerjaan`
      )
      setPktPekerjaan(response.data)
    } catch (error: any) {
      console.error('Error fetching Awal:', error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }

  useEffect(() => {
    fetchMonitoringSPPBJ()
    fetchPktPekerjaan()
  }, [])

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
        <div className='mb-2 bg-slate-50 flex w-full items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Data Paket Pekerjaan (IPS)
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Paket Pekerjaan in the system!
            </p>
          </div>
          {/* <div className='ml-auto flex space-x-2'>
            <Link to='/upload-paket-pekerjaan-monica'>
              <Button>Upload Data</Button>
            </Link>
          </div> */}
        </div>

        <div className='flex-1 bg-slate-50 overflow-auto rounded-lg bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching Awal</p>
          ) : (
            <DataTable
              data={PktPekerjaan}
              columns={colPkt}
              onRefresh={fetchPktPekerjaan}
            />
          )}
        </div>
      </Layout.Body>

      <Layout.Body>
        <div className='mb-2 bg-slate-50 flex w-full items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Data Monitoring SPPBJ
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Monitoring SPPBJ in the system!
            </p>
          </div>
          {/* <div className='ml-auto flex space-x-2'>
            <Link to='/upload-sppbj-monica'>
              <Button>Upload Data</Button>
            </Link>
          </div> */}
        </div>

        <div className='flex-1 bg-slate-50 overflow-auto rounded-lg bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching Awal</p>
          ) : (
            <DataTable
              data={Awal}
              columns={columns}
              onRefresh={fetchMonitoringSPPBJ}
            />
          )}
        </div>
      </Layout.Body>
    </Layout>
  )
}
