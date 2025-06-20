import axios, { type AxiosError, type AxiosResponse } from "axios"
import type {
  PlantationApiResponse,
  MonitoringApiResponse,
  CorrectiveActionApiResponse,
  JobPositionApiResponse,
  DashboardFilters,
} from "@/types/api"

const API_BASE_URL = import.meta.env.VITE_API_REPLANTING + "/api"

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

async function fetchApi<T>(endpoint: string, body: any): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios.post(`${API_BASE_URL}${endpoint}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError
      throw new ApiError(axiosError.message || "API request failed", axiosError.response?.status)
    }
    throw new ApiError("Network error occurred")
  }
}

export async function fetchPlantationData(filters: DashboardFilters): Promise<PlantationApiResponse> {
  console.log("Fetching plantation data with filters:", filters)
  return fetchApi<PlantationApiResponse>("/d-monev-kebun", {
    region: filters.regional,
  })
}

export async function fetchMonitoringData(filters: DashboardFilters): Promise<MonitoringApiResponse> {
  return fetchApi<MonitoringApiResponse>("/d-rekap-unit", {
    start_date: filters.dari_tanggal,
    end_date: filters.sampai_tanggal,
    region: filters.regional,
  })
}

export async function fetchCorrectiveActionData(filters: DashboardFilters): Promise<CorrectiveActionApiResponse> {
  return fetchApi<CorrectiveActionApiResponse>("/d-rekap-ca-unit", {
    start_date: filters.dari_tanggal,
    end_date: filters.sampai_tanggal,
    region: filters.regional,
  })
}

export async function fetchJobPositionData(
  filters: DashboardFilters & { kode_unit?: string; afdeling?: string; blok?: string },
): Promise<JobPositionApiResponse> {
  return fetchApi<JobPositionApiResponse>("/d-rekap-jabatan", {
    start_date: filters.dari_tanggal,
    end_date: filters.sampai_tanggal,
    region: filters.regional,
    kode_unit: filters.kode_unit,
    afdeling: filters.afdeling,
    blok: filters.blok,
  })
}

// Additional API functions for comprehensive data
export async function fetchRegionalData(filters: Pick<DashboardFilters, "dari_tanggal" | "sampai_tanggal">) {
  return fetchApi("/d-monev-reg", {
    dari_tanggal: filters.dari_tanggal,
    sampai_tanggal: filters.sampai_tanggal,
  })
}

export async function fetchKebunData(filters: DashboardFilters) {
  return fetchApi("/d-monev-kebun", {
    dari_tanggal: filters.dari_tanggal,
    sampai_tanggal: filters.sampai_tanggal,
    region: filters.regional,
  })
}

export async function fetchAfdelingData(filters: DashboardFilters) {
  return fetchApi("/d-monev-afd", {
    dari_tanggal: filters.dari_tanggal,
    sampai_tanggal: filters.sampai_tanggal,
    regional: filters.regional,
    kode_unit: filters.kode_unit,
  })
}
