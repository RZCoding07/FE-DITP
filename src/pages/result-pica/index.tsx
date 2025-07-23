"use client"

import { useEffect, useState, useCallback } from "react"
import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import ThemeSwitch from "@/components/theme-switch"
import { UserNav } from "@/components/user-nav"
import { DataTable } from "./components/data-table"
import { columns } from "./components/columns"
import axios from "axios"
import { Loading } from "@/components/ui/loading"
import cookies from "js-cookie"

export default function Awal() {
  const [picaData, setPicaData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalRows, setTotalRows] = useState(0)
  const apiUrl = import.meta.env.VITE_API_IMMATURE
  const user = cookies.get("user")
  const fullname = user ? JSON.parse(user).fullname : "user"
  const account_type = user ? JSON.parse(user).account_type : "user"
  const rpc = user ? JSON.parse(user).rpc : "user"
  const kebun = user ? JSON.parse(user).kebun : "user"

  const fetchPICA = async (newPage = page, newPageSize = pageSize, newSearchTerm = searchTerm) => {
    try {
      setLoading(true)

      const params: Record<string, any> = {
        page: newPage,
        limit: newPageSize,
        kebun: kebun,
        regional: rpc,
      }
      
      // Only add search if it's not empty
      if (newSearchTerm && newSearchTerm.trim() !== "") {
        params.search = newSearchTerm.trim()
      }

      console.log("Fetching with params:", params)

      const response = await axios.get(`${apiUrl}/pica-all`, { params })
      
      setPicaData(response.data.data || [])
      setTotalRows(response.data.pagination.totalRows)
      setError(null)
    } catch (error: any) {
      console.error("Error fetching PICA:", error)
      setError(error)
      setPicaData([]) // Clear data on error
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage)
    fetchPICA(newPage, pageSize, searchTerm)
  }, [pageSize, searchTerm])

  const handleSearch = useCallback((term: string) => {
    console.log("Search term:", term)
    setSearchTerm(term)
    setPage(1) // Reset to first page for new search
    fetchPICA(1, pageSize, term)
  }, [pageSize])

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size)
    setPage(1) // Reset to first page when page size changes
    fetchPICA(1, size, searchTerm)
  }, [searchTerm])

  // Initial load
  useEffect(() => {
    fetchPICA()
  }, [])

  return (
    <Layout>
      <Layout.Header sticky>
        <Search />
        <div className="ml-auto flex items-center space-x-4">
          <ThemeSwitch />
          <UserNav />
        </div>
      </Layout.Header>

      <Layout.Body>
        <div className="mb-2 flex w-full items-center justify-between rounded-lg border-2 bg-slate-50 bg-gradient-to-br p-4 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-semibold tracking-tight">Monitoring PICA TBM</h2>
            <p className="text-muted-foreground">Here&apos;s a list of all the PICA TBM</p>
          </div>
        </div>

        <div className="flex-1 overflow-auto rounded-lg bg-slate-50 bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0">
          {loading && picaData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loading />
            </div>
          ) : error ? (
            <div className="flex h-full items-center justify-center flex-col">
              <p className="text-red-500 mb-2">
                Error fetching data: {error instanceof Error ? error.message : "Unknown error"}
              </p>
              <button
                onClick={() => fetchPICA()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <DataTable
              data={picaData}
              columns={columns}
              onSearch={handleSearch}
              searchTerm={searchTerm}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              currentPage={page}
              onPageChange={handlePageChange}
              totalRows={totalRows}
            />
          )}
        </div>
      </Layout.Body>
    </Layout>
  )
}
