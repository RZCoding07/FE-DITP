import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Layout } from "@/components/custom/layout"
import { Search } from "@/components/search"
import { UserNav } from "@/components/user-nav"
import ThemeSwitch from "@/components/theme-switch"
import { TopNav } from "@/components/top-nav"
import PlantationDashboardMasterpiece from "@/components/plantation-dashboard-enhanced"
import type { DashboardFilters } from "@/types/api"
import { format, subDays } from "date-fns"

const topNav = [
  {
    title: 'Nursery',
    href: '/dashboard-nursery',
    isActive: false
  },
  {
    title: 'Replanting (TU/TK/TB)',
    href: '/dashboard-replanting',
    isActive: false,
  },
  {
    title: 'Immature',
    href: '/dashboard-immature',
    isActive: false,
  },
  {
    title: 'Monica',
    href: '/dashboard-monica',
    isActive: false,
  },
  {
    title: 'Monev TU (Inspire-KKMV)',
    href: '/dashboard-inspire',
    isActive: false,
  },
    {
    title: 'Dashboard Monev TU',
    href: '/dashboard-monev',
    isActive: true,
  },
]

export default function DashboardMasterpiece() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [filters, setFilters] = useState<DashboardFilters>({
    dari_tanggal: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    sampai_tanggal: format(new Date(), "yyyy-MM-dd"),
    regional: "1",
    kode_unit: "",
    afdeling: "",
    blok: "",
  })

  // Initialize filters from URL params on component mount
  useEffect(() => {
    const newFilters: DashboardFilters = {
      dari_tanggal: searchParams.get('dari_tanggal') || format(subDays(new Date(), 30), "yyyy-MM-dd"),
      sampai_tanggal: searchParams.get('sampai_tanggal') || format(new Date(), "yyyy-MM-dd"),
      regional: searchParams.get('regional') || "2",
      kode_unit: searchParams.get('kode_unit') || searchParams.get('kebun') || "", // support both kode_unit and kebun params
      afdeling: searchParams.get('afdeling') || "",
      blok: searchParams.get('blok') || "",
    }
    setFilters(newFilters)
  }, [searchParams])

  const handleFiltersChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters)
    // Update URL params
    const params = new URLSearchParams()
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    setSearchParams(params)
  }

  return (
    <Layout className="bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col h-screen">
      <div className="flex-1 flex flex-col h-full">
        <Layout.Header
          sticky
          className="top-0 z-20 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 shadow-2xl"
        >
          <TopNav links={topNav} />
          <div className="ml-auto flex items-center space-x-4">
            <Search />
            <ThemeSwitch />
            <UserNav />
          </div>
        </Layout.Header>

        <div className="flex-1 overflow-auto">
          <PlantationDashboardMasterpiece
            title="Monev TU (Inspire-KKMV)"
            description="Advanced Analytics & Real-time Monitoring Dashboard"
            initialFilters={filters}
            onFiltersChange={handleFiltersChange}
          />
        </div>
      </div>
    </Layout>
  )
}