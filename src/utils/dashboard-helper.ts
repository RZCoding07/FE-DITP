import {
  dataOne,
  dataTwo,
  dataThree,
  dataFour,
  dataFive,
} from '@/data/tbm-params'

import {
  dataNewOne,
  dataNewTwo,
  dataNewThree,
  dataNewFour,
  dataNewFive,
} from '@/data/tbm-params'

interface ProcessScoreDataResult {
  newScores: Array<{ [key: string]: any }>
  newScoresKebun: Array<{ [key: string]: any }>
  newScoresRegional: Array<{ [key: string]: any }>
  newScoresAll: any[]
  newScoresAllKebun: any[]
  newScoresAllRegional: any[]
  newRegionalBlackBlockCount: { [key: string]: number }
  tbmResultsUpdate: { [key: string]: number }
  scoreJumlahPelepahResultsUpdate: any
  scoreLingkarBatangResultsUpdate: any
}

export function processScoreData({
  data,
  getScoreLingkarBatang,
  getScoreJumlahPelepah,
  getScoreTinggiTanaman,
  getScoreKerapatanPokok,

  getColorLingkarBatang,
  getColorJumlahPelepah,
  getColorTinggiTanaman,

  getScorePanjangRachis,
  getScoreLebarPetiola,
  getScoreTebalPetiola,
  getScoreJumlahAnakDaun,
  getScorePanjangAnakDaun,
  getScoreLebarAnakDaun,

  getColorPanjangRachis,
  getColorLebarPetiola,
  getColorTebalPetiola,
  getColorJumlahAnakDaun,
  getColorPanjangAnakDaun,
  getColorLebarAnakDaun,
}: {
  data: { [key: string]: any }
  // 4
  getScoreLingkarBatang: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getScoreJumlahPelepah: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getScoreTinggiTanaman: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getScoreKerapatanPokok: (
    age: number,
    initial: number,
    current: number,
    bV: number,
    tV: number
  ) => number
  getColorLingkarBatang: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string
  getColorJumlahPelepah: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string
  getColorTinggiTanaman: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string

  // 8 - 12
  getScorePanjangRachis: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getScoreLebarPetiola: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getScoreTebalPetiola: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getScoreJumlahAnakDaun: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getScorePanjangAnakDaun: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getScoreLebarAnakDaun: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => number
  getColorPanjangRachis: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string
  getColorLebarPetiola: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string
  getColorTebalPetiola: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string
  getColorJumlahAnakDaun: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string
  getColorPanjangAnakDaun: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string
  getColorLebarAnakDaun: (
    dataset: any[],
    age: number,
    value: number,
    bV: number,
    tV: number
  ) => string
}): ProcessScoreDataResult {
  const newScores: Array<{ [key: string]: any }> = []
  const newScoresKebun: { [key: string]: any } = {}
  const newScoresAll: any[] = []
  const newScoresRegional: { [key: string]: any } = {}
  const newRegionalBlackBlockCount: { [key: string]: number } = {}

  // Process each item in the data
  Object.values(data).forEach((item: any) => {
    let age = 0

    const varietas = item.varietas
    const faseTbm = item.vw_fase_tbm

    // Set data rules based on varietas
    function compareCaseInsensitive(str1: string, str2: string): boolean {
      return str1.toLowerCase() === str2.toLowerCase()
    }

    let dataRules: any[] = []

    const bulanInt = Number(item.bulan)
    const tahunInt = Number(item.tahun)

    // Set data rules based on period and varietas
    if (bulanInt === 4 && tahunInt === 2025) {
      // April 2025 - use original data sets
      age = Number.parseInt(item.umur_saat_ini_bulan)

      if (age > 36) {
        age = 36
      }

      if (
        compareCaseInsensitive(varietas, 'DP Yangambi') ||
        compareCaseInsensitive(varietas, 'DP PPKS 718') ||
        compareCaseInsensitive(varietas, 'DP 239')
      ) {
        dataRules = dataOne
      } else if (compareCaseInsensitive(varietas, 'DP Langkat')) {
        dataRules = dataTwo
      } else if (
        compareCaseInsensitive(varietas, 'DP Simalungun') ||
        compareCaseInsensitive(varietas, 'DP Avros') ||
        compareCaseInsensitive(varietas, 'DP 540') ||
        compareCaseInsensitive(varietas, 'Lonsum') ||
        compareCaseInsensitive(varietas, 'Dami Mas') ||
        compareCaseInsensitive(varietas, 'Bina Sawit Makmur') ||
        compareCaseInsensitive(varietas, 'Sarana Inti Pratama') ||
        compareCaseInsensitive(varietas, 'Panca Surya Garden')
      ) {
        dataRules = dataThree
      } else if (
        compareCaseInsensitive(varietas, 'SF Lame') ||
        compareCaseInsensitive(varietas, 'SF MTG') ||
        compareCaseInsensitive(varietas, 'SF Yangambi') ||
        compareCaseInsensitive(varietas, 'Bakrie') ||
        compareCaseInsensitive(varietas, 'Topaz') ||
        compareCaseInsensitive(varietas, 'Sriwijaya Sampoerna') ||
        compareCaseInsensitive(varietas, 'Verdant')
      ) {
        dataRules = dataFour
      } else if (compareCaseInsensitive(varietas, 'DP 239')) {
        dataRules = dataFive
      }

      // Calculate scores
      const scoreLingkarBatang =
        getScoreLingkarBatang(
          dataRules,
          age,
          Number.parseFloat(item.lingkar_batang_cm),
          bulanInt,
          tahunInt
        ) * 0.4
      const scoreJumlahPelepah =
        getScoreJumlahPelepah(
          dataRules,
          age,
          Number.parseFloat(item.jumlah_pelepah_bh),
          bulanInt,
          tahunInt
        ) * 0.2
      const scoreTinggiBatang =
        getScoreTinggiTanaman(
          dataRules,
          age,
          Number.parseFloat(item.tinggi_tanaman_cm),
          bulanInt,
          tahunInt
        ) * 0.1
      const scoreKerapatanPokok =
        getScoreKerapatanPokok(
          age,
          Number.parseFloat(item.jumlah_pokok_awal_tanam),
          Number.parseFloat(item.jumlah_pokok_sekarang),
          bulanInt,
          tahunInt
        ) * 0.3

      const ascoreLingkarBatang = getScoreLingkarBatang(
        dataRules,
        age,
        Number.parseFloat(item.lingkar_batang_cm),
        bulanInt,
        tahunInt
      )
      const ascoreJumlahPelepah = getScoreJumlahPelepah(
        dataRules,
        age,
        Number.parseFloat(item.jumlah_pelepah_bh),
        bulanInt,
        tahunInt
      )
      const ascoreTinggiBatang = getScoreTinggiTanaman(
        dataRules,
        age,
        Number.parseFloat(item.tinggi_tanaman_cm),
        bulanInt,
        tahunInt
      )
      const ascoreKerapatanPokok = getScoreKerapatanPokok(
        age,
        Number.parseFloat(item.jumlah_pokok_awal_tanam),
        Number.parseFloat(item.jumlah_pokok_sekarang),
        bulanInt,
        tahunInt
      )

      const colorScoreLingkarBatang = getColorLingkarBatang(
        dataRules,
        age,
        Number.parseFloat(item.lingkar_batang_cm),
        bulanInt,
        tahunInt
      )
      const colorScoreJumlahPelepah = getColorJumlahPelepah(
        dataRules,
        age,
        Number.parseFloat(item.jumlah_pelepah_bh),
        bulanInt,
        tahunInt
      )
      const colorScoreTinggiBatang = getColorTinggiTanaman(
        dataRules,
        age,
        Number.parseFloat(item.tinggi_tanaman_cm),
        bulanInt,
        tahunInt
      )

      const totalSeleksian =
        scoreLingkarBatang +
        scoreJumlahPelepah +
        scoreTinggiBatang +
        scoreKerapatanPokok

      // Determine color category
      let colorCategory = ''
      if (totalSeleksian < 80) {
        colorCategory = 'black'
        // Count black blocks by regional
        const regional = item.regional
        if (newRegionalBlackBlockCount[regional]) {
          newRegionalBlackBlockCount[regional] += 1
        } else {
          newRegionalBlackBlockCount[regional] = 1
        }
      } else if (totalSeleksian > 92) {
        colorCategory = 'gold'
      } else if (totalSeleksian > 87) {
        colorCategory = 'green'
      } else if (totalSeleksian > 82) {
        colorCategory = 'red'
      } else {
        colorCategory = 'black'
      }
      // Extract data
      const luas = Number.parseFloat(item.luas_ha)
      const regional = item.regional
      const kebun = item.kebun
      const lingkar = Number.parseFloat(item.lingkar_batang_cm)
      const tinggi = Number.parseFloat(item.tinggi_tanaman_cm)
      const jumPelepah = Number.parseFloat(item.jumlah_pelepah_bh)

      // Add to scores array using fase_tbm as the key
      newScores.push({
        [faseTbm]: {
          id: item.id,
          regional,
          kebun,
          tahun_tanam: item.tahun_tanam,
          umur: item.umur_saat_ini_bulan,
          jumlah_pokok_awal_tanam: item.jumlah_pokok_awal_tanam,
          jumlah_pokok_sekarang: item.jumlah_pokok_sekarang,
          afdeling: item.afdeling,
          blok: item.blok,
          scoreLingkarBatang,
          scoreJumlahPelepah,
          scoreTinggiBatang,
          scoreKerapatanPokok,
          totalSeleksian,
          colorCategory,
          luas,
          varietas,
          jumPelepah,
          fase_tbm: item.fase_tbm,
          vw_fase_tbm: item.vw_fase_tbm,
          lingkar_batang_cm: item.lingkar_batang_cm,
          tinggi_tanaman_cm: item.tinggi_tanaman_cm,
          pica_id: item.pica_id,
        },
      })

      newScoresAll.push({
        id: item.id,
        regional,
        kebun,
        tahun_tanam: item.tahun_tanam,
        umur: item.umur_saat_ini_bulan,
        jumlah_pelepah_bh: item.jumlah_pelepah_bh,
        lingkar_batang_cm: item.lingkar_batang_cm,
        tinggi_tanaman_cm: tinggi,
        afdeling: item.afdeling,
        blok: item.blok,
        ascoreLingkarBatang,
        ascoreJumlahPelepah,
        ascoreTinggiBatang,
        ascoreKerapatanPokok,
        totalSeleksian,
        colorCategory,
        luas,
        varietas,
        jumPelepah,
        tbm: faseTbm,
        jumlah_pokok_awal_tanam: item.jumlah_pokok_awal_tanam,
        jumlah_pokok_sekarang: item.jumlah_pokok_sekarang,
        bulan: Number.parseInt(item.bulan),
        tahun: Number.parseInt(item.tahun),
        fase_tbm: item.fase_tbm,
        vw_fase_tbm: item.vw_fase_tbm,
        colorScoreJumlahPelepah,
        colorScoreLingkarBatang,
        colorScoreTinggiBatang,
      })

      // Process kebun data
      if (!newScoresKebun[kebun]) {
        newScoresKebun[kebun] = {
          regional,
          kebun,
          totalSeleksiKebun: 0,
          totalLuas: 0,
        }
      }

      // Add weighted score to kebun
      newScoresKebun[kebun].totalSeleksiKebun += totalSeleksian * luas
      newScoresKebun[kebun].totalLuas += luas

      // Process regional data
      if (!newScoresRegional[regional]) {
        newScoresRegional[regional] = {
          regional,
          totalSeleksiRegional: 0,
          totalLuas: 0,
        }
      }

      // Add weighted score to regional
      newScoresRegional[regional].totalSeleksiRegional += totalSeleksian * luas
      newScoresRegional[regional].totalLuas += luas
    } else {
      age = Number.parseInt(item.generate_umur_saat_ini)

      if (age > 36) {
        age = 36
      }
      // Other periods - use new data sets
      if (
        compareCaseInsensitive(varietas, 'DP Yangambi') ||
        compareCaseInsensitive(varietas, 'DP PPKS 718') ||
        compareCaseInsensitive(varietas, 'DP 239')
      ) {
        dataRules = dataNewOne
      } else if (compareCaseInsensitive(varietas, 'DP Langkat')) {
        dataRules = dataNewTwo
      } else if (
        compareCaseInsensitive(varietas, 'DP Simalungun') ||
        compareCaseInsensitive(varietas, 'DP Avros') ||
        compareCaseInsensitive(varietas, 'DP 540') ||
        compareCaseInsensitive(varietas, 'Lonsum') ||
        compareCaseInsensitive(varietas, 'Dami Mas') ||
        compareCaseInsensitive(varietas, 'Bina Sawit Makmur') ||
        compareCaseInsensitive(varietas, 'Sarana Inti Pratama') ||
        compareCaseInsensitive(varietas, 'Panca Surya Garden')
      ) {
        dataRules = dataNewThree
      } else if (
        compareCaseInsensitive(varietas, 'SF Lame') ||
        compareCaseInsensitive(varietas, 'SF MTG') ||
        compareCaseInsensitive(varietas, 'SF Yangambi') ||
        compareCaseInsensitive(varietas, 'Bakrie') ||
        compareCaseInsensitive(varietas, 'Topaz') ||
        compareCaseInsensitive(varietas, 'Sriwijaya Sampoerna') ||
        compareCaseInsensitive(varietas, 'Verdant')
      ) {
        dataRules = dataNewFour
      } else if (compareCaseInsensitive(varietas, 'DP 239')) {
        dataRules = dataNewFive
      }

      // Initialize all score variables
      let scoreLingkarBatang = 0
      let scoreJumlahPelepah = 0
      let scoreTinggiBatang = 0
      let scoreKerapatanPokok = 0

      // Additional scores for non-April 2025 periods
      let scorePanjangRachis = 0
      let scoreLebarPetiola = 0
      let scoreTebalPetiola = 0
      let scoreJumlahAnakDaun = 0
      let scorePanjangAnakDaun = 0
      let scoreLebarAnakDaun = 0

      // Actual scores (without weights)
      let ascoreLingkarBatang = 0
      let ascoreJumlahPelepah = 0
      let ascoreTinggiBatang = 0
      let ascoreKerapatanPokok = 0

      let ascorePanjangRachis = 0
      let ascoreLebarPetiola = 0
      let ascoreTebalPetiola = 0
      let ascoreJumlahAnakDaun = 0
      let ascorePanjangAnakDaun = 0
      let ascoreLebarAnakDaun = 0

      // Color scores
      let colorScoreLingkarBatang = ''
      let colorScoreJumlahPelepah = ''
      let colorScoreTinggiBatang = ''

      let colorScorePanjangRachis = ''
      let colorScoreLebarPetiola = ''
      let colorScoreTebalPetiola = ''
      let colorScoreJumlahAnakDaun = ''
      let colorScorePanjangAnakDaun = ''
      let colorScoreLebarAnakDaun = ''

      let totalSeleksian = 0

      // Calculate actual scores (without weights) - these are always calculated
      ascoreLingkarBatang = getScoreLingkarBatang(
        dataRules,
        age,
        Number.parseFloat(item.lingkar_batang_cm),
        Number(item.bulan),
        Number(item.tahun)
      )

      ascoreJumlahPelepah = getScoreJumlahPelepah(
        dataRules,
        age,
        Number.parseFloat(item.jumlah_pelepah_bh),
        Number(item.bulan),
        Number(item.tahun)
      )

      ascoreTinggiBatang = getScoreTinggiTanaman(
        dataRules,
        age,
        Number.parseFloat(item.tinggi_tanaman_cm),
        Number(item.bulan),
        Number(item.tahun)
      )

      ascoreKerapatanPokok = getScoreKerapatanPokok(
        age,
        Number.parseFloat(item.jumlah_pokok_awal_tanam),
        Number.parseFloat(item.jumlah_pokok_sekarang),
        Number(item.bulan),
        Number(item.tahun)
      )

      // Calculate color scores for basic 4 indicators
      colorScoreLingkarBatang = getColorLingkarBatang(
        dataRules,
        age,
        Number.parseFloat(item.lingkar_batang_cm),
        Number(item.bulan),
        Number(item.tahun)
      )

      colorScoreJumlahPelepah = getColorJumlahPelepah(
        dataRules,
        age,
        Number.parseFloat(item.jumlah_pelepah_bh),
        Number(item.bulan),
        Number(item.tahun)
      )

      colorScoreTinggiBatang = getColorTinggiTanaman(
        dataRules,
        age,
        Number.parseFloat(item.tinggi_tanaman_cm),
        Number(item.bulan),
        Number(item.tahun)
      )

      if (bulanInt === 4 && tahunInt === 2025) {
        // APRIL 2025: Only 4 indicators with specific weights
        scoreLingkarBatang = ascoreLingkarBatang * 0.4
        scoreJumlahPelepah = ascoreJumlahPelepah * 0.2
        scoreTinggiBatang = ascoreTinggiBatang * 0.1
        scoreKerapatanPokok = ascoreKerapatanPokok * 0.3

        // Set additional scores to 0 for April 2025
        scorePanjangRachis = 0
        scoreLebarPetiola = 0
        scoreTebalPetiola = 0
        scoreJumlahAnakDaun = 0
        scorePanjangAnakDaun = 0
        scoreLebarAnakDaun = 0

        // Set additional actual scores to 0 for April 2025
        ascorePanjangRachis = 0
        ascoreLebarPetiola = 0
        ascoreTebalPetiola = 0
        ascoreJumlahAnakDaun = 0
        ascorePanjangAnakDaun = 0
        ascoreLebarAnakDaun = 0

        // Set additional color scores to empty for April 2025
        colorScorePanjangRachis = ''
        colorScoreLebarPetiola = ''
        colorScoreTebalPetiola = ''
        colorScoreJumlahAnakDaun = ''
        colorScorePanjangAnakDaun = ''
        colorScoreLebarAnakDaun = ''

        totalSeleksian =
          scoreLingkarBatang +
          scoreJumlahPelepah +
          scoreTinggiBatang +
          scoreKerapatanPokok
      } else {
        // OTHER PERIODS: 10 indicators with different weights
        scoreLingkarBatang = ascoreLingkarBatang * 0.25
        scoreJumlahPelepah = ascoreJumlahPelepah * 0.15
        scoreTinggiBatang = ascoreTinggiBatang * 0.1
        scoreKerapatanPokok = ascoreKerapatanPokok * 0.15

        // Calculate additional actual scores for other periods
        ascorePanjangRachis = getScorePanjangRachis(
          dataRules,
          age,
          Number.parseFloat(item.panjang_rachis_cm),
          Number(item.bulan),
          Number(item.tahun)
        )

        ascoreLebarPetiola = getScoreLebarPetiola(
          dataRules,
          age,
          Number.parseFloat(item.lebar_petiola_cm),
          Number(item.bulan),
          Number(item.tahun)
        )

        ascoreTebalPetiola = getScoreTebalPetiola(
          dataRules,
          age,
          Number.parseFloat(item.tebal_petiola_cm),
          Number(item.bulan),
          Number(item.tahun)
        )

        ascoreJumlahAnakDaun = getScoreJumlahAnakDaun(
          dataRules,
          age,
          Number.parseFloat(item.jumlah_anak_daun),
          Number(item.bulan),
          Number(item.tahun)
        )

        ascorePanjangAnakDaun = getScorePanjangAnakDaun(
          dataRules,
          age,
          Number.parseFloat(item.rerata_panjang_anak_daun),
          Number(item.bulan),
          Number(item.tahun)
        )

        ascoreLebarAnakDaun = getScoreLebarAnakDaun(
          dataRules,
          age,
          Number.parseFloat(item.rerata_lebar_anak_daun),
          Number(item.bulan),
          Number(item.tahun)
        )

        // Calculate weighted scores for additional indicators
        scorePanjangRachis = ascorePanjangRachis * 0.05
        scoreLebarPetiola = ascoreLebarPetiola * 0.05
        scoreTebalPetiola = ascoreTebalPetiola * 0.05
        scoreJumlahAnakDaun = ascoreJumlahAnakDaun * 0.1
        scorePanjangAnakDaun = ascorePanjangAnakDaun * 0.05
        scoreLebarAnakDaun = ascoreLebarAnakDaun * 0.05

        // Calculate color scores for additional indicators
        colorScorePanjangRachis = getColorPanjangRachis(
          dataRules,
          age,
          Number.parseFloat(item.panjang_rachis_cm),
          Number(item.bulan),
          Number(item.tahun)
        )

        colorScoreLebarPetiola = getColorLebarPetiola(
          dataRules,
          age,
          Number.parseFloat(item.lebar_petiola_cm),
          Number(item.bulan),
          Number(item.tahun)
        )

        colorScoreTebalPetiola = getColorTebalPetiola(
          dataRules,
          age,
          Number.parseFloat(item.tebal_petiola_cm),
          Number(item.bulan),
          Number(item.tahun)
        )

        colorScoreJumlahAnakDaun = getColorJumlahAnakDaun(
          dataRules,
          age,
          Number.parseFloat(item.jumlah_anak_daun),
          Number(item.bulan),
          Number(item.tahun)
        )

        colorScorePanjangAnakDaun = getColorPanjangAnakDaun(
          dataRules,
          age,
          Number.parseFloat(item.rerata_panjang_anak_daun),
          Number(item.bulan),
          Number(item.tahun)
        )

        colorScoreLebarAnakDaun = getColorLebarAnakDaun(
          dataRules,
          age,
          Number.parseFloat(item.rerata_lebar_anak_daun),
          Number(item.bulan),
          Number(item.tahun)
        )

        totalSeleksian =
          scoreLingkarBatang +
          scoreJumlahPelepah +
          scoreTinggiBatang +
          scoreKerapatanPokok +
          scorePanjangRachis +
          scoreLebarPetiola +
          scoreTebalPetiola +
          scoreJumlahAnakDaun +
          scorePanjangAnakDaun +
          scoreLebarAnakDaun
      }

      // Determine color category
      let colorCategory = ''
      if (totalSeleksian < 80) {
        colorCategory = 'black'
        // Count black blocks by regional
        const regional = item.regional
        if (newRegionalBlackBlockCount[regional]) {
          newRegionalBlackBlockCount[regional] += 1
        } else {
          newRegionalBlackBlockCount[regional] = 1
        }
      } else if (totalSeleksian > 92) {
        colorCategory = 'gold'
      } else if (totalSeleksian > 87) {
        colorCategory = 'green'
      } else if (totalSeleksian > 82) {
        colorCategory = 'red'
      } else {
        colorCategory = 'black'
      }

      // Extract data
      const luas = Number.parseFloat(item.luas_ha)
      const regional = item.regional
      const kebun = item.kebun
      const tinggi = Number.parseFloat(item.tinggi_tanaman_cm)
      const jumPelepah = Number.parseFloat(item.jumlah_pelepah_bh)

      // Add to scores array using fase_tbm as the key
      newScores.push({
        [faseTbm]: {
          id: item.id,
          regional,
          kebun,
          tahun_tanam: item.tahun_tanam,
          umur: age,
          jumlah_pokok_awal_tanam: item.jumlah_pokok_awal_tanam,
          jumlah_pokok_sekarang: item.jumlah_pokok_sekarang,
          afdeling: item.afdeling,
          blok: item.blok,

          scoreLingkarBatang,
          scoreJumlahPelepah,
          scoreTinggiBatang,
          scoreKerapatanPokok,

          scorePanjangRachis,
          scoreLebarPetiola,
          scoreTebalPetiola,
          scoreJumlahAnakDaun,
          scorePanjangAnakDaun,
          scoreLebarAnakDaun,

          totalSeleksian,
          colorCategory,
          luas,
          bulan_tanam: item.bulan,
          varietas,
          jumPelepah,
          fase_tbm: item.fase_tbm,
          vw_fase_tbm: item.vw_fase_tbm,
          lingkar_batang_cm: item.lingkar_batang_cm,
          tinggi_tanaman_cm: item.tinggi_tanaman_cm,
          pica_id: item.pica_id,
        },
      })

      newScoresAll.push({
        id: item.id,
        regional,
        kebun,
        tahun_tanam: item.tahun_tanam,
        umur: age,
        jumlah_pelepah_bh: item.jumlah_pelepah_bh,
        lingkar_batang_cm: item.lingkar_batang_cm,
        tinggi_tanaman_cm: tinggi,
        afdeling: item.afdeling,
        blok: item.blok,

        ascoreLingkarBatang,
        ascoreJumlahPelepah,
        ascoreTinggiBatang,
        ascoreKerapatanPokok,

        ascorePanjangRachis,
        ascoreLebarPetiola,
        ascoreTebalPetiola,
        ascoreJumlahAnakDaun,
        ascorePanjangAnakDaun,
        ascoreLebarAnakDaun,

        totalSeleksian,
        colorCategory,
        luas,
        varietas,
        jumPelepah,
        tbm: faseTbm,
        jumlah_pokok_awal_tanam: item.jumlah_pokok_awal_tanam,
        jumlah_pokok_sekarang: item.jumlah_pokok_sekarang,
        bulan: Number(item.bulan),
        tahun: Number(item.tahun),
        fase_tbm: item.fase_tbm,
        vw_fase_tbm: item.vw_fase_tbm,

        colorScoreJumlahPelepah,
        colorScoreLingkarBatang,
        colorScoreTinggiBatang,
        colorScorePanjangRachis,
        colorScoreLebarPetiola,
        colorScoreTebalPetiola,
        colorScoreJumlahAnakDaun,
        colorScorePanjangAnakDaun,
        colorScoreLebarAnakDaun,

        pica_id: item.pica_id,
      })

      // Process kebun data
      if (!newScoresKebun[kebun]) {
        newScoresKebun[kebun] = {
          regional,
          kebun,
          totalSeleksiKebun: 0,
          totalLuas: 0,
        }
      }

      newScoresKebun[kebun].totalSeleksiKebun += totalSeleksian * luas
      newScoresKebun[kebun].totalLuas += luas

      if (!newScoresRegional[regional]) {
        newScoresRegional[regional] = {
          regional,
          totalSeleksiRegional: 0,
          totalLuas: 0,
        }
      }

      // Add weighted score to regional
      newScoresRegional[regional].totalSeleksiRegional += totalSeleksian * luas
      newScoresRegional[regional].totalLuas += luas
    }
  })

  // Calculate average scores for kebun
  const processedScoresKebun: Array<{ [key: string]: any }> = []
  Object.keys(newScoresKebun).forEach((kebun) => {
    // Calculate average actual scores for kebun
    let totalAscoreLingkarBatang = 0
    let totalAscoreJumlahPelepah = 0
    let totalAscoreTinggiBatang = 0
    let totalAscoreKerapatanPokok = 0
    let totalAscorePanjangRachis = 0
    let totalAscoreLebarPetiola = 0
    let totalAscoreTebalPetiola = 0
    let totalAscoreJumlahAnakDaun = 0
    let totalAscorePanjangAnakDaun = 0
    let totalAscoreLebarAnakDaun = 0

    const totalLuas = newScoresKebun[kebun].totalLuas

    // Find all items for this kebun to calculate weighted average scores
    const kebunItems = newScoresAll.filter((item) => item.kebun === kebun)

    kebunItems.forEach((item) => {
      const itemLuas = item.luas
      totalAscoreLingkarBatang += item.ascoreLingkarBatang * itemLuas
      totalAscoreJumlahPelepah += item.ascoreJumlahPelepah * itemLuas
      totalAscoreTinggiBatang += item.ascoreTinggiBatang * itemLuas
      totalAscoreKerapatanPokok += item.ascoreKerapatanPokok * itemLuas
      totalAscorePanjangRachis += item.ascorePanjangRachis * itemLuas
      totalAscoreLebarPetiola += item.ascoreLebarPetiola * itemLuas
      totalAscoreTebalPetiola += item.ascoreTebalPetiola * itemLuas
      totalAscoreJumlahAnakDaun += item.ascoreJumlahAnakDaun * itemLuas
      totalAscorePanjangAnakDaun += item.ascorePanjangAnakDaun * itemLuas
      totalAscoreLebarAnakDaun += item.ascoreLebarAnakDaun * itemLuas
    })

    // Calculate weighted averages
    const avgAscoreLingkarBatang =
      totalLuas > 0 ? totalAscoreLingkarBatang / totalLuas : 0
    const avgAscoreJumlahPelepah =
      totalLuas > 0 ? totalAscoreJumlahPelepah / totalLuas : 0
    const avgAscoreTinggiBatang =
      totalLuas > 0 ? totalAscoreTinggiBatang / totalLuas : 0
    const avgAscoreKerapatanPokok =
      totalLuas > 0 ? totalAscoreKerapatanPokok / totalLuas : 0
    const avgAscorePanjangRachis =
      totalLuas > 0 ? totalAscorePanjangRachis / totalLuas : 0
    const avgAscoreLebarPetiola =
      totalLuas > 0 ? totalAscoreLebarPetiola / totalLuas : 0
    const avgAscoreTebalPetiola =
      totalLuas > 0 ? totalAscoreTebalPetiola / totalLuas : 0
    const avgAscoreJumlahAnakDaun =
      totalLuas > 0 ? totalAscoreJumlahAnakDaun / totalLuas : 0
    const avgAscorePanjangAnakDaun =
      totalLuas > 0 ? totalAscorePanjangAnakDaun / totalLuas : 0
    const avgAscoreLebarAnakDaun =
      totalLuas > 0 ? totalAscoreLebarAnakDaun / totalLuas : 0

    // Determine color scores for kebun (using the most common color for each metric)
    const firstKebunItem = kebunItems[0]
    let colorScoreLingkarBatang = 'default'
    let colorScoreJumlahPelepah = 'default'
    let colorScoreTinggiBatang = 'default'
    let colorScorePanjangRachis = 'default'
    let colorScoreLebarPetiola = 'default'
    let colorScoreTebalPetiola = 'default'
    let colorScoreJumlahAnakDaun = 'default'
    let colorScorePanjangAnakDaun = 'default'
    let colorScoreLebarAnakDaun = 'default'

    if (firstKebunItem) {
      // Helper function to get most common color
      const getMostCommonColor = (colors: string[]) => {
        const colorCount: { [key: string]: number } = {}
        colors.forEach((color) => {
          colorCount[color] = (colorCount[color] || 0) + 1
        })
        return Object.entries(colorCount).sort((a, b) => b[1] - a[1])[0][0]
      }

      colorScoreLingkarBatang = getMostCommonColor(
        kebunItems.map((item) => item.colorScoreLingkarBatang)
      )
      colorScoreJumlahPelepah = getMostCommonColor(
        kebunItems.map((item) => item.colorScoreJumlahPelepah)
      )
      colorScoreTinggiBatang = getMostCommonColor(
        kebunItems.map((item) => item.colorScoreTinggiBatang)
      )
      colorScorePanjangRachis = getMostCommonColor(
        kebunItems.map((item) => item.colorScorePanjangRachis)
      )
      colorScoreLebarPetiola = getMostCommonColor(
        kebunItems.map((item) => item.colorScoreLebarPetiola)
      )
      colorScoreTebalPetiola = getMostCommonColor(
        kebunItems.map((item) => item.colorScoreTebalPetiola)
      )
      colorScoreJumlahAnakDaun = getMostCommonColor(
        kebunItems.map((item) => item.colorScoreJumlahAnakDaun)
      )
      colorScorePanjangAnakDaun = getMostCommonColor(
        kebunItems.map((item) => item.colorScorePanjangAnakDaun)
      )
      colorScoreLebarAnakDaun = getMostCommonColor(
        kebunItems.map((item) => item.colorScoreLebarAnakDaun)
      )
    }

    if (newScoresKebun[kebun].totalLuas > 0) {
      newScoresKebun[kebun].totalSeleksiKebun /= newScoresKebun[kebun].totalLuas
    }

    const totalSeleksiKebun = newScoresKebun[kebun].totalSeleksiKebun
    let colorCategory = 'black'
    if (totalSeleksiKebun >= 90) {
      colorCategory = 'gold'
    } else if (totalSeleksiKebun >= 85 && totalSeleksiKebun < 90) {
      colorCategory = 'green'
    } else if (totalSeleksiKebun >= 80 && totalSeleksiKebun < 85) {
      colorCategory = 'red'
    } else {
      colorCategory = 'black'
    }

    // Use the first item's fase_tbm as the key
    const firstItem = Object.values(data).find((item) => item.kebun === kebun)
    const faseTbm = firstItem ? firstItem.vw_fase_tbm : 'default'

    processedScoresKebun.push({
      [faseTbm]: {
        regional: newScoresKebun[kebun].regional,
        kebun,
        luas: newScoresKebun[kebun].totalLuas,
        totalSeleksiKebun,
        colorCategory,
        calculatedTbm: faseTbm,
        ascoreLingkarBatang: avgAscoreLingkarBatang,
        ascoreJumlahPelepah: avgAscoreJumlahPelepah,
        ascoreTinggiBatang: avgAscoreTinggiBatang,
        ascoreKerapatanPokok: avgAscoreKerapatanPokok,
        ascorePanjangRachis: avgAscorePanjangRachis,
        ascoreLebarPetiola: avgAscoreLebarPetiola,
        ascoreTebalPetiola: avgAscoreTebalPetiola,
        ascoreJumlahAnakDaun: avgAscoreJumlahAnakDaun,
        ascorePanjangAnakDaun: avgAscorePanjangAnakDaun,
        ascoreLebarAnakDaun: avgAscoreLebarAnakDaun,
        colorScoreLingkarBatang,
        colorScoreJumlahPelepah,
        colorScoreTinggiBatang,
        colorScorePanjangRachis,
        colorScoreLebarPetiola,
        colorScoreTebalPetiola,
        colorScoreJumlahAnakDaun,
        colorScorePanjangAnakDaun,
        colorScoreLebarAnakDaun,
      },
    })
  })

  // Calculate average scores for regional
  const processedScoresRegional: Array<{
    [key: string]: any
  }> = []
  Object.keys(newScoresRegional).forEach((regional) => {
    if (newScoresRegional[regional].totalLuas > 0) {
      newScoresRegional[regional].totalSeleksiRegional /=
        newScoresRegional[regional].totalLuas
    }

    // Use the first item's fase_tbm as the key
    const firstItem = Object.values(data).find(
      (item) => item.regional === regional
    )
    const faseTbm = firstItem ? firstItem.vw_fase_tbm : 'default'

    processedScoresRegional.push({
      [faseTbm]: {
        regional,
        totalSeleksiRegional: newScoresRegional[regional].totalSeleksiRegional,
      },
    })
  })

  // Calculate TBM results
  const tbmResultsUpdate: { [key: string]: number } = {}
  Object.values(data).forEach((item) => {
    const faseTbm = item.vw_fase_tbm
    const luas = Number.parseFloat(item.luas_ha)
    if (tbmResultsUpdate[faseTbm]) {
      tbmResultsUpdate[faseTbm] += luas
    } else {
      tbmResultsUpdate[faseTbm] = luas
    }
  })

  // Calculate score results by fase_tbm
  const scoreJumlahPelepahResultsUpdate: any = {
    score100: newScores.filter((item) => {
      const key = Object.keys(item)[0]
      return item[key].scoreJumlahPelepah === 100
    }).length,
    score90: newScores.filter((item) => {
      const key = Object.keys(item)[0]
      return item[key].scoreJumlahPelepah === 90
    }).length,
    score80: newScores.filter((item) => {
      const key = Object.keys(item)[0]
      return item[key].scoreJumlahPelepah === 80
    }).length,
    total: newScores.length,
  }

  const scoreLingkarBatangResultsUpdate: any = {
    score100: newScores.filter((item) => {
      const key = Object.keys(item)[0]
      return item[key].scoreLingkarBatang === 100
    }).length,
    score90: newScores.filter((item) => {
      const key = Object.keys(item)[0]
      return item[key].scoreLingkarBatang === 90
    }).length,
    score80: newScores.filter((item) => {
      const key = Object.keys(item)[0]
      return item[key].scoreLingkarBatang === 80
    }).length,
    total: newScores.length,
  }

  const newScoresAllKebun = processScoreDataAllKebun(newScoresAll)
  const newScoresAllRegional = processScoreDataAllRegional(newScoresAll)

  return {
    newScores,
    newScoresKebun: processedScoresKebun,
    newScoresAll,
    newScoresAllKebun,
    newScoresAllRegional,
    newScoresRegional: processedScoresRegional,
    newRegionalBlackBlockCount,
    tbmResultsUpdate,
    scoreJumlahPelepahResultsUpdate,
    scoreLingkarBatangResultsUpdate,
  }
}

interface ColorCount {
  [key: string]: number
}

export function countColorCategories(
  data: Array<{ colorCategory: string }>
): ColorCount {
  return data.reduce((acc: ColorCount, item) => {
    const color = item.colorCategory
    acc[color] = (acc[color] || 0) + 1
    return acc
  }, {})
}

interface LuasByColor {
  [key: string]: number
}

export function sumLuasByColorCategory(
  data: Array<{ colorCategory: string; luas: number }>
): LuasByColor {
  return data.reduce((acc: LuasByColor, item) => {
    const color = item.colorCategory
    acc[color] = (acc[color] || 0) + item.luas
    return acc
  }, {})
}

export function processRegionalData(
  data: Array<{ regional: string }>,
  rpcOptions: string[]
): { [key: string]: Array<{ regional: string }> } {
  // Group data by regional
  const regionalData = data.reduce(
    (acc: { [key: string]: Array<{ regional: string }> }, item) => {
      if (!acc[item.regional]) {
        acc[item.regional] = []
      }
      acc[item.regional].push(item)
      return acc
    },
    {}
  )

  // Ensure all RPCs are represented
  rpcOptions.forEach((rpc) => {
    if (!regionalData[rpc]) {
      regionalData[rpc] = []
    }
  })

  return regionalData
}

interface TbmResults {
  totalLuasHa: number
  totalPokokSekarang: number
  totalCalJumlahPelepah: number
  totalCalLingkarBatang: number
  avgPelepah: number
  avgLingkarBatang: number
}

export function calculateTbmResults(data: { [key: string]: any }): TbmResults {
  const totalLuasHa = Object.values(data).reduce(
    (acc, curr) => acc + Number.parseFloat(curr.luas_ha),
    0
  )

  const totalPokokSekarang = Object.values(data).reduce(
    (acc, curr) => acc + Number.parseFloat(curr.jumlah_pokok_sekarang),
    0
  )

  const totalCalJumlahPelepah = Object.values(data).reduce(
    (acc, curr) => acc + Number.parseFloat(curr.cal_jumlah_pelepah),
    0
  )

  const totalCalLingkarBatang = Object.values(data).reduce(
    (acc, curr) => acc + Number.parseFloat(curr.cal_lingkar_batang),
    0
  )

  return {
    totalLuasHa,
    totalPokokSekarang,
    totalCalJumlahPelepah,
    totalCalLingkarBatang,
    avgPelepah: totalCalJumlahPelepah / totalPokokSekarang,
    avgLingkarBatang: totalCalLingkarBatang / totalPokokSekarang,
  }
}

export function processColorData(scores: any[]) {
  if (scores.length === 0) {
    return {
      colorData: { black: 0, red: 0, green: 0, gold: 0 },
      colorDataLuas: { black: 0, red: 0, green: 0, gold: 0 },
    }
  }

  const data = scores.map((item) => {
    let key = Object.keys(item)[0]
    const data = item[key]
    if (key === 'tbm4') {
      key = 'TBM > 3'
    }
    return [
      key.toUpperCase(),
      data.regional,
      data.kebun,
      data.afdeling,
      data.blok,
      data.luas,
      data.jumPelepah,
      data.scoreLingkarBatang,
      data.scoreJumlahPelepah,
      data.scoreTinggiBatang,
      data.scoreKerapatanPokok,
      data.scorePanjangRachis,
      data.scoreLebarPetiola,
      data.scoreTebalPetiola,
      data.scoreJumlahAnakDaun,
      data.scorePanjangAnakDaun,
      data.scoreLebarAnakDaun,
      data.totalSeleksian,
      data.colorCategory,
    ]
  })

  // Calculate color data counts
  const colorData = data.reduce(
    (acc, item) => {
      const colorCategory = item[18] as keyof typeof acc
      if (colorCategory in acc) {
        acc[colorCategory] += 1
      } else {
        acc[colorCategory] = 1
      }
      return acc
    },
    { black: 0, red: 0, green: 0, gold: 0 }
  )

  // Calculate color data areas
  const colorDataLuas = data.reduce(
    (acc, item) => {
      const colorCategory = item[18] as keyof typeof acc
      const luas = item[5]
      if (colorCategory in acc) {
        acc[colorCategory] += luas
      } else {
        acc[colorCategory] = luas
      }
      return acc
    },
    { black: 0, red: 0, green: 0, gold: 0 }
  )

  return { colorData, colorDataLuas }
}

export function processScoreDataAllKebun(newScoresAll: any[]): any[] {
  // Group by kebun
  const kebunMap: { [key: string]: any } = {}

  newScoresAll.forEach((item) => {
    if (!kebunMap[item.kebun]) {
      kebunMap[item.kebun] = {
        id: item.kebun,
        regional: item.regional,
        kebun: item.kebun,
        ascoreLingkarBatang: 0,
        ascoreJumlahPelepah: 0,
        ascoreTinggiBatang: 0,
        ascoreKerapatanPokok: 0,
        ascorePanjangRachis: 0,
        ascoreLebarPetiola: 0,
        ascoreTebalPetiola: 0,
        ascoreJumlahAnakDaun: 0,
        ascorePanjangAnakDaun: 0,
        ascoreLebarAnakDaun: 0,

        totalSeleksian: 0,
        colorCategory: '',
        luas: 0,
        varietas: item.varietas,
        tahun_tanam: item.tahun_tanam,
        umur: item.umur,
        fase_tbm: item.fase_tbm,
        vw_fase_tbm: item.vw_fase_tbm,
        colorScoreJumlahPelepah: '',
        colorScoreLingkarBatang: '',
        colorScoreTinggiBatang: '',
        colorScorePanjangRachis: '',
        colorScoreLebarPetiola: '',
        colorScoreTebalPetiola: '',
        colorScoreJumlahAnakDaun: '',
        colorScorePanjangAnakDaun: '',
        colorScoreLebarAnakDaun: '',
      }
    }

    // Calculate weighted averages
    const current = kebunMap[item.kebun]
    const itemWeight = item.luas

    current.ascoreLingkarBatang += item.ascoreLingkarBatang * itemWeight
    current.ascoreJumlahPelepah += item.ascoreJumlahPelepah * itemWeight
    current.ascoreTinggiBatang += item.ascoreTinggiBatang * itemWeight
    current.ascoreKerapatanPokok += item.ascoreKerapatanPokok * itemWeight

    current.ascorePanjangRachis += item.ascorePanjangRachis * itemWeight
    current.ascoreLebarPetiola += item.ascoreLebarPetiola * itemWeight
    current.ascoreTebalPetiola += item.ascoreTebalPetiola * itemWeight
    current.ascoreJumlahAnakDaun += item.ascoreJumlahAnakDaun * itemWeight
    current.ascorePanjangAnakDaun += item.ascorePanjangAnakDaun * itemWeight
    current.ascoreLebarAnakDaun += item.ascoreLebarAnakDaun * itemWeight

    current.totalSeleksian += item.totalSeleksian * itemWeight
    current.luas += itemWeight
  })

  // Finalize averages and determine colors
  const kebunScores: any[] = Object.values(kebunMap).map((kebun) => {
    if (kebun.luas > 0) {
      kebun.ascoreLingkarBatang /= kebun.luas
      kebun.ascoreJumlahPelepah /= kebun.luas
      kebun.ascoreTinggiBatang /= kebun.luas
      kebun.ascoreKerapatanPokok /= kebun.luas

      kebun.ascorePanjangRachis /= kebun.luas
      kebun.ascoreLebarPetiola /= kebun.luas
      kebun.ascoreTebalPetiola /= kebun.luas
      kebun.ascoreJumlahAnakDaun /= kebun.luas
      kebun.ascorePanjangAnakDaun /= kebun.luas
      kebun.ascoreLebarAnakDaun /= kebun.luas

      kebun.totalSeleksian /= kebun.luas
    }

    // Determine color category based on total score
    if (kebun.totalSeleksian > 92) {
      kebun.colorCategory = 'gold'
    } else if (kebun.totalSeleksian > 87) {
      kebun.colorCategory = 'green'
    } else if (kebun.totalSeleksian > 82) {
      kebun.colorCategory = 'red'
    } else {
      kebun.colorCategory = 'black'
    }

    // Determine color scores
    kebun.colorScoreLingkarBatang = getColorForValue(kebun.ascoreLingkarBatang)
    kebun.colorScoreJumlahPelepah = getColorForValue(kebun.ascoreJumlahPelepah)
    kebun.colorScoreTinggiBatang = getColorForValue(kebun.ascoreTinggiBatang)
    kebun.colorScorePanjangRachis = getColorForValue(kebun.ascorePanjangRachis)
    kebun.colorScoreLebarPetiola = getColorForValue(kebun.ascoreLebarPetiola)
    kebun.colorScoreTebalPetiola = getColorForValue(kebun.ascoreTebalPetiola)
    kebun.colorScoreJumlahAnakDaun = getColorForValue(
      kebun.ascoreJumlahAnakDaun
    )
    kebun.colorScorePanjangAnakDaun = getColorForValue(
      kebun.ascorePanjangAnakDaun
    )
    kebun.colorScoreLebarAnakDaun = getColorForValue(kebun.ascoreLebarAnakDaun)

    return kebun
  })

  return kebunScores
}

// Helper function for color determination
function getColorForValue(value: number): string {
  if (value > 92) return 'green'
  if (value > 87) return 'yellow'
  return 'red'
}

export function processScoreDataAllRegional(newScoresAll: any[]): any[] {
  // Group by regional
  const regionalMap: { [key: string]: any } = {}

  newScoresAll.forEach((item) => {
    if (!regionalMap[item.regional]) {
      regionalMap[item.regional] = {
        id: item.regional,
        regional: item.regional,
        ascoreLingkarBatang: 0,
        ascoreJumlahPelepah: 0,
        ascoreTinggiBatang: 0,
        ascoreKerapatanPokok: 0,

        ascorePanjangRachis: 0,
        ascoreLebarPetiola: 0,
        ascoreTebalPetiola: 0,
        ascoreJumlahAnakDaun: 0,
        ascorePanjangAnakDaun: 0,
        ascoreLebarAnakDaun: 0,
        totalSeleksian: 0,
        colorCategory: '',
        luas: 0,
        varietas: item.varietas,
        tahun_tanam: item.tahun_tanam,
        umur: item.umur,
        fase_tbm: item.fase_tbm,
        vw_fase_tbm: item.vw_fase_tbm,
        colorScoreJumlahPelepah: '',
        colorScoreLingkarBatang: '',
        colorScoreTinggiBatang: '',
        colorScorePanjangRachis: '',
        colorScoreLebarPetiola: '',
        colorScoreTebalPetiola: '',
        colorScoreJumlahAnakDaun: '',
        colorScorePanjangAnakDaun: '',
        colorScoreLebarAnakDaun: '',
      }
    }

    // Calculate weighted averages
    const current = regionalMap[item.regional]
    const itemWeight = item.luas

    current.ascoreLingkarBatang += item.ascoreLingkarBatang * itemWeight
    current.ascoreJumlahPelepah += item.ascoreJumlahPelepah * itemWeight
    current.ascoreTinggiBatang += item.ascoreTinggiBatang * itemWeight
    current.ascoreKerapatanPokok += item.ascoreKerapatanPokok * itemWeight

    current.ascorePanjangRachis += item.ascorePanjangRachis * itemWeight
    current.ascoreLebarPetiola += item.ascoreLebarPetiola * itemWeight
    current.ascoreTebalPetiola += item.ascoreTebalPetiola * itemWeight
    current.ascoreJumlahAnakDaun += item.ascoreJumlahAnakDaun * itemWeight
    current.ascorePanjangAnakDaun += item.ascorePanjangAnakDaun * itemWeight
    current.ascoreLebarAnakDaun += item.ascoreLebarAnakDaun * itemWeight

    current.totalSeleksian += item.totalSeleksian * itemWeight
    current.luas += itemWeight
  })

  // Finalize averages and determine colors
  const regionalScores: any[] = Object.values(regionalMap).map((regional) => {
    if (regional.luas > 0) {
      regional.ascoreLingkarBatang /= regional.luas
      regional.ascoreJumlahPelepah /= regional.luas
      regional.ascoreTinggiBatang /= regional.luas
      regional.ascoreKerapatanPokok /= regional.luas

      regional.ascorePanjangRachis /= regional.luas
      regional.ascoreLebarPetiola /= regional.luas
      regional.ascoreTebalPetiola /= regional.luas
      regional.ascoreJumlahAnakDaun /= regional.luas
      regional.ascorePanjangAnakDaun /= regional.luas
      regional.ascoreLebarAnakDaun /= regional.luas

      regional.totalSeleksian /= regional.luas
    }

    // Determine color category based on total score
    if (regional.totalSeleksian > 92) {
      regional.colorCategory = 'gold'
    } else if (regional.totalSeleksian > 87) {
      regional.colorCategory = 'green'
    } else if (regional.totalSeleksian > 82) {
      regional.colorCategory = 'red'
    } else {
      regional.colorCategory = 'black'
    }

    // Determine color scores
    regional.colorScoreLingkarBatang = getColorForValue(
      regional.ascoreLingkarBatang
    )
    regional.colorScoreJumlahPelepah = getColorForValue(
      regional.ascoreJumlahPelepah
    )
    regional.colorScoreTinggiBatang = getColorForValue(
      regional.ascoreTinggiBatang
    )
    regional.colorScorePanjangRachis = getColorForValue(
      regional.ascorePanjangRachis
    )
    regional.colorScoreLebarPetiola = getColorForValue(
      regional.ascoreLebarPetiola
    )
    regional.colorScoreTebalPetiola = getColorForValue(
      regional.ascoreTebalPetiola
    )
    regional.colorScoreJumlahAnakDaun = getColorForValue(
      regional.ascoreJumlahAnakDaun
    )
    regional.colorScorePanjangAnakDaun = getColorForValue(
      regional.ascorePanjangAnakDaun
    )
    regional.colorScoreLebarAnakDaun = getColorForValue(
      regional.ascoreLebarAnakDaun
    )

    return regional
  })

  return regionalScores
}

type Dataset = any[]

const parseRange = (
  range: string | number
): { min: number; max: number; isMinOnly?: boolean } => {
  if (typeof range === 'number') {
    return { min: range, max: range }
  }

  if (range.includes('>=')) {
    const value = Number.parseFloat(range.replace('>=', '').trim())
    return { min: value, max: Number.POSITIVE_INFINITY, isMinOnly: true }
  }

  if (range.includes('<=')) {
    const value = Number.parseFloat(range.replace('<=', '').trim())
    return { min: Number.NEGATIVE_INFINITY, max: value, isMinOnly: true }
  }

  if (range.includes('<')) {
    const value = Number.parseFloat(range.replace('<', '').trim())
    return { min: Number.NEGATIVE_INFINITY, max: value - 0.01, isMinOnly: true }
  }

  if (range.includes('>')) {
    const value = Number.parseFloat(range.replace('>', '').trim())
    return { min: value + 0.01, max: Number.POSITIVE_INFINITY, isMinOnly: true }
  }

  if (range.includes('-')) {
    const [minStr, maxStr] = range.split('-').map((s) => s.trim())
    return {
      min: Number.parseFloat(minStr),
      max: Number.parseFloat(maxStr),
    }
  }

  // If it's just a string number
  const numValue = Number.parseFloat(range.toString())
  return { min: numValue, max: numValue }
}

const getScore = (
  dataset: Dataset,
  age: number,
  value: number,
  metric:
    | 'lingkarBatang'
    | 'jumlahPelepah'
    | 'tinggiTanaman'
    | 'panjangRachis'
    | 'lebarPetiola'
    | 'tebalPetiola'
    | 'jumlahAnakDaun'
    | 'panjangAnakDaun'
    | 'lebarAnakDaun',
  bV: number,
  tV: number
): number => {
  if (!dataset || dataset.length === 0) {
    console.error('Dataset is empty')
    return 0
  }

  const ageData = dataset.find((item) => item.umur === age)
  if (!ageData) {
    console.log(`No data found for age ${age}`)
    console.log(
      'Available ages:',
      dataset.map((item) => item.umur)
    )
    return 0
  }

  const range = ageData[metric]
  if (!range) {
    console.error(`No range data found for metric ${metric} at age ${age}`)
    return 0
  }

  if (bV === 4 && tV === 2025) {
    // APRIL 2025: Use range-based scoring with 100, 90, 80 thresholds

    // Handle simple numeric ranges
    if (
      typeof range.skor100 === 'number' &&
      typeof range.skor90 === 'number' &&
      typeof range.skor80 === 'number'
    ) {
      if (value >= range.skor100) return 100
      if (value >= range.skor90) return 90
      if (value >= range.skor80) return 80
      return 80 // Below minimum threshold
    }

    // Handle string ranges
    const score100Range = parseRange(range.skor100)
    const score90Range = parseRange(range.skor90)
    const score80Range = parseRange(range.skor80)

    // Check for 100 score
    if (score100Range.isMinOnly) {
      if (
        score100Range.max === Number.POSITIVE_INFINITY &&
        value >= score100Range.min
      )
        return 100
      if (
        score100Range.min === Number.NEGATIVE_INFINITY &&
        value <= score100Range.max
      )
        return 100
    } else {
      if (value >= score100Range.min && value <= score100Range.max) return 100
    }

    // Check for 90 score
    if (score90Range.isMinOnly) {
      if (
        score90Range.max === Number.POSITIVE_INFINITY &&
        value >= score90Range.min
      )
        return 90
      if (
        score90Range.min === Number.NEGATIVE_INFINITY &&
        value <= score90Range.max
      )
        return 90
    } else {
      if (value >= score90Range.min && value <= score90Range.max) return 90
    }

    // Check for 80 score
    if (score80Range.isMinOnly) {
      if (
        score80Range.max === Number.POSITIVE_INFINITY &&
        value >= score80Range.min
      )
        return 80
      if (
        score80Range.min === Number.NEGATIVE_INFINITY &&
        value <= score80Range.max
      )
        return 80
    } else {
      if (value >= score80Range.min && value <= score80Range.max) return 80
    }

    // Default to 80 if no range matches (minimum score)
    return 80
  } else {
    // OTHER PERIODS: Use percentage-based scoring
    if (typeof range === 'number') {
      const score = (value / range) * 100
      return Math.min(Math.max(score, 0), 100) // Clamp between 0 and 100
    }

    // If range is an object, try to use a reference value
    if (typeof range === 'object' && range.reference) {
      const score = (value / range.reference) * 100
      return Math.min(Math.max(score, 0), 100)
    }

    console.error(
      `Invalid range format for metric ${metric} at age ${age} in non-April 2025 period`
    )
    return 0
  }
}

export const getScoreLingkarBatang = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'lingkarBatang', bV, tV)

export const getScoreJumlahPelepah = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'jumlahPelepah', bV, tV)

export const getScoreTinggiTanaman = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'tinggiTanaman', bV, tV)

export const getScoreKerapatanPokok = (
  age: number,
  jum_pokok_awal: number,
  jum_pokok_akhir: number,
  bV: number,
  tV: number
) => {
  if (jum_pokok_awal <= 0) {
    console.error('Initial plant count must be greater than 0')
    return 0
  }

  const result = (jum_pokok_akhir / jum_pokok_awal) * 100
  return Math.min(Math.max(result, 0), 100) // Clamp between 0 and 100
}

export const getScorePanjangRachis = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'panjangRachis', bV, tV)

export const getScoreLebarPetiola = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'lebarPetiola', bV, tV)

export const getScoreTebalPetiola = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'tebalPetiola', bV, tV)

export const getScoreJumlahAnakDaun = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'jumlahAnakDaun', bV, tV)

export const getScorePanjangAnakDaun = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'panjangAnakDaun', bV, tV)

export const getScoreLebarAnakDaun = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getScore(dataset, age, value, 'lebarAnakDaun', bV, tV)

const getColor = (
  dataset: Dataset,
  age: number,
  value: number,
  metric:
    | 'lingkarBatang'
    | 'jumlahPelepah'
    | 'tinggiTanaman'
    | 'panjangRachis'
    | 'lebarPetiola'
    | 'tebalPetiola'
    | 'jumlahAnakDaun'
    | 'panjangAnakDaun'
    | 'lebarAnakDaun',
  bV: number,
  tV: number
): 'danger' | 'warning' | 'default' => {
  if (!dataset || dataset.length === 0) {
    return 'default'
  }

  const ageData = dataset.find((item) => item.umur === age)
  if (!ageData) return 'default'

  const range = ageData[metric]
  if (!range) return 'default'

  if (bV === 4 && tV === 2025) {
    // APRIL 2025: Color based on score ranges
    const score = getScore(dataset, age, value, metric, bV, tV)

    if (score >= 90) return 'default' // Green/good
    if (score >= 80) return 'warning' // Yellow/warning
    return 'danger' // Red/danger
  } else {
    // OTHER PERIODS: Color based on percentage of target
    if (typeof range === 'number') {
      const percentage = (value / range) * 100

      if (percentage >= 90) return 'default' // Green/good
      if (percentage >= 70) return 'warning' // Yellow/warning
      return 'danger' // Red/danger
    }

    // If range is an object with reference value
    if (typeof range === 'object' && range.reference) {
      const percentage = (value / range.reference) * 100

      if (percentage >= 90) return 'default'
      if (percentage >= 70) return 'warning'
      return 'danger'
    }
  }

  return 'default'
}

export const getColorLingkarBatang = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'lingkarBatang', bV, tV)

export const getColorJumlahPelepah = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'jumlahPelepah', bV, tV)

export const getColorTinggiTanaman = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'tinggiTanaman', bV, tV)

export const getColorPanjangRachis = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'panjangRachis', bV, tV)

export const getColorLebarPetiola = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'lebarPetiola', bV, tV)

export const getColorTebalPetiola = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'tebalPetiola', bV, tV)

export const getColorJumlahAnakDaun = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'jumlahAnakDaun', bV, tV)

export const getColorPanjangAnakDaun = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'panjangAnakDaun', bV, tV)

export const getColorLebarAnakDaun = (
  dataset: Dataset,
  age: number,
  value: number,
  bV: number,
  tV: number
) => getColor(dataset, age, value, 'lebarAnakDaun', bV, tV)
