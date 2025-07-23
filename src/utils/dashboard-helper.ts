import { dataOne, dataTwo, dataThree, dataFour, dataFive } from "@/data/tbm-params"

interface ScoreDataItem {
  tahun_tanam: string
  id: string
  lingkar_batang_cm: string
  jumlah_pelepah_bh: string
  tinggi_tanaman_cm: string
  jumlah_pokok_awal_tanam: string
  jumlah_pokok_sekarang: string
  regional: string
  kebun: string
  afdeling: string
  blok: string
  luas_ha: string
  cal_jumlah_pelepah: string
  cal_lingkar_batang: string
  umur_saat_ini_bulan: string
  varietas: string
  bulan: string
  tahun: string
  fase_tbm: string // Added fase_tbm property
  vw_fase_tbm: string // Added fase_tbm property
}

interface ScoreItem {
  id: string
  regional: string
  kebun: string
  afdeling: string
  blok: string
  lingkar_batang_cm: string 
  tinggi_tanaman_cm: string
  jumlah_pokok_awal_tanam: string
  jumlah_pokok_sekarang: string
  scoreLingkarBatang: number
  scoreJumlahPelepah: number
  scoreTinggiBatang: number
  scoreKerapatanPokok: number
  totalSeleksian: number
  colorCategory: string
  luas: number
  jumPelepah: number
  varietas: string
  bulan_tanam: string
  tahun_tanam: string
  umur: string
  fase_tbm: string // Added fase_tbm property
  vw_fase_tbm: string
  pica_id?: string // Optional property for PICA ID
}

interface ScoreItemAll {
  id: string
  regional: string
  kebun: string
  afdeling: string
  blok: string
  ascoreLingkarBatang: number
  ascoreJumlahPelepah: number
  ascoreTinggiBatang: number
  ascoreKerapatanPokok: number
  jumlah_pokok_awal_tanam: string
  jumlah_pokok_sekarang: string
  tinggi_tanaman_cm: number
  jumlah_pelepah_bh: string
  lingkar_batang_cm: string
  totalSeleksian: number
  colorCategory: string
  luas: number
  jumPelepah: number
  varietas: string
  tahun_tanam: string
  umur: string
  tbm: string
  bulan: number
  tahun: number
  fase_tbm: string // Added fase_tbm property
  vw_fase_tbm: string
  colorScoreJumlahPelepah: string
  colorScoreLingkarBatang: string
  colorScoreTinggiBatang: string
  pica_id?: string // Optional property for PICA ID
}

interface KebunScore {
  regional: string
  kebun: string
  totalSeleksiKebun: number
  totalLuas: number
}

interface RegionalScore {
  regional: string
  totalSeleksiRegional: number
  totalLuas: number
}

interface ProcessedKebunScore {
  regional: string
  kebun: string
  luas: number
  totalSeleksiKebun: number
  colorCategory: string
  ascoreLingkarBatang: number
  ascoreJumlahPelepah: number
  ascoreTinggiBatang: number
  ascoreKerapatanPokok: number
  colorScoreJumlahPelepah: string
  colorScoreLingkarBatang: string
  colorScoreTinggiBatang: string
  calculatedTbm: string
}


interface ScoreItemAllRegional {
  id: string
  regional: string
  ascoreLingkarBatang: number
  ascoreJumlahPelepah: number
  ascoreTinggiBatang: number
  ascoreKerapatanPokok: number
  totalSeleksian: number
  colorCategory: string
  luas: number
  varietas: string
  tahun_tanam: string
  umur: string
  fase_tbm: string
  vw_fase_tbm: string
  colorScoreJumlahPelepah: string
  colorScoreLingkarBatang: string
  colorScoreTinggiBatang: string
}


interface ProcessedRegionalScore {
  regional: string
  totalSeleksiRegional: number
}

interface ScoreResults {
  score100: number
  score90: number
  score80: number
  total: number
}


interface ScoreItemAllKebun {
  id: string
  regional: string
  kebun: string
  ascoreLingkarBatang: number
  ascoreJumlahPelepah: number
  ascoreTinggiBatang: number
  ascoreKerapatanPokok: number
  totalSeleksian: number
  colorCategory: string
  luas: number
  varietas: string
  tahun_tanam: string
  umur: string
  fase_tbm: string
  vw_fase_tbm: string
  colorScoreJumlahPelepah: string
  colorScoreLingkarBatang: string
  colorScoreTinggiBatang: string
}

interface ProcessScoreDataResult {
  newScores: Array<{ [key: string]: ScoreItem }>
  newScoresKebun: Array<{ [key: string]: ProcessedKebunScore }>
  newScoresRegional: Array<{ [key: string]: ProcessedRegionalScore }>
  newScoresAll: ScoreItemAll[]
  newScoresAllKebun: ScoreItemAllKebun[]
  newScoresAllRegional: ScoreItemAllRegional[] // Fixed type here
  newRegionalBlackBlockCount: { [key: string]: number }
  tbmResultsUpdate: { [key: string]: number }
  scoreJumlahPelepahResultsUpdate: ScoreResults
  scoreLingkarBatangResultsUpdate: ScoreResults
}

type ScoreRange = {
  skor100: string | number
  skor90: string | number
  skor80: string | number
}

type PlantData = {
  fase: string
  umur: number
  lingkarBatang: ScoreRange
  jumlahPelepah: ScoreRange
  tinggiTanaman: ScoreRange
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
}: {
  data: { [key: string]: ScoreDataItem }
  getScoreLingkarBatang: (dataset: PlantData[], age: number, value: number) => number
  getScoreJumlahPelepah: (dataset: PlantData[], age: number, value: number) => number
  getScoreTinggiTanaman: (dataset: PlantData[], age: number, value: number) => number
  getScoreKerapatanPokok: (age: number, initial: number, current: number) => number
  getColorLingkarBatang: (dataset: PlantData[], age: number, value: number) => string
  getColorJumlahPelepah: (dataset: PlantData[], age: number, value: number) => string
  getColorTinggiTanaman: (dataset: PlantData[], age: number, value: number) => string
}): ProcessScoreDataResult {
  const newScores: Array<{ [key: string]: ScoreItem }> = []
  const newScoresKebun: { [key: string]: KebunScore } = {}
  const newScoresAll: ScoreItemAll[] = []
  const newScoresRegional: { [key: string]: RegionalScore } = {}
  const newRegionalBlackBlockCount: { [key: string]: number } = {}

  // Process each item in the data
  Object.values(data).forEach((item:any) => {
    let age = Number.parseInt(item.umur_saat_ini_bulan)
    if (age > 36) {
      age = 36
    }

    const varietas = item.varietas
    const faseTbm = item.vw_fase_tbm // Get fase_tbm from the item

    // Set data rules based on varietas


    function compareCaseInsensitive(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase();
}

    let dataRules: PlantData[] = []


if (compareCaseInsensitive(varietas, "DP Yangambi") || 
    compareCaseInsensitive(varietas, "DP PPKS 718") || 
    compareCaseInsensitive(varietas, "DP 239")) {
  dataRules = dataOne;
} else if (compareCaseInsensitive(varietas, "DP Langkat")) {
  dataRules = dataTwo;
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
  dataRules = dataThree;
} else if (
  compareCaseInsensitive(varietas, "SF Lame") ||
  compareCaseInsensitive(varietas, "SF MTG") ||
  compareCaseInsensitive(varietas, "SF Yangambi") ||
  compareCaseInsensitive(varietas, "Bakrie") ||
  compareCaseInsensitive(varietas, "Topaz") ||
  compareCaseInsensitive(varietas, "Sriwijaya Sampoerna") ||
  compareCaseInsensitive(varietas, "Verdant")
) {
  dataRules = dataFour;
} else if (compareCaseInsensitive(varietas, "DP 239")) {
  dataRules = dataFive;
}

    // Calculate scores
    const scoreLingkarBatang = getScoreLingkarBatang(dataRules, age, Number.parseFloat(item.lingkar_batang_cm)) * 0.4
    const scoreJumlahPelepah = getScoreJumlahPelepah(dataRules, age, Number.parseFloat(item.jumlah_pelepah_bh)) * 0.2
    const scoreTinggiBatang = getScoreTinggiTanaman(dataRules, age, Number.parseFloat(item.tinggi_tanaman_cm)) * 0.1
    const scoreKerapatanPokok =
      getScoreKerapatanPokok(
        age,
        Number.parseFloat(item.jumlah_pokok_awal_tanam),
        Number.parseFloat(item.jumlah_pokok_sekarang),
      ) * 0.3

    const ascoreLingkarBatang = getScoreLingkarBatang(dataRules, age, Number.parseFloat(item.lingkar_batang_cm))
    const ascoreJumlahPelepah = getScoreJumlahPelepah(dataRules, age, Number.parseFloat(item.jumlah_pelepah_bh))
    const ascoreTinggiBatang = getScoreTinggiTanaman(dataRules, age, Number.parseFloat(item.tinggi_tanaman_cm))
    const ascoreKerapatanPokok = getScoreKerapatanPokok(
      age,
      Number.parseFloat(item.jumlah_pokok_awal_tanam),
      Number.parseFloat(item.jumlah_pokok_sekarang),
    )

    const colorScoreLingkarBatang = getColorLingkarBatang(dataRules, age, Number.parseFloat(item.lingkar_batang_cm))
    const colorScoreJumlahPelepah = getColorJumlahPelepah(dataRules, age, Number.parseFloat(item.jumlah_pelepah_bh))
    const colorScoreTinggiBatang = getColorTinggiTanaman(dataRules, age, Number.parseFloat(item.tinggi_tanaman_cm))

    const totalSeleksian = scoreLingkarBatang + scoreJumlahPelepah + scoreTinggiBatang + scoreKerapatanPokok

    // Determine color category
    let colorCategory = ""
    if (totalSeleksian < 80) {
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
  })

  // Calculate average scores for kebun
  const processedScoresKebun: Array<{ [key: string]: ProcessedKebunScore }> = []
  Object.keys(newScoresKebun).forEach((kebun) => {
    // Calculate average actual scores for kebun
    let totalAscoreLingkarBatang = 0
    let totalAscoreJumlahPelepah = 0
    let totalAscoreTinggiBatang = 0
    let totalAscoreKerapatanPokok = 0
    const totalLuas = newScoresKebun[kebun].totalLuas

    // Find all items for this kebun to calculate weighted average scores
    const kebunItems = newScoresAll.filter((item) => item.kebun === kebun)

    kebunItems.forEach((item) => {
      const itemLuas = item.luas
      totalAscoreLingkarBatang += item.ascoreLingkarBatang * itemLuas
      totalAscoreJumlahPelepah += item.ascoreJumlahPelepah * itemLuas
      totalAscoreTinggiBatang += item.ascoreTinggiBatang * itemLuas
      totalAscoreKerapatanPokok += item.ascoreKerapatanPokok * itemLuas
    })

    // Calculate weighted averages
    const avgAscoreLingkarBatang = totalLuas > 0 ? totalAscoreLingkarBatang / totalLuas : 0
    const avgAscoreJumlahPelepah = totalLuas > 0 ? totalAscoreJumlahPelepah / totalLuas : 0
    const avgAscoreTinggiBatang = totalLuas > 0 ? totalAscoreTinggiBatang / totalLuas : 0
    const avgAscoreKerapatanPokok = totalLuas > 0 ? totalAscoreKerapatanPokok / totalLuas : 0

    // Determine color scores for kebun (using the first item's data rules as reference)
    const firstKebunItem = kebunItems[0]
    let colorScoreLingkarBatang = "default"
    let colorScoreJumlahPelepah = "default"
    let colorScoreTinggiBatang = "default"

    if (firstKebunItem) {
      // Use the most common color for each metric in the kebun
      const lingkarBatangColors = kebunItems.map((item) => item.colorScoreLingkarBatang)
      const jumlahPelepahColors = kebunItems.map((item) => item.colorScoreJumlahPelepah)
      const tinggiBatangColors = kebunItems.map((item) => item.colorScoreTinggiBatang)

      // Helper function to get most common color
      const getMostCommonColor = (colors: string[]) => {
        const colorCount: { [key: string]: number } = {}
        colors.forEach((color) => {
          colorCount[color] = (colorCount[color] || 0) + 1
        })
        return Object.entries(colorCount).sort((a, b) => b[1] - a[1])[0][0]
      }

      colorScoreLingkarBatang = getMostCommonColor(lingkarBatangColors)
      colorScoreJumlahPelepah = getMostCommonColor(jumlahPelepahColors)
      colorScoreTinggiBatang = getMostCommonColor(tinggiBatangColors)
    }

    if (newScoresKebun[kebun].totalLuas > 0) {
      newScoresKebun[kebun].totalSeleksiKebun /= newScoresKebun[kebun].totalLuas
    }

    const totalSeleksiKebun = newScoresKebun[kebun].totalSeleksiKebun
    let colorCategory = "black"
    if (totalSeleksiKebun >= 90) {
      colorCategory = "gold"
    } else if (totalSeleksiKebun >= 85 && totalSeleksiKebun < 90) {
      colorCategory = "green"
    } else if (totalSeleksiKebun >= 80 && totalSeleksiKebun < 85) {
      colorCategory = "red"
    } else {
      colorCategory = "black"
    }
    // Use the first item's fase_tbm as the key (you might need to adjust this based on your requirements)
    const firstItem = Object.values(data).find((item) => item.kebun === kebun)
    const faseTbm = firstItem ? firstItem.vw_fase_tbm : "default"

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
        colorScoreLingkarBatang,
        colorScoreJumlahPelepah,
        colorScoreTinggiBatang,
      },
    })
  })

  // Calculate average scores for regional
  const processedScoresRegional: Array<{ [key: string]: ProcessedRegionalScore }> = []
  Object.keys(newScoresRegional).forEach((regional) => {
    if (newScoresRegional[regional].totalLuas > 0) {
      newScoresRegional[regional].totalSeleksiRegional /= newScoresRegional[regional].totalLuas
    }

    // Use the first item's fase_tbm as the key (you might need to adjust this based on your requirements)
    const firstItem = Object.values(data).find((item) => item.regional === regional)
    const faseTbm = firstItem ? firstItem.vw_fase_tbm : "default"

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
  const scoreJumlahPelepahResultsUpdate: ScoreResults = {
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

  const scoreLingkarBatangResultsUpdate: ScoreResults = {
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

  const newScoresAllRegional = processScoreDataAllRegional(newScoresAll);

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

export function countColorCategories(data: Array<{ colorCategory: string }>): ColorCount {
  return data.reduce((acc: ColorCount, item) => {
    const color = item.colorCategory
    acc[color] = (acc[color] || 0) + 1
    return acc
  }, {})
}

interface LuasByColor {
  [key: string]: number
}

export function sumLuasByColorCategory(data: Array<{ colorCategory: string; luas: number }>): LuasByColor {
  return data.reduce((acc: LuasByColor, item) => {
    const color = item.colorCategory
    acc[color] = (acc[color] || 0) + item.luas
    return acc
  }, {})
}

export function processRegionalData(
  data: Array<{ regional: string }>,
  rpcOptions: string[],
): { [key: string]: Array<{ regional: string }> } {
  // Group data by regional
  const regionalData = data.reduce((acc: { [key: string]: Array<{ regional: string }> }, item) => {
    if (!acc[item.regional]) {
      acc[item.regional] = []
    }
    acc[item.regional].push(item)
    return acc
  }, {})

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

export function calculateTbmResults(data: { [key: string]: ScoreDataItem }): TbmResults {
  const totalLuasHa = Object.values(data).reduce((acc, curr) => acc + Number.parseFloat(curr.luas_ha), 0)

  const totalPokokSekarang = Object.values(data).reduce(
    (acc, curr) => acc + Number.parseFloat(curr.jumlah_pokok_sekarang),
    0,
  )

  const totalCalJumlahPelepah = Object.values(data).reduce(
    (acc, curr) => acc + Number.parseFloat(curr.cal_jumlah_pelepah),
    0,
  )

  const totalCalLingkarBatang = Object.values(data).reduce(
    (acc, curr) => acc + Number.parseFloat(curr.cal_lingkar_batang),
    0,
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
    if (key === "tbm4") {
      key = "TBM > 3"
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
      data.totalSeleksian,
      data.colorCategory,
    ]
  })

  // Calculate color data counts
  const colorData = data.reduce(
    (acc, item) => {
      const colorCategory = item[12] as keyof typeof acc
      if (colorCategory in acc) {
        acc[colorCategory] += 1
      } else {
        acc[colorCategory] = 1
      }
      return acc
    },
    { black: 0, red: 0, green: 0, gold: 0 },
  )

  // Calculate color data areas
  const colorDataLuas = data.reduce(
    (acc, item) => {
      const colorCategory = item[12] as keyof typeof acc
      const luas = item[5]
      if (colorCategory in acc) {
        acc[colorCategory] += luas
      } else {
        acc[colorCategory] = luas
      }
      return acc
    },
    { black: 0, red: 0, green: 0, gold: 0 },
  )

  return { colorData, colorDataLuas }
}

export function processScoreDataByTbmLevel(data: any, scoreFunctions: any) {
  const { getScoreLingkarBatang, getScoreJumlahPelepah, getScoreTinggiTanaman, getScoreKerapatanPokok } = scoreFunctions

  // Initialize result objects
  const tbmResults = { tbm1: 0, tbm2: 0, tbm3: 0, tbm4: 0 }
  const scoreJumlahPelepahResults = {
    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
  }
  const scoreLingkarBatangResults = {
    tbm1: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm2: { score100: 0, score90: 0, score80: 0, total: 0 },
    tbm3: { score100: 0, score90: 0, score80: 0, total: 0 },
  }
  const regionalBlackBlockCount: { [key: string]: number } = {}

  // Process each item
  Object.values(data).forEach((item: any) => {
    // Get TBM level from vw_fase_tbm
    const tbmLevel = item.vw_fase_tbm as keyof typeof scoreJumlahPelepahResults // e.g., "tbm1", "tbm2", etc.

    // Update TBM results (sum of luas)
    if (tbmResults[tbmLevel] !== undefined) {
      tbmResults[tbmLevel] += Number.parseFloat(item.luas_ha) || 0
    }

    // Calculate scores
    const age = Number.parseInt(item.umur_saat_ini_bulan)
    const scoreLingkarBatang = getScoreLingkarBatang(/* params */)
    const scoreJumlahPelepah = getScoreJumlahPelepah(/* params */)

    // Update score results for TBM1-3
    if (tbmLevel === "tbm1" || tbmLevel === "tbm2" || tbmLevel === "tbm3") {
      // Update jumlah pelepah scores
      if (scoreJumlahPelepah === 100) {
        scoreJumlahPelepahResults[tbmLevel].score100++
      } else if (scoreJumlahPelepah === 90) {
        scoreJumlahPelepahResults[tbmLevel].score90++
      } else if (scoreJumlahPelepah === 80) {
        scoreJumlahPelepahResults[tbmLevel].score80++
      }
      scoreJumlahPelepahResults[tbmLevel].total++

      // Update lingkar batang scores
      if (scoreLingkarBatang === 100) {
        scoreLingkarBatangResults[tbmLevel].score100++
      } else if (scoreLingkarBatang === 90) {
        scoreLingkarBatangResults[tbmLevel].score90++
      } else if (scoreLingkarBatang === 80) {
        scoreLingkarBatangResults[tbmLevel].score80++
      }
      scoreLingkarBatangResults[tbmLevel].total++
    }

    // Count black blocks by regional
    const totalSeleksian = 0 /* calculate total score */
    if (totalSeleksian < 80) {
      const regional = (item as ScoreDataItem).regional
      if (regionalBlackBlockCount[regional]) {
        regionalBlackBlockCount[regional]++
      } else {
        regionalBlackBlockCount[regional] = 1
      }
    }
  })

  return {
    tbmResults,
    scoreJumlahPelepahResults,
    scoreLingkarBatangResults,
    regionalBlackBlockCount,
  }
}



export function processScoreDataAllKebun(newScoresAll: ScoreItemAll[]): ScoreItemAllKebun[] {
  // Group by kebun
  const kebunMap: { [key: string]: ScoreItemAllKebun } = {}

  newScoresAll.forEach((item) => {
    if (!kebunMap[item.kebun]) {
      kebunMap[item.kebun] = {
        id: item.kebun, // Using kebun name as ID
        regional: item.regional,
        kebun: item.kebun,
        ascoreLingkarBatang: 0,
        ascoreJumlahPelepah: 0,
        ascoreTinggiBatang: 0,
        ascoreKerapatanPokok: 0,
        totalSeleksian: 0,
        colorCategory: '',
        luas: 0,
        varietas: item.varietas, // Will use the first varietas found - may need adjustment
        tahun_tanam: item.tahun_tanam, // Will use the first tahun_tanam found
        umur: item.umur, // Will use the first umur found
        fase_tbm: item.fase_tbm, // Will use the first fase_tbm found
        vw_fase_tbm: item.vw_fase_tbm, // Will use the first vw_fase_tbm found
        colorScoreJumlahPelepah: '',
        colorScoreLingkarBatang: '',
        colorScoreTinggiBatang: '',
      }
    }

    // Calculate weighted averages
    const current = kebunMap[item.kebun]
    const itemWeight = item.luas

    current.ascoreLingkarBatang += item.ascoreLingkarBatang * itemWeight
    current.ascoreJumlahPelepah += item.ascoreJumlahPelepah * itemWeight
    current.ascoreTinggiBatang += item.ascoreTinggiBatang * itemWeight
    current.ascoreKerapatanPokok += item.ascoreKerapatanPokok * itemWeight
    current.totalSeleksian += item.totalSeleksian * itemWeight
    current.luas += itemWeight
  })

  // Finalize averages and determine colors
  const kebunScores: ScoreItemAllKebun[] = Object.values(kebunMap).map((kebun) => {
    if (kebun.luas > 0) {
      kebun.ascoreLingkarBatang /= kebun.luas
      kebun.ascoreJumlahPelepah /= kebun.luas
      kebun.ascoreTinggiBatang /= kebun.luas
      kebun.ascoreKerapatanPokok /= kebun.luas
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

    // Determine color scores (you'll need to implement your color logic here)
    // This is a placeholder - adjust according to your actual color determination logic
    kebun.colorScoreLingkarBatang = getColorForValue(kebun.ascoreLingkarBatang)
    kebun.colorScoreJumlahPelepah = getColorForValue(kebun.ascoreJumlahPelepah)
    kebun.colorScoreTinggiBatang = getColorForValue(kebun.ascoreTinggiBatang)

    return kebun
  })

  return kebunScores
}

// Helper function for color determination - replace with your actual logic
function getColorForValue(value: number): string {
  if (value > 92) return 'green'
  if (value > 87) return 'yellow'
  return 'red'
}



export function processScoreDataAllRegional(newScoresAll: ScoreItemAll[]): ScoreItemAllRegional[] {
  // Group by regional
  const regionalMap: { [key: string]: ScoreItemAllRegional } = {}

  newScoresAll.forEach((item) => {
    if (!regionalMap[item.regional]) {
      regionalMap[item.regional] = {
        id: item.regional, // Using regional name as ID
        regional: item.regional,
        ascoreLingkarBatang: 0,
        ascoreJumlahPelepah: 0,
        ascoreTinggiBatang: 0,
        ascoreKerapatanPokok: 0,
        totalSeleksian: 0,
        colorCategory: '',
        luas: 0,
        varietas: item.varietas, // Will use the first varietas found
        tahun_tanam: item.tahun_tanam, // Will use the first tahun_tanam found
        umur: item.umur, // Will use the first umur found
        fase_tbm: item.fase_tbm, // Will use the first fase_tbm found
        vw_fase_tbm: item.vw_fase_tbm, // Will use the first vw_fase_tbm found
        colorScoreJumlahPelepah: '',
        colorScoreLingkarBatang: '',
        colorScoreTinggiBatang: '',
      }
    }

    // Calculate weighted averages
    const current = regionalMap[item.regional]
    const itemWeight = item.luas

    current.ascoreLingkarBatang += item.ascoreLingkarBatang * itemWeight
    current.ascoreJumlahPelepah += item.ascoreJumlahPelepah * itemWeight
    current.ascoreTinggiBatang += item.ascoreTinggiBatang * itemWeight
    current.ascoreKerapatanPokok += item.ascoreKerapatanPokok * itemWeight
    current.totalSeleksian += item.totalSeleksian * itemWeight
    current.luas += itemWeight
  })

  // Finalize averages and determine colors
  const regionalScores: ScoreItemAllRegional[] = Object.values(regionalMap).map((regional) => {
    if (regional.luas > 0) {
      regional.ascoreLingkarBatang /= regional.luas
      regional.ascoreJumlahPelepah /= regional.luas
      regional.ascoreTinggiBatang /= regional.luas
      regional.ascoreKerapatanPokok /= regional.luas
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

    // Determine color scores - adjust according to your actual color determination logic
    regional.colorScoreLingkarBatang = getColorForValue(regional.ascoreLingkarBatang)
    regional.colorScoreJumlahPelepah = getColorForValue(regional.ascoreJumlahPelepah)
    regional.colorScoreTinggiBatang = getColorForValue(regional.ascoreTinggiBatang)

    return regional
  })

  return regionalScores
}



