import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import axios from 'axios'
import cookie from 'js-cookie'

import { Layout } from '@/components/custom/layout'
import { Search } from '@/components/search'
import ThemeSwitch from '@/components/theme-switch'
import { UserNav } from '@/components/user-nav'
import { DataTable } from './components/data-table'
import { columns } from './components/columns'
import { Button } from '@/components/custom/button'
import { Link } from 'react-router-dom'
import { Loading } from '@/components/ui/loading'

export default function Tasks() {
  const user = cookie.get('user')
  const fullname = user ? JSON.parse(user).fullname : ''
  const navigate = useNavigate()
  const [dataNormaImmature, setDataNormaImmature] = useState([])
  const apiUrl = import.meta.env.VITE_API_IMMATURE
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const getDataNormaImmature = async () => {
      setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/master-uraian-pekerjaan`)

      if (response.status === 200) {
        setDataNormaImmature(response.data.payload)
      }
    } catch (error) {
      console.error(error)
    }
    setTimeout(() => {
      setLoading(false)
    }, 2200)

  }

  useEffect(() => {
    getDataNormaImmature()
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
              Master Data Norma TBM (Immature)
            </h2>
          </div>

        </div>
        <div className='ml-auto flex space-x-2'>
            <Link to='/create-uraian-pekerjaan-immature'>
              <Button>Tambah Data</Button>
            </Link>
            <Link to='/upload-uraian-pekerjaan-immature'>
              <Button>Upload</Button>
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
            <DataTable data={dataNormaImmature} columns={columns} />

          )}
        </div>
        </div>
      </Layout.Body>
      <Layout.Body>
        <div className='mb-2 flex items-center justify-between space-y-2'>
          <div>
            <h2 className='text-2xl font-semibold tracking-tight'>
              Master Data Norma TM (Mature)
            </h2>
          </div>

        </div>
        <div className='ml-auto flex space-x-2'>
            <Link to='/create-uraian-pekerjaan-immature'>
              <Button>Tambah Data</Button>
            </Link>
            <Link to='/upload-uraian-pekerjaan-immature'>
              <Button>Upload</Button>
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
            <DataTable data={dataNormaImmature} columns={columns} />

          )}
        </div>
        </div>
      </Layout.Body>
    </Layout>
  )
}
