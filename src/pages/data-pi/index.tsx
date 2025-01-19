import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns.1'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '@/components/ui/loading'
import cookies from 'js-cookie'

export default function Awal() {
const [Awal, setAwal] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_IMMATURE

  const user = cookies.get('user')

  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'

  const fetchInvesAwal = async () => {
    setLoading(true)
    const tahun = new Date().getFullYear()
    try {
      const response = await axios.get(`${apiUrl}/why`, {})
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

  useEffect(() => {
    fetchInvesAwal()
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
        <div className='mb-2 flex w-full items-center justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Data Why PICA TBM
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Pengukuran Vegetatif in the system!
            </p>
          </div>
          {/* {(account_type === 'HO PalmCo' || account_type === 'Superadmin' ) && ( */}
          <div className='ml-auto flex space-x-2'>
            <Link to='/upload-problem-identification'>
              <Button>Upload Data</Button>
            </Link>
          </div>
          {/* )} */}
        </div>

        <div className='flex-1 overflow-auto rounded-lg bg-slate-50 bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching Awal</p>
          ) : (
            <DataTable data={Awal} columns={columns} />
          )}
        </div>
      </Layout.Body>
    </Layout>
  )
}
