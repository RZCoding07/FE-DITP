// API service for plantation monitoring dashboard
export interface RegionalData {
    kode: string
    nama: string
    luas_areal_ha_seluruh: string
    luas_areal_ha_tu: string
    luas_tanam_ha_seluruh: string
    luas_tanam_ha_tu: string
    jumlah_blok_seluruh: string
    jumlah_blok_tu: string
    jumlah_blok_sudah_monev: number
    jumlah_monev: number
    persentase_monev: number
    rata_rata_nilai: number
    rata_rata_bobot: number
    persentase_kesesuaian: number
}

export interface UnitData {
    kode_unit: string
    nama: string
    regional: string
    luas_areal_ha_seluruh: string
    luas_areal_ha_tu: string
    luas_tanam_ha_seluruh: string
    luas_tanam_ha_tu: string
    jumlah_blok_seluruh: string
    jumlah_blok_tu: string
    jumlah_blok_sudah_monev: number
    jumlah_monev: number
    persentase_monev: number
    rata_rata_nilai: number
    rata_rata_bobot: number
    persentase_kesesuaian: number
}

export interface AfdData {
    kode_unit: string
    afdeling: string
    luas_areal_ha_seluruh: string
    luas_areal_ha_tu: string
    luas_tanam_ha_seluruh: string
    luas_tanam_ha_tu: string
    jumlah_blok_seluruh: string
    jumlah_blok_tu: string
    kode_regional: string
    jumlah_blok_sudah_monev: number
    jumlah_monev: number
    persentase_monev: number
    rata_rata_nilai: number
    rata_rata_bobot: number
    persentase_kesesuaian: number
}

export interface CARegionalData {
    kode_regional: string
    regional: string
    jumlah_corrective_action: string
    jumlah_corrective_action_selesai: string
    persentase_corrective_action_selesai: number
}

export interface CAUnitData {
    kode_regional: string
    kode_unit: string
    nama_unit: string
    jumlah_corrective_action: string
    jumlah_corrective_action_selesai: string
    persentase_corrective_action_selesai: number
}

export interface DateRangeRequest {
    start_date: string
    end_date: string
}

export interface RegionalRequest extends DateRangeRequest { }

export interface UnitRequest extends DateRangeRequest {
    region: string
}

export interface AfdRequest extends DateRangeRequest {
    region: string
    kode_unit: string
}

export interface CARegionalRequest extends DateRangeRequest { }

export interface CAUnitRequest extends DateRangeRequest {
    region: string
}

export interface JobPositionData {
    jabatan: string
    jumlah_monev: number
    rata_rata_nilai: number
    rata_rata_bobot: number
    karyawans: any[]
}

export interface PersonData {
    nik_sap: string
    nama: string
    jumlah_monev: number
    rata_rata_nilai: number
    rata_rata_bobot: number
}

export interface JobPositionRequest extends DateRangeRequest {
    region?: string
    kode_unit?: string
    afdeling?: string
    blok?: string
}

export interface PersonRequest extends DateRangeRequest {
    region?: string
    kode_unit?: string
    afdeling?: string
    blok?: string
    jabatan?: string
    nik_sap?: string
}

export interface MonevDetailData {
    id: number
    tanggal: string
    kode_unit: string
    kode_afdeling: string
    kode_blok: string
    luas: string
    pn: string | null
    mn: string | null
    mekanis: string
    chemis: string
    created_at: string
    deleted_at: string | null
    m_kertas_kerja_id: string
    created_by: string
    regional: string
    kode_regional: string
    gis_id: string
    latitude: string
    longitude: string
    jabatan: string
    catatan_tambahan: string | null
    judul_pekerjaan: string
    nama_vendor: string
    job: string
    preview_link: string
    createdby: {
        sap: string
        name: string
    }
}

export interface MonevDetailRequest extends DateRangeRequest { }

export interface MonevDeleteRequest {
    monev_id: string
}

export interface MonevDetailResponse {
    message: {
        en: string
        id: string
    }
    data: {
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
        kertas_kerja: Array<{
            tahapan_id: number
            tahapan_name: string
            subtahapans: Array<{
                sub_tahapan_id: number
                sub_tahapan_name: string
                parameters: Array<{
                    parameter_id: number
                    parameter_name: string
                    pengamatans: Array<{
                        pengamatan_id: number
                        pengamatan_name: string
                        is_selected: boolean
                    }>
                }>
            }>
        }>
        dokumentasi_kertas_kerja: any[]
        main_issue: {
            id: number
            keterangan: string
            header_kertas_kerja_id: string
        }[]
        rencana_kerja_tindak_lanjut: {
            id: number
            keterangan: string
            header_kertas_kerja_id: string
        }[]
    }
}



// Base API URL - replace with your actual API endpoint
const API_BASE_URL = import.meta.env.VITE_API_REPLANTING + "/api"

class ApiService {
    private async makeRequest<T>(endpoint: string, data: any): Promise<T> {
        try {
            const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            return await response.json()
        } catch (error) {
            console.error(`API request failed for ${endpoint}:`, error)
            throw error
        }
    }

    async getRegionalData(request: RegionalRequest): Promise<RegionalData[]> {
        return this.makeRequest<RegionalData[]>("d-rekap-regional", request)
    }

    async getUnitData(request: UnitRequest): Promise<UnitData[]> {
        return this.makeRequest<UnitData[]>("d-rekap-unit", request)
    }

    async getAfdData(request: AfdRequest): Promise<AfdData[]> {
        return this.makeRequest<AfdData[]>("d-rekap-afd", request)
    }

    async getCARegionalData(request: CARegionalRequest): Promise<CARegionalData[]> {
        return this.makeRequest<CARegionalData[]>("d-rekap-ca-regional", request)
    }

    async getCAUnitData(request: CAUnitRequest): Promise<CAUnitData[]> {
        return this.makeRequest<CAUnitData[]>("d-rekap-ca-unit", request)
    }

    async getJobPositionData(request: JobPositionRequest): Promise<JobPositionData[]> {
        return this.makeRequest<JobPositionData[]>("d-rekap-jabatan", request)
    }

    async getPersonData(request: PersonRequest): Promise<PersonData[]> {
        return this.makeRequest<PersonData[]>("d-rekap-person", request)
    }

    async getMonevDetailData(request: MonevDetailRequest): Promise<MonevDetailData[]> {
        return this.makeRequest<MonevDetailData[]>("d-monev-detail", request)
    }

    async deleteMonevDetail(request: MonevDeleteRequest): Promise<{ message: { en: string; id: string } }> {
        return this.makeRequest<{ message: { en: string; id: string } }>("d-monev-delete-detail", request)
    }

    async getMonevDetailById(monevId: number): Promise<MonevDetailResponse> {
        const apiUrl = import.meta.env.VITE_API_REPLANTING + "/api/monitoring-evaluasi"
        const response = await fetch(`${apiUrl}/${monevId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${import.meta.env.VITE_API_TOKEN}`,
            },
        })

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

        return await response.json()
    }

    
    async getMonevDetailByBelumMonev(request: any): Promise<any[]> {
        return this.makeRequest<any[]>("d-rekap-karyawan-belum-monev", request)
    }


    async getMonevDetailBlokTU(request: any): Promise<any[]> {
        return this.makeRequest<any[]>("d-rekap-blok-tu-dev", request)
    }
}

export const apiService = new ApiService()
