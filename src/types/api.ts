// API Response Types
export interface PlantationApiResponse {
  message: {
    en: string
    id: string
  }
  data: PlantationData[]
}

export interface MonitoringApiResponse {
  message: {
    en: string
    id: string
  }
  data: MonitoringData[]
}

export interface CorrectiveActionApiResponse {
  message: {
    en: string
    id: string
  }
  data: CorrectiveActionData[]
}

export interface JobPositionApiResponse {
  message: {
    en: string
    id: string
  }
  data: JobPositionData[]
}

export interface PlantationData {
  kode_unit: string
  nama_unit: string
  is_blok_tu: string
  luas_blok_tu: number
  jumlah_blok_tu: number
  kode_regional: string
}

export interface MonitoringData {
  kode_unit: string
  nama: string
  subregional: string
  luas_areal_ha: number
  jumlah_blok_tu: number
  jumlah_blok_sudah_monev: number
  jumlah_monev: number
  persentase_monev: number
  persentase_kesesuaian: number
  rata_rata_nilai: number
  rata_rata_bobot: number
}

export interface CorrectiveActionData {
  kode_unit: string
  nama_unit: string
  jumlah_corrective_action: number
  jumlah_corrective_action_selesai: number
  persentase_corrective_action_selesai: number
  kode_regional: string
}

export interface Karyawan {
  nik_sap: string
  nama: string
  kode_unit: string
  nama_unit: string
  tanggal: string
  jabatan: string
}

export interface JobPositionData {
  jabatan: string
  jumlah_monev: number
  rata_rata_nilai: number
  rata_rata_bobot: number
  karyawans: Karyawan[]
}


export interface DashboardFilters {
  dari_tanggal: string
  sampai_tanggal: string
  regional: string
  kode_unit?: string
  afdeling?: string
  blok?: string
}

export interface Regional {
  kode_regional: string
  regional: string
}

export interface Kebun {
  kode_unit: string
  nama_unit: string
  kode_regional: string
}

export interface Afdeling {
  kode_afdeling: string
  kode_unit: string
  nama_unit: string
}
