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
  kode?: string
  kode_unit?: string
  nama: string
  subregional: string
  luas_tanam_ha_tu: number
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
  kode_blok: string
}

export interface JobPositionData {
  jabatan: string
  jumlah_monev: number
  rata_rata_nilai: number
  rata_rata_bobot: number
  karyawans: any[]
}

export interface DashboardFilters {
  dari_tanggal: string
  sampai_tanggal: string
  regional: string
  kode_unit?: string
  afdeling?: string
  blok?: string
}

// new

// ==============================
// DMonev: Region
// ==============================

export interface DMonevRegion {
  kode_regional: string
  regional: string
}

export interface DMonevRegionResponse {
  message: {
    en: string
    id: string
  }
  data: DMonevRegion[]
}

// ==============================
// DMonev: Unit
// ==============================

export interface DMonevUnitRequest {
  region: string
}

export interface DMonevUnit {
  kode_unit: string
  nama_unit: string
  is_blok_tu: string // "0" | "1"
  luas_blok_tu: string
  jumlah_blok_tu: string
  kode_regional: string
}

export interface DMonevUnitResponse {
  message: {
    en: string
    id: string
  }
  data: DMonevUnit[]
}

// ==============================
// DMonev: Afdeling
// ==============================

export interface DMonevAfdelingRequest {
  region: string
  kode_unit: string
}

export interface DMonevAfdeling {
  kode_unit: string
  afdeling: string
  is_blok_tu: string
  luas_blok_tu: string
  jumlah_blok_tu: string
  kode_regional: string
}

export interface DMonevAfdelingResponse {
  message: {
    en: string
    id: string
  }
  data: DMonevAfdeling[]
}

// ==============================
// DMonev: Blok
// ==============================

export interface DMonevBlokRequest {
  region: string
  kode_unit: string
  afdeling: string
}

export interface DMonevBlok {
  kode_unit: string
  afdeling: string
  kode_blok_sap: string
  nama_blok: string
  is_blok_tu: string
  luas_blok_tu: string
  jumlah_blok_tu: string
  kode_regional: string
}

export interface DMonevBlokResponse {
  message: {
    en: string
    id: string
  }
  data: DMonevBlok[]
}

// ====================================
// DMonitoringEvaluasi: Blok Have Monev
// ====================================

export interface DMonevBlokHaveMonevParams {
  kode_unit?: string
  tanggal?: string
  kode_afdeling?: string
  limit?: number
  page?: number
}

export interface DMonevBlokHaveMonevItem {
  kode_unit: string
  nama_unit: string | null
  kode_afdeling: string
  kode_blok: string
  gis_id: string
}

export interface DMonevBlokHaveMonevResponse {
  message: {
    en: string
    id: string
  }
  data: DMonevBlokHaveMonevItem[]
}

// ====================================================
// DMonitoringEvaluasi: List All Monitoring by GIS ID
// ====================================================

export interface DMonevListByGisIdParams {
  tanggal?: string
  limit?: number
  page?: number
}

export interface DMonevListByGisIdItem {
  id: number
  tanggal: string
  kode_regional: string
  regional: string
  kode_unit: string
  nama_unit: string
  kode_afdeling: string
  kode_blok: string
  gis_id: string
  nama_vendor: string | null
  judul_pekerjaan: string
  luas: string
  pn: string | null
  mn: string | null
  mekanis: string
  chemis: string
  m_kertas_kerja_id: string
  kertas_kerja_name: string
  created_at: string
  created_by: string
  author_name: string | null
  jabatan: string
  catatan_tambahan: string | null
  preview_link: string
}

export interface DMonevListByGisIdResponse {
  message: {
    en: string
    id: string
  }
  data: DMonevListByGisIdItem[]
}

// ====================================================
// Monitoring Evaluasi/Show Detail Monitoring Evaluasi/Show Detail Monitoring Evaluasi
// ====================================================

export interface Message {
  en: string
  id: string
}

export interface Pengamatan {
  pengamatan_id: string
  pengamatan_name: string
  is_selected: boolean
  value_description: string | null
}

export interface Parameter {
  parameter_id: string
  parameter_name: string
  pengamatans: Pengamatan[]
}

export interface SubTahapan {
  sub_tahapan_id: string
  sub_tahapan_name: string | null
  parameters: Parameter[]
}

export interface Tahapan {
  tahapan_id: string
  tahapan_name: string
  subtahapans: SubTahapan[]
}

export interface MainIssue {
  id: number
  keterangan: string
  header_kertas_kerja_id: string
}

export interface RencanaKerjaTindakLanjut {
  id: number
  keterangan: string
  header_kertas_kerja_id: string
}

export interface MonitoringEvaluasiData {
  id: number
  tanggal: string
  kode_regional: string
  regional: string
  kode_unit: string
  nama_unit: string
  kode_afdeling: string
  kode_blok: string
  gis_id: string
  nama_vendor: string | null
  judul_pekerjaan: string
  luas: string
  pn: string | null
  mn: string | null
  mekanis: string
  chemis: string
  m_kertas_kerja_id: string
  kertas_kerja_name: string
  created_at: string
  created_by: string
  author_name: string
  jabatan: string
  catatan_tambahan: string | null
  preview_link: string
  kertas_kerja: Tahapan[]
  dokumentasi_kertas_kerja: any[]
  main_issue: MainIssue[]
  rencana_kerja_tindak_lanjut: RencanaKerjaTindakLanjut[]
}

export interface MonitoringEvaluasiResponse {
  message: Message
  data: MonitoringEvaluasiData
}

// ==============================
// DMonev: Rekap Jabatan
// ==============================

export interface DMonevRekapJabatanRequest {
  start_date: string // format: "YYYY-MM-DD" (atau bisa kosong "")
  end_date: string
  region: string
  kode_unit: string
  afdeling: string
  blok: string
}

export interface DMonevRekapJabatan {
  jabatan: string
  jumlah_monev: number
  rata_rata_nilai: number
  rata_rata_bobot: number
}

export interface DMonevRekapJabatanResponse {
  message: {
    en: string
    id: string
  }
  data: DMonevRekapJabatan[]
}

// ==============================
// DMonev: Rekap Person
// ==============================

export interface DMonevRekapPersonRequest {
  start_date: string
  end_date: string
  region: string
  kode_unit: string
  afdeling: string
  blok: string
  jabatan: string
  nik_sap: string
}

export interface DMonevRekapPerson {
  nik_sap: string
  nama: string
  jumlah_monev: number
  rata_rata_nilai: number
  rata_rata_bobot: number
}

export interface DMonevRekapPersonResponse {
  message: {
    en: string
    id: string
  }
  data: DMonevRekapPerson[]
}

// ==============================
// DCorrectiveAction: Rekap Region
// ==============================

export interface DCorrectiveActionRekapRegionRequest {
  start_date: string
  end_date: string
}

export interface DCorrectiveActionRekapRegion {
  kode_regional: string
  regional: string
  jumlah_corrective_action: number
  jumlah_corrective_action_selesai: number
  persentase_corrective_action_selesai: number
}

export interface DCorrectiveActionRekapRegionResponse {
  message: {
    en: string
    id: string
  }
  data: DCorrectiveActionRekapRegion[]
}

// ==============================
// DCorrectiveAction: Rekap Unit
// ==============================

export interface DCorrectiveActionRekapUnitRequest {
  start_date: string
  end_date: string
  region: string
}

export interface DCorrectiveActionRekapUnit {
  kode_unit: string
  nama_unit: string
  jumlah_corrective_action: number
  jumlah_corrective_action_selesai: number
  persentase_corrective_action_selesai: number
  kode_regional: string
}

export interface DCorrectiveActionRekapUnitResponse {
  message: {
    en: string
    id: string
  }
  data: DCorrectiveActionRekapUnit[]
}

// ==============================
// DCorrectiveAction: Rekap Afdeling
// ==============================

export interface DCorrectiveActionRekapAfdelingRequest {
  start_date: string
  end_date: string
  region: string
  kode_unit: string
}

export interface DCorrectiveActionRekapAfdeling {
  kode_unit: string
  afdeling: string
  jumlah_corrective_action: number
  jumlah_corrective_action_selesai: number
  persentase_corrective_action_selesai: number
  kode_regional: string
}

export interface DCorrectiveActionRekapAfdelingResponse {
  message: {
    en: string
    id: string
  }
  data: DCorrectiveActionRekapAfdeling[]
}

// ==============================
// DCorrectiveAction: Rekap Blok
// ==============================

export interface DCorrectiveActionRekapBlokRequest {
  start_date: string
  end_date: string
  region: string
  kode_unit: string
  afdeling: string
}

export interface DCorrectiveActionRekapBlok {
  kode_unit: string
  afdeling: string
  kode_blok_sap: string
  nama_blok: string
  jumlah_corrective_action: number
  jumlah_corrective_action_selesai: number
  persentase_corrective_action_selesai: number
  kode_regional: string
}

export interface DCorrectiveActionRekapBlokResponse {
  message: {
    en: string
    id: string
  }
  data: DCorrectiveActionRekapBlok[]
}

// ==============================
// DCorrectiveAction: Detail CA
// ==============================

export interface DCorrectiveActionDetailCARequest {
  start_date: string
  end_date: string
  region: string
  kode_unit: string
  afdeling: string
  kode_blok: string
}

export interface DCorrectiveActionSubItem {
  kode_unit: string
  created_at: string
  parameter_id: string
  corrective_action: string
  parameter_name: string
  pengamatan_name: string
  tahapan_name: string
  sub_tahapan_name: string
  header_kertas_kerja_id: string
  created_by: string
  jabatan: string
  kode_afdeling: string
  kode_blok: string
  progress: string | null
  nama_pembuat: string
  nama_unit: string
}

export interface DCorrectiveActionDetailCA {
  id: number
  tanggal: string
  kode_regional: string
  regional: string
  kode_unit: string
  nama_unit: string
  kode_afdeling: string
  kode_blok: string
  gis_id: string
  nama_vendor: string
  judul_pekerjaan: string
  luas: string
  mekanis: string
  chemis: string
  m_kertas_kerja_id: string
  kertas_kerja_name: string
  created_at: string
  created_by: string
  author_name: string | null
  jabatan: string
  catatan_tambahan: string | null
  preview_link: string
  corrective_actions: DCorrectiveActionSubItem[]
}

export interface DCorrectiveActionDetailCAResponse {
  message: {
    en: string
    id: string
  }
  data: DCorrectiveActionDetailCA[]
}
