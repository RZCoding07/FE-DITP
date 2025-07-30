import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns.1.tsx'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '@/components/ui/loading'
import cookie from 'js-cookie'
export default function Tasks() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_IMMATURE


  const user = cookie.get('user')
  const fullname = user ? JSON.parse(user).fullname : 'user'
  const account_type = user ? JSON.parse(user).account_type : 'user'

  const fetchData = async () => {
    try {
      const response = await axios.get(`${apiUrl}/luas-areal-statement`)
      setData(response.data)
      setLoading(false)
    } catch (error: any) {
      setError(error)
    }
  }

  useEffect(() => {
    fetchData()
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
        <div className='mb-2 flex w-full items-center justify-between rounded-lg border-2 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Data Luas Areal Statement
            </h2>
          </div>
      {account_type === 'Superadmin' && (
      
          <div className='ml-auto flex space-x-2'>
            <Link to='/upload-areal-statement'>
              <Button>Upload Data</Button>
            </Link>

          </div>
      )}    
        </div>  

        <div className='flex-1 overflow-auto rounded-lg bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0'>
          <div className='flex-1 overflow-auto rounded-lg bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0'>
            {loading ? (
              // make center div h-full
              <div className='flex h-full items-center justify-center'>
                <Loading />
              </div>
            ) : error ? (
              <p>Error fetching lokasi bibitan</p>
            ) : (
              <DataTable data={data} columns={columns} />
            )}
          </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}
