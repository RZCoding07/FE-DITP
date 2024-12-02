import { useEffect, useState } from 'react'
import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns.tsx'
import { columns as colLocation } from './components/columns-stock-location-nursery'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { Loading } from '@/components/ui/loading'

export default function Tasks() {
  const [LokasiBibitan, setLokasiBibitan] = useState([])
  const [varietasBibitan, setVarietasBibitan] = useState([])
  const [SeleksiBibitan, setSeleksiBibitan] = useState([])
  const [dataNormaPn, setDataNormaPn] = useState([])
  const [dataNormaMn, setDataNormaMn] = useState([])
  const [dataWeeklyReport, setDataWeeklyReport] = useState([])

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
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Master Data Norma PN (Pre Nursery)
            </h2>
          </div>

        </div>
        <div className='ml-auto flex space-x-2'>
            <Link to='/create-norma-pn-bibitan'>
              <Button>Tambah Data</Button>
            </Link>
            <Link to='/upload-norma-pn-bibitan'>
              <Button>Upload Data</Button>
            </Link>
          </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching lokasi bibitan</p>
          ) : (
            <DataTable data={dataNormaPn} columns={columns} />

          )}
        </div>
        </div>
      </Layout.Body>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Master Data Norma MN (Main Nursery)
            </h2>
          </div>

        </div>
        <div className='ml-auto flex space-x-2'>
            <Link to='/create-norma-mn-bibitan'>
              <Button>Tambah Data</Button>
            </Link>
            <Link to='/upload-norma-mn-bibitan'>
              <Button>Upload Data</Button>
            </Link>
          </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching lokasi bibitan</p>
          ) : (
            <DataTable data={dataNormaMn} columns={columns} />

          )}
        </div>
        </div>
      </Layout.Body>


      <Layout.Body>
        <div className='mb-2 flex items-center justify-between'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Data Lokasi Bibitan
            </h2>
            <div className='ml-auto flex space-x-2'>
            <Link to='/upload-stok-lokasi-bibitan'>
              <Button>Tambah Data</Button>
            </Link>
            <Link to='/upload-stok-lokasi-bibitan'>
              <Button>Upload Data</Button>
            </Link>
          </div>
          </div>

        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching lokasi bibitan</p>
          ) : (
            <DataTable data={LokasiBibitan} columns={colLocation} />
          )}
        </div>
      </Layout.Body>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between'>
          <div className='space-y-0.5'>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Data Hasil Seleksi Bibitan
            </h2>
            <div className='ml-auto flex space-x-2'>
            <Link to='/tambah-data-hasil-seleksi-bibitan'>
              <Button> Tambah Data</Button>
            </Link>
            <Link to='/upload-hasil-seleksi-bibitan'>
              <Button>Upload Data</Button>
            </Link>
          </div>
          </div>

        </div>

        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching hasil seleksi bibitan</p>
          ) : (
            <DataTable data={SeleksiBibitan} columns={columns} />
          )}
        </div>
      </Layout.Body>


      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>
            Data Stok Bibitan
            </h2>
          </div>

        </div>
        <div className='ml-auto flex space-x-2'>
            <Link to='/create-uraian-pekerjaan-immature'>
              <Button>Tambah Data</Button>
            </Link>
            <Link to='/upload-uraian-pekerjaan-immature'>
              <Button>Upload Data</Button>
            </Link>
          </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching lokasi bibitan</p>
          ) : (
            <DataTable data={dataNormaPn} columns={columns} />

          )}
        </div>
        </div>
      </Layout.Body>


      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Weekly Report Bibitan
            </h2>
          </div>

        </div>
        <div className='ml-auto flex space-x-2'>
            <Link to='/create-uraian-pekerjaan-immature'>
              <Button>Tambah Data</Button>
            </Link>
            <Link to='/upload-uraian-pekerjaan-immature'>
              <Button>Upload Data</Button>
            </Link>
          </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching lokasi bibitan</p>
          ) : (
            <DataTable data={dataNormaPn} columns={columns} />

          )}
        </div>
        </div>
      </Layout.Body>

      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Timeline Nursery Bibitan
            </h2>
          </div>

        </div>
        <div className='ml-auto flex space-x-2'>
            <Link to='/create-uraian-pekerjaan-immature'>
              <Button>Tambah Data</Button>
            </Link>
            <Link to='/upload-uraian-pekerjaan-immature'>
              <Button>Upload Data</Button>
            </Link>
          </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
          {loading ? (
            // make center div h-full
            <div className='flex h-full items-center justify-center'>
              <Loading />
            </div>
          ) : error ? (
            <p>Error fetching lokasi bibitan</p>
          ) : (
            <DataTable data={dataNormaPn} columns={columns} />

          )}
        </div>
        </div>
      </Layout.Body>


    </Layout>
  )
}
