"use client"

import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import type { DashboardFilters } from "@/types/api"

export function useUrlParams() {
  const location = useLocation()
  const navigate = useNavigate()

  const getFiltersFromUrl = (): DashboardFilters => {
    const params = new URLSearchParams(location.search)
    return {
      dari_tanggal: params.get("dari_tanggal") || "2024-06-12",
      sampai_tanggal: params.get("sampai_tanggal") || "2025-06-12",
      regional: params.get("regional") || "5",
    }
  }

  const [filters, setFilters] = useState<DashboardFilters>(getFiltersFromUrl)

  useEffect(() => {
    setFilters(getFiltersFromUrl())
  }, [location.search])

  const updateFilters = (newFilters: DashboardFilters) => {
    const params = new URLSearchParams()
    params.set("dari_tanggal", newFilters.dari_tanggal)
    params.set("sampai_tanggal", newFilters.sampai_tanggal)
    params.set("regional", newFilters.regional ?? "")

    navigate(`${location.pathname}?${params.toString()}`, { replace: true })
  }

  return {
    filters,
    updateFilters,
  }
}
