import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns.tsx'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '@/components/ui/loading'

export default function Tasks() {
  const [LokasiBibitan, setLokasiBibitan] = useState([])
  const [SeleksiBibitan, setSeleksiBibitan] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_NURSERY


  const fetchLokasiBibitan = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/stok-bibit`)
      setLokasiBibitan(response.data.payload)
      console.log(response.data.payload)
    } catch (error: any) {
      console.error('Error fetching LokasiBibitan:', error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }


  const fetchSeleksiBibitan = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/hasil-seleksi`)
      setSeleksiBibitan(response.data.payload)
    } catch (error: any) {
      console.error('Error fetching SeleksiBibitan:', error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }

  useEffect(() => {
    fetchLokasiBibitan()
    fetchSeleksiBibitan()
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
              Data Master Uraian Pekerjaan
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of all the tasks that need to be done.
            </p>
          </div>
          <div className='ml-auto flex space-x-2'>
            <Link to='/create-uraian-pekerjaan-replanting'>
              <Button>Tambah Data Uraian Pekerjaan Replanting</Button>
            </Link>
            <Link to='/upload-uraian-pekerjaan-replanting'>
              <Button>Upload Uraian Pekerjaan Replanting</Button>
            </Link>
          </div>
        </div>


      </Layout.Body>
    </Layout>
  )
}
