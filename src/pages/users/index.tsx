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

export default function Tasks() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const apiUrl = import.meta.env.VITE_API_MASTER
  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${apiUrl}/users`)
      setUsers(response.data.payload)
    } catch (error: any) {
      console.error('Error fetching users:', error)
      setError(error)
    } finally {
      setTimeout(() => {
        setLoading(false)
      }, 2200)
    }
  }

  useEffect(() => {
    fetchUsers()
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
              Data Users
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of users in the system!
            </p>
          </div>
          <div className='ml-auto flex space-x-2'>
            <Link to='/upload-users'>
              <Button>Upload User</Button>
            </Link>
            <Link to='/create-users'>
              <Button>Create User</Button>
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
            <p>Error fetching users</p>
          ) : (
            <DataTable data={users} columns={columns} onRefresh={fetchUsers} />
          )}
        </div>
      </Layout.Body>
    </Layout>
  )
}
