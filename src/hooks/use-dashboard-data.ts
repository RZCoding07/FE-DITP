'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  fetchPlantationData,
  fetchMonitoringData,
  fetchCorrectiveActionData,
  fetchJobPositionData,
  fetchRegionalData,
  fetchKebunData,
  fetchAfdelingData,
  ApiError,
  fetchMonitoringDataReg,
} from '@/lib/api-monev'
import type {
  DashboardFilters,
  MonitoringData,
  PlantationData,
  JobPositionData,
  CorrectiveActionData,
} from '@/types/api'

import type { DMonevRegion, DMonevUnit, DMonevAfdeling } from '@/types/api'

interface UseDashboardDataReturn {
  plantationData: any[]
  monitoringData: MonitoringData[]
  correctiveActionData: CorrectiveActionData[]
  jobPositionData: JobPositionData[]
  regionals: DMonevRegion[]
  kebuns: DMonevUnit[]
  afdelings: DMonevAfdeling[]
  loading: boolean
  error: string | null
  refetch: () => void
  refreshData: () => Promise<void>
  setFilters: (filters: DashboardFilters) => void
}

export function useDashboardDataEnhanced(
  initialFilters: DashboardFilters
): UseDashboardDataReturn {
  const [filters, setFiltersState] = useState<DashboardFilters>(initialFilters)
  const [plantationData, setPlantationData] = useState<PlantationData[]>([])
  const [monitoringData, setMonitoringData] = useState<MonitoringData[]>([])
  const [correctiveActionData, setCorrectiveActionData] = useState<
    CorrectiveActionData[]
  >([])
  const [jobPositionData, setJobPositionData] = useState<JobPositionData[]>([])
  const [regionals, setRegionals] = useState<DMonevRegion[]>([])
  const [kebuns, setKebuns] = useState<DMonevUnit[]>([])
  const [afdelings, setAfdelings] = useState<DMonevAfdeling[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Sync with external filter changes
  useEffect(() => {
    setFiltersState(initialFilters)
  }, [initialFilters])

  const fetchAllData = useCallback(async () => {
    if (!filters.dari_tanggal || !filters.sampai_tanggal) {
      console.warn('Skipping data fetch - missing date filters')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Fetch regionals first
      const regionalsResponse = await fetchRegionalData({
        dari_tanggal: filters.dari_tanggal,
        sampai_tanggal: filters.sampai_tanggal,
      })
      setRegionals(Array.isArray(regionalsResponse) ? regionalsResponse : [])


      const commonFetches = [
        fetchPlantationData(filters),
        fetchCorrectiveActionData(filters),
        fetchJobPositionData(filters),
        fetchKebunData(filters),
      ]

      const monitoringFetch =
        filters.regional === ''
          ? fetchMonitoringDataReg(filters)
          : fetchMonitoringData(filters)

      const [
        plantationResponse,
        monitoringResponse,
        correctiveActionResponse,
        jobPositionResponse,
        kebunsResponse,
      ] = await Promise.allSettled([
        ...commonFetches.slice(0, 1), // plantationData
        monitoringFetch,
        ...commonFetches.slice(1), // the rest
      ])
      const extractData = (response: any): any[] => {
        // If response has 'data' property, use that
        if (response && 'data' in response && Array.isArray(response.data)) {
          return response.data
         }
        // If response is already an array, use it directly (for APIs that return array directly)
        if (Array.isArray(response)) {
          return response
        }
        // Fallback to empty array
        return []
      }
      // Process responses using the extractData helper
      if (plantationResponse.status === 'fulfilled') {
        setPlantationData(extractData(plantationResponse.value))
      } else {
        console.error('Plantation data error:', plantationResponse.reason)
      }

      if (monitoringResponse.status === 'fulfilled') {
 
        setMonitoringData(extractData(monitoringResponse.value))
      } else {
        console.error('Monitoring data error:', monitoringResponse.reason)
      }

      if (correctiveActionResponse.status === 'fulfilled') {
        setCorrectiveActionData(extractData(correctiveActionResponse.value))
      } else {
        console.error(
          'Corrective action data error:',
          correctiveActionResponse.reason
        )
      }

      if (jobPositionResponse.status === 'fulfilled') {
        setJobPositionData(extractData(jobPositionResponse.value))
      } else {
        console.error('Job position data error:', jobPositionResponse.reason)
      }

      if (kebunsResponse.status === 'fulfilled') {
        setKebuns(extractData(kebunsResponse.value))
      } else {
        console.error('Kebuns data error:', kebunsResponse.reason)
      }

      // Fetch afdelings if kebun is selected
      if (filters.kode_unit) {
        try {
          const afdelingsResponse = await fetchAfdelingData(filters)
          setAfdelings(
            Array.isArray(afdelingsResponse) ? afdelingsResponse : []
          )
        } catch (err) {
          console.warn('Failed to fetch afdelings:', err)
        }
      } else {
        setAfdelings([])
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      setError(
        err instanceof ApiError
          ? `API Error: ${err.message}`
          : err instanceof Error
            ? err.message
            : 'Failed to fetch dashboard data'
      )
    } finally {
      setLoading(false)
    }
  }, [filters])

  const setFilters = useCallback((newFilters: DashboardFilters) => {
    // console.log("Updating filters in useDashboardData:", newFilters)
    setFiltersState(newFilters)
  }, [])

  const refreshData = useCallback(async () => {
    await fetchAllData()
  }, [fetchAllData])

  const refetch = useCallback(() => {
    fetchAllData()
  }, [fetchAllData])

  // Initial fetch and when filters change
  useEffect(() => {
    fetchAllData()
  }, [fetchAllData])

  return {
    plantationData,
    monitoringData,
    correctiveActionData,
    jobPositionData,
    regionals,
    kebuns,
    afdelings,
    loading,
    error,
    refetch,
    refreshData,
    setFilters,
  }
}
