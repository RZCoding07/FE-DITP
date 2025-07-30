import { dataNewOne, dataNewTwo, dataNewThree, dataNewFour, dataNewFive } from "@/data/tbm-params"

interface ScoreDataItemExtended {
  tahun_tanam: string
  id: string
  lingkar_batang_cm: string
  jumlah_pelepah_bh: string
  tinggi_tanaman_cm: string
  lebar_petiola_cm?: string
  tebal_petiola_cm?: string
  jumlah_anak_daun?: string
  panjang_anak_daun_cm?: string
  lebar_anak_daun_cm?: string
  panjang_rachis_cm?: string
  jumlah_pokok_awal_tanam: string
  jumlah_pokok_sekarang: string
  regional: string
  kebun: string
  afdeling: string
  blok: string
  luas_ha: string
  umur_saat_ini_bulan: string
  varietas: string
  bulan: string
  tahun: string
  fase_tbm: string
  vw_fase_tbm: string
  pica_id?: string
}

interface ScoreItemExtended {
  id: string
  regional: string
  kebun: string
  afdeling: string
  blok: string
  lingkar_batang_cm: string
  tinggi_tanaman_cm: string
  lebar_petiola_cm?: string
  tebal_petiola_cm?: string
  jumlah_anak_daun?: string
  panjang_anak_daun_cm?: string
  lebar_anak_daun_cm?: string
  panjang_rachis_cm?: string
  jumlah_pokok_awal_tanam: string
  jumlah_pokok_sekarang: string
  scoreLingkarBatang: number
  scoreJumlahPelepah: number
  scoreTinggiBatang: number
  scoreKerapatanPokok: number
  scoreLebarPetiola?: number
  scoreTebalPetiola?: number
  scoreJumlahAnakDaun?: number
  scorePanjangAnakDaun?: number
  scoreLebarAnakDaun?: number
  scorePanjangRachis?: number
  totalSeleksian: number
  colorCategory: string
  luas: number
  jumPelepah: number
  varietas: string
  bulan_tanam: string
  tahun_tanam: string
  umur: string
  fase_tbm: string
  vw_fase_tbm: string
  pica_id?: string
}

interface ExtendedPlantData {
  fase: string
  umur: number
  lingkarBatang: number
  jumlahPelepah: number
  tinggiTanaman: number
  lebarPetiola?: number
  tebalPetiola?: number
  jumlahAnakDaun?: number
  panjangAnakDaun?: number
  lebarAnakDaun?: number
  panjangRachis?: number
}

interface ProcessScoreDataExtendedResult {
  newScores: Array<{ [key: string]: ScoreItemExtended }>
  newScoresAll: ScoreItemExtended[]
  tbmResultsUpdate: { [key: string]: number }
  newRegionalBlackBlockCount: { [key: string]: number }
}

export function processScoreDataExtended({
  data,
  bulan,
}: {
  data: { [key: string]: ScoreDataItemExtended }
  bulan: string
}): ProcessScoreDataExtendedResult {
  const newScores: Array<{ [key: string]: ScoreItemExtended }> = []
  const newScoresAll: ScoreItemExtended[] = []
  const newRegionalBlackBlockCount: { [key: string]: number } = {}
  const tbmResultsUpdate: { [key: string]: number } = {}

  // Helper function to get parameter value from dataset
  const getParameterValue = (dataset: ExtendedPlantData[], age: number, parameter: keyof ExtendedPlantData): number => {
    const ageData = dataset.find((item) => item.umur === age)
    if (!ageData) {
      // Find closest age if exact match not found
      const sortedData = dataset.sort((a, b) => Math.abs(a.umur - age) - Math.abs(b.umur - age))
      return Number(sortedData[0]?.[parameter]) || 0
    }
    return Number(ageData[parameter]) || 0
  }

  // Helper function to calculate ratio-based score
  const calculateRatioScore = (measuredValue: number, standardValue: number, weight: number): number => {
    if (standardValue === 0) return 0
    return (measuredValue / standardValue) * weight
  }

  // Helper function to get dataset based on varietas
  const getDataset = (varietas: string): ExtendedPlantData[] => {
    const compareCaseInsensitive = (str1: string, str2: string): boolean => {
      return str1.toLowerCase() === str2.toLowerCase()
    }

    if (
      compareCaseInsensitive(varietas, "DP Yangambi") ||
      compareCaseInsensitive(varietas, "DP PPKS 718") ||
      compareCaseInsensitive(varietas, "DP 239")
    ) {
      return dataNewOne
    } else if (compareCaseInsensitive(varietas, "DP Langkat")) {
      return dataNewTwo
    } else if (
      compareCaseInsensitive(varietas, "DP Simalungun") ||
      compareCaseInsensitive(varietas, "DP Avros") ||
      compareCaseInsensitive(varietas, "DP 540") ||
      compareCaseInsensitive(varietas, "Lonsum") ||
      compareCaseInsensitive(varietas, "Dami Mas") ||
      compareCaseInsensitive(varietas, "Bina Sawit Makmur") ||
      compareCaseInsensitive(varietas, "Sarana Inti Pratama") ||
      compareCaseInsensitive(varietas, "Panca Surya Garden")
    ) {
      return dataNewThree
    } else if (
      compareCaseInsensitive(varietas, "SF Lame") ||
      compareCaseInsensitive(varietas, "SF MTG") ||
      compareCaseInsensitive(varietas, "SF Yangambi") ||
      compareCaseInsensitive(varietas, "Bakrie") ||
      compareCaseInsensitive(varietas, "Topaz") ||
      compareCaseInsensitive(varietas, "Sriwijaya Sampoerna") ||
      compareCaseInsensitive(varietas, "Verdant")
    ) {
      return dataNewFour
    } else {
      return dataNewFive
    }
  }

  // Process each item in the data
  Object.values(data).forEach((item: ScoreDataItemExtended) => {
    let age = Number.parseInt(item.umur_saat_ini_bulan)
    if (age > 36) {
      age = 36
    }

    const varietas = item.varietas
    const faseTbm = item.vw_fase_tbm
    const dataset = getDataset(varietas)

    // Get standard values from dataset
    const standardLingkarBatang = getParameterValue(dataset, age, "lingkarBatang")
    const standardJumlahPelepah = getParameterValue(dataset, age, "jumlahPelepah")
    const standardTinggiTanaman = getParameterValue(dataset, age, "tinggiTanaman")
    const standardLebarPetiola = getParameterValue(dataset, age, "lebarPetiola")
    const standardTebalPetiola = getParameterValue(dataset, age, "tebalPetiola")
    const standardJumlahAnakDaun = getParameterValue(dataset, age, "jumlahAnakDaun")
    const standardPanjangAnakDaun = getParameterValue(dataset, age, "panjangAnakDaun")
    const standardLebarAnakDaun = getParameterValue(dataset, age, "lebarAnakDaun")
    const standardPanjangRachis = getParameterValue(dataset, age, "panjangRachis")

    // Get measured values
    const measuredLingkarBatang = Number.parseFloat(item.lingkar_batang_cm)
    const measuredJumlahPelepah = Number.parseFloat(item.jumlah_pelepah_bh)
    const measuredTinggiTanaman = Number.parseFloat(item.tinggi_tanaman_cm)
    const measuredLebarPetiola = Number.parseFloat(item.lebar_petiola_cm || "0")
    const measuredTebalPetiola = Number.parseFloat(item.tebal_petiola_cm || "0")
    const measuredJumlahAnakDaun = Number.parseFloat(item.jumlah_anak_daun || "0")
    const measuredPanjangAnakDaun = Number.parseFloat(item.panjang_anak_daun_cm || "0")
    const measuredLebarAnakDaun = Number.parseFloat(item.lebar_anak_daun_cm || "0")
    const measuredPanjangRachis = Number.parseFloat(item.panjang_rachis_cm || "0")

    // Calculate scores using ratio method
    const scoreLingkarBatang = calculateRatioScore(measuredLingkarBatang, standardLingkarBatang, 25) // 25%
    const scoreJumlahPelepah = calculateRatioScore(measuredJumlahPelepah, standardJumlahPelepah, 15) // 15%
    const scoreTinggiBatang = calculateRatioScore(measuredTinggiTanaman, standardTinggiTanaman, 10) // 10%

    // Calculate Kerapatan Pokok score
    const initialPokok = Number.parseFloat(item.jumlah_pokok_awal_tanam)
    const currentPokok = Number.parseFloat(item.jumlah_pokok_sekarang)
    const kerapatanRatio = initialPokok > 0 ? (currentPokok / initialPokok) * 100 : 0
    const scoreKerapatanPokok = kerapatanRatio * 0.15 // 15%

    // Calculate additional parameter scores
    const scoreLebarPetiola = calculateRatioScore(measuredLebarPetiola, standardLebarPetiola, 5) // 5%
    const scoreTebalPetiola = calculateRatioScore(measuredTebalPetiola, standardTebalPetiola, 5) // 5%
    const scoreJumlahAnakDaun = calculateRatioScore(measuredJumlahAnakDaun, standardJumlahAnakDaun, 10) // 10%
    const scorePanjangAnakDaun = calculateRatioScore(measuredPanjangAnakDaun, standardPanjangAnakDaun, 5) // 5%
    const scoreLebarAnakDaun = calculateRatioScore(measuredLebarAnakDaun, standardLebarAnakDaun, 5) // 5%
    const scorePanjangRachis = calculateRatioScore(measuredPanjangRachis, standardPanjangRachis, 5) // 5%

    // Calculate total score
    const totalSeleksian =
      scoreLingkarBatang +
      scoreJumlahPelepah +
      scoreTinggiBatang +
      scoreKerapatanPokok +
      scoreLebarPetiola +
      scoreTebalPetiola +
      scoreJumlahAnakDaun +
      scorePanjangAnakDaun +
      scoreLebarAnakDaun +
      scorePanjangRachis

    // Determine color category
    let colorCategory = ""
    if (totalSeleksian < 82) {
      colorCategory = "black"
      // Count black blocks by regional
      const regional = item.regional
      if (newRegionalBlackBlockCount[regional]) {
        newRegionalBlackBlockCount[regional] += 1
      } else {
        newRegionalBlackBlockCount[regional] = 1
      }
    } else if (totalSeleksian > 92) {
      colorCategory = "gold"
    } else if (totalSeleksian > 87) {
      colorCategory = "green"
    } else if (totalSeleksian > 82) {
      colorCategory = "red"
    } else {
      colorCategory = "black"
    }

    const luas = Number.parseFloat(item.luas_ha)
    const regional = item.regional
    const kebun = item.kebun
    const jumPelepah = Number.parseFloat(item.jumlah_pelepah_bh)

    // Create score item
    const scoreItem: ScoreItemExtended = {
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
      scoreLebarPetiola,
      scoreTebalPetiola,
      scoreJumlahAnakDaun,
      scorePanjangAnakDaun,
      scoreLebarAnakDaun,
      scorePanjangRachis,
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
      lebar_petiola_cm: item.lebar_petiola_cm,
      tebal_petiola_cm: item.tebal_petiola_cm,
      jumlah_anak_daun: item.jumlah_anak_daun,
      panjang_anak_daun_cm: item.panjang_anak_daun_cm,
      lebar_anak_daun_cm: item.lebar_anak_daun_cm,
      panjang_rachis_cm: item.panjang_rachis_cm,
      pica_id: item.pica_id,
    }

    // Add to arrays
    newScores.push({
      [faseTbm]: scoreItem,
    })

    newScoresAll.push(scoreItem)

    // Update TBM results
    if (tbmResultsUpdate[faseTbm]) {
      tbmResultsUpdate[faseTbm] += luas
    } else {
      tbmResultsUpdate[faseTbm] = luas
    }
  })

  return {
    newScores,
    newScoresAll,
    tbmResultsUpdate,
    newRegionalBlackBlockCount,
  }
}

// Helper function to get color category for individual parameters
export function getParameterColorCategory(measuredValue: number, standardValue: number): string {
  if (standardValue === 0) return "red"

  const ratio = (measuredValue / standardValue) * 100

  if (ratio >= 95) return "green"
  if (ratio >= 85) return "yellow"
  return "red"
}

// Function to calculate weighted average scores for kebun level
export function calculateKebunAverageExtended(scores: ScoreItemExtended[]): ScoreItemExtended {
  if (scores.length === 0) throw new Error("No scores provided")

  let totalLuas = 0
  const weightedScores = {
    scoreLingkarBatang: 0,
    scoreJumlahPelepah: 0,
    scoreTinggiBatang: 0,
    scoreKerapatanPokok: 0,
    scoreLebarPetiola: 0,
    scoreTebalPetiola: 0,
    scoreJumlahAnakDaun: 0,
    scorePanjangAnakDaun: 0,
    scoreLebarAnakDaun: 0,
    scorePanjangRachis: 0,
    totalSeleksian: 0,
  }

  scores.forEach((score) => {
    const weight = score.luas
    totalLuas += weight

    weightedScores.scoreLingkarBatang += (score.scoreLingkarBatang || 0) * weight
    weightedScores.scoreJumlahPelepah += (score.scoreJumlahPelepah || 0) * weight
    weightedScores.scoreTinggiBatang += (score.scoreTinggiBatang || 0) * weight
    weightedScores.scoreKerapatanPokok += (score.scoreKerapatanPokok || 0) * weight
    weightedScores.scoreLebarPetiola += (score.scoreLebarPetiola || 0) * weight
    weightedScores.scoreTebalPetiola += (score.scoreTebalPetiola || 0) * weight
    weightedScores.scoreJumlahAnakDaun += (score.scoreJumlahAnakDaun || 0) * weight
    weightedScores.scorePanjangAnakDaun += (score.scorePanjangAnakDaun || 0) * weight
    weightedScores.scoreLebarAnakDaun += (score.scoreLebarAnakDaun || 0) * weight
    weightedScores.scorePanjangRachis += (score.scorePanjangRachis || 0) * weight
    weightedScores.totalSeleksian += score.totalSeleksian * weight
  })

  // Calculate averages
  if (totalLuas > 0) {
    Object.keys(weightedScores).forEach((key) => {
      weightedScores[key as keyof typeof weightedScores] /= totalLuas
    })
  }

  // Determine color category for kebun
  let colorCategory = "black"
  if (weightedScores.totalSeleksian > 92) {
    colorCategory = "gold"
  } else if (weightedScores.totalSeleksian > 87) {
    colorCategory = "green"
  } else if (weightedScores.totalSeleksian > 82) {
    colorCategory = "red"
  }

  // Return averaged score item (using first item as template)
  const template = scores[0]
  return {
    ...template,
    ...weightedScores,
    luas: totalLuas,
    colorCategory,
  }
}
