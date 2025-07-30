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
import { exportToExcel } from "@/utils/excel-export"
import { exportDetailedToExcel } from "@/utils/excel-export-detailed"
import { toast } from "@/components/ui/use-toast"

export default function Awal() {
  const [picaData, setPicaData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingNoCa, setLoadingNoCa] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const [totalRows, setTotalRows] = useState(0)

  const apiUrl = import.meta.env.VITE_API_IMMATURE
  const user = cookies.get("user")

  const rpc = user ? JSON.parse(user).rpc : "user"
  const kebun = user ? JSON.parse(user).kebun : "user"

  const [picaNoCaData, setPicaNoCaData] = useState<any[]>([])
  const [pageNoCa, setPageNoCa] = useState(1)
  const [pageSizeNoCa, setPageSizeNoCa] = useState(20)
  const [searchTermNoCa, setSearchTermNoCa] = useState("")
  const [errorNoCa, setErrorNoCa] = useState<Error | null>(null)
  const [totalRowsNoCa, setTotalRowsNoCa] = useState(0)

  const fetchPICA = async (newPage = page, newPageSize = pageSize, newSearchTerm = searchTerm) => {
    try {
      setLoading(true)
      const params: Record<string, any> = {
        page: newPage,
        limit: newPageSize,
        kebun: kebun,
        regional: rpc,
      }

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

  const fetchPICANoCa = async (newPage = pageNoCa, newPageSize = pageSizeNoCa, newSearchTerm = searchTermNoCa) => {
    try {
      setLoadingNoCa(true)
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

      console.log("Fetching No CA with params:", params)
      const response = await axios.get(`${apiUrl}/pica-no-ca`, { params })

      setPicaNoCaData(response.data.data || [])
      setTotalRowsNoCa(response.data.pagination.totalRows)
      setErrorNoCa(null)
    } catch (error: any) {
      console.error("Error fetching PICA No CA:", error)
      setErrorNoCa(error)
      setPicaNoCaData([]) // Clear data on error
    } finally {
      setLoadingNoCa(false)
    }
  }

  // Fetch all data for export (without pagination)
  const fetchAllPICAForExport = async () => {
    try {
      const params: Record<string, any> = {
        kebun: kebun,
        regional: rpc,
        limit: 100000, // Use existing data length or a large number to get all data
      }

      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm.trim()
      }

      const response = await axios.get(`${apiUrl}/pica-all`, { params })
      return response.data.data || []
    } catch (error) {
      console.error("Error fetching all PICA data for export:", error)
      throw error
    }
  }

  const fetchAllPICANoCaForExport = async () => {
    try {
      const params: Record<string, any> = {
        kebun: kebun,
        regional: rpc,
        limit: 100000, // Use existing data length or a large number to get all data
      }

      if (searchTermNoCa && searchTermNoCa.trim() !== "") {
        params.search = searchTermNoCa.trim()
      }

      const response = await axios.get(`${apiUrl}/pica-no-ca`, { params })
      return response.data.data || []
    } catch (error) {
      console.error("Error fetching all PICA No CA data for export:", error)
      throw error
    }
  }

  const handleDownloadPICA = async () => {
    try {
      toast({
        title: "Preparing download...",
        description: "Fetching all data for export",
      })

      const allData = await fetchAllPICAForExport()

      exportDetailedToExcel({
        data: allData,
        filename: `PICA_TBM_${kebun}_${rpc}`,
        sheetName: "PICA TBM",
      })

      toast({
        title: "Download successful!",
        description: `Exported ${allData.length} records to Excel`,
      })
    } catch (error) {
      console.error("Error downloading PICA data:", error)
      toast({
        title: "Download failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  const handleDownloadPICANoCa = async () => {
    try {
      toast({
        title: "Preparing download...",
        description: "Fetching all No CA data for export",
      })

      const allData = await fetchAllPICANoCaForExport()

      exportToExcel({
        data: allData,
        filename: `PICA_No_CA_${kebun}_${rpc}`,
        sheetName: "PICA No CA",
      })

      toast({
        title: "Download successful!",
        description: `Exported ${allData.length} records to Excel`,
      })
    } catch (error) {
      console.error("Error downloading PICA No CA data:", error)
      toast({
        title: "Download failed",
        description: "There was an error exporting the data",
        variant: "destructive",
      })
    }
  }

  const handlePageChange = useCallback(
    (newPage: number) => {
      setPage(newPage)
      fetchPICA(newPage, pageSize, searchTerm)
    },
    [pageSize, searchTerm],
  )

  const handleSearch = useCallback(
    (term: string) => {
      console.log("Search term:", term)
      setSearchTerm(term)
      setPage(1) // Reset to first page for new search
      fetchPICA(1, pageSize, term)
    },
    [pageSize],
  )

  const handlePageSizeChange = useCallback(
    (size: number) => {
      setPageSize(size)
      setPage(1) // Reset to first page when page size changes
      fetchPICA(1, size, searchTerm)
    },
    [searchTerm],
  )

  const handlePageChangeNoCa = useCallback(
    (newPage: number) => {
      setPageNoCa(newPage)
      fetchPICANoCa(newPage, pageSizeNoCa, searchTermNoCa)
    },
    [pageSizeNoCa, searchTermNoCa],
  )

  const handleSearchNoCa = useCallback(
    (term: string) => {
      console.log("Search No CA term:", term)
      setSearchTermNoCa(term)
      setPageNoCa(1) // Reset to first page for new search
      fetchPICANoCa(1, pageSizeNoCa, term)
    },
    [pageSizeNoCa],
  )

  const handlePageSizeChangeNoCa = useCallback(
    (size: number) => {
      setPageSizeNoCa(size)
      setPageNoCa(1) // Reset to first page when page size changes
      fetchPICANoCa(1, size, searchTermNoCa)
    },
    [searchTermNoCa],
  )

  // Initial load
  useEffect(() => {
    fetchPICA()
    fetchPICANoCa()
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
              onDownload={handleDownloadPICA}
            />
          )}
        </div>

        <div className="flex-1 mt-5 overflow-auto rounded-lg bg-slate-50 bg-gradient-to-br p-4 px-4 py-5 shadow-md transition-shadow hover:shadow-lg dark:from-slate-950 dark:to-slate-900 lg:flex-row lg:space-x-12 lg:space-y-0">
          {loadingNoCa && picaNoCaData.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <Loading />
            </div>
          ) : errorNoCa ? (
            <div className="flex h-full items-center justify-center flex-col">
              <p className="text-red-500 mb-2">
                Error fetching No CA data: {errorNoCa instanceof Error ? errorNoCa.message : "Unknown error"}
              </p>
              <button
                onClick={() => fetchPICANoCa()}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Retry
              </button>
            </div>
          ) : (
            <DataTable
              data={picaNoCaData}
              columns={columns}
              onSearch={handleSearchNoCa}
              searchTerm={searchTermNoCa}
              pageSize={pageSizeNoCa}
              onPageSizeChange={handlePageSizeChangeNoCa}
              currentPage={pageNoCa}
              onPageChange={handlePageChangeNoCa}
              totalRows={totalRowsNoCa}
              onDownload={handleDownloadPICANoCa}
            />
          )}
        </div>
      </Layout.Body>
    </Layout>
  )
}
