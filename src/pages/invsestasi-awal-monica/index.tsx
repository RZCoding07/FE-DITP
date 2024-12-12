import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '@/components/ui/loading'

export default function Awal() {
  const [Awal, setAwal] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_MONICA
  const fetchInvesAwal = async () => {
    setLoading(true)
    const tahun = new Date().getFullYear()
    try {
      const response = await axios.post(`${apiUrl}/monica/getAllRecordsAwal`, {
        tahun: 2025
      })
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
        <div className='mb-2 flex items-center justify-between'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Data Investasi Awal (SINUSA)
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of Awal in the system!
            </p>
          </div>
          <div className='ml-auto flex space-x-2'>
            <Link to='/upload-awal'>
              <Button>Upload Data</Button>
            </Link>
            <Link to='/create-awal'>
              <Button>Create Data</Button>
            </Link>
          </div>
        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching Awal</p>
          ) : (
            <DataTable data={Awal} columns={columns} onRefresh={fetchInvesAwal} />
          )}
        </div>
      </Layout.Body>
    </Layout>
  )
}
