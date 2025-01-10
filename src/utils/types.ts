export interface RegionalData {
    regional: string;
    kebun: string;
    afdeling: string;
    blok: string;
    bulan: number;
    tahun: number;
    tahun_tanam: number;
    total_luas_ha: number;
    total_jumlah_pokok_awal: number;
    total_jumlah_pokok_sekarang: number;
    rata_rata_tinggi_tanaman: number;
    rata_rata_jumlah_pelepah: number;
    rata_rata_panjang_rachis: number;
    rata_rata_lebar_petiola: number;
    rata_rata_tebal_petiola: number;
    rata_rata_jad_1_sisi: number;
    rata_rata_panjang_anak_daun: number;
    rata_rata_lebar_anak_daun: number;
    rata_rata_lingkar_batang: number;
    filtered_by?: string;
  }
  
  export interface SelectOption {
    value: string | number;
    label: string;
  }
  
  