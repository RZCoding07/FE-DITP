// This file contains synchronous versions of the score calculation functions
// that don't rely on API calls, making them more reliable for the dashboard
import axios from "axios"

const apiUrl = import.meta.env.VITE_API_IMMATURE

async function fetchStandardVegetatif(criteria: number, varietas: string) {
  if (
    varietas === "DP Yangambi" || 
    varietas === "DP PPKS 718" || varietas === "DP 239") {
    return await axios.get(`${apiUrl}/interpolate?idx=1&y_column_index=${criteria}`)
  }

  if (varietas === "DP Langkat") {
    return await axios.get(`${apiUrl}/interpolate?idx=2&y_column_index=${criteria}`)
  }

  if (
    varietas === "DP Simalungun" ||
    varietas === "DP Avros" ||
    varietas === "DP 540" ||
    varietas === "Lonsum" ||
    varietas === "Dami Mas" ||
    varietas === "Bina Sawit Makmur" ||
    varietas === "Sarana Inti Pratama" ||
    varietas === "Panca Surya Garden"
  ) {
    return await axios.get(`${apiUrl}/interpolate?idx=3&y_column_index=${criteria}`)
  }

  if (
    varietas === "SF Lame" ||
    varietas === "SF MTG" ||
    varietas === "SF Yangambi" ||
    varietas === "Bakrie" ||
    varietas === "Topaz" ||
    varietas === "Sriwijaya Sampoerna" ||
    varietas === "Verdant"
  ) {
    return await axios.get(`${apiUrl}/interpolate?idx=4&y_column_index=${criteria}`)
  }

  if (varietas === "DP 239") {
    return await axios.get(`${apiUrl}/interpolate?idx=5&y_column_index=${criteria}`)
  }
}

export async function getScoreTinggiTanaman(age: number, value: number, varietas: string) {

  const criteria = 1 // Example criteria for vegetative standard

  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScoreJumlahPelepah(age: number, value: number, varietas: string) {
  const criteria = 2 // Example criteria for vegetative standard

  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScorePanjangRachis(age: number, value: number, varietas: string) {
  const criteria = 3 // Example criteria for vegetative standard

  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScoreLebarPetiola(age: number, value: number, varietas: string) {
  const criteria = 4 // Example criteria for vegetative standard

  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScoreTebalPetiola(age: number, value: number, varietas: string) {
  const criteria = 5 // Example criteria for vegetative standard

  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScoreJumlahAnakDaun(age: number, value: number, varietas: string) {
  const criteria = 6 // Example criteria for vegetative standard

  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScorePanjangAnakDaun(age: number, value: number, varietas: string) {
  const criteria = 7 // Example criteria for vegetative standard
  
  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScoreLebarAnakDaun(age: number, value: number, varietas: string) {
  const criteria = 8 // Example criteria for vegetative standard
 
  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScoreLingkarBatang(age: number, value: number, varietas: string) {
  const criteria = 8 // Example criteria for vegetative standard
 
  try {
    const response = await fetchStandardVegetatif(criteria, varietas);
    if (!response || !response.data) return 0;

    const standardValue = response.data[age.toString()];
    if (!standardValue) return 0;

    const score = (value / standardValue) * 100;
    return score >= 100 ? 100 : score;
  } catch (error) {
    console.error("Error calculating height score:", error);
    return 0;
  }
}

export async function getScoreKerapatanPokok(age: number, initial: number, current: number) {
  const criteria = 9 // Example criteria for vegetative standard
  const result = (current / initial) * 100
  return result > 100 ? 100 : result
}
