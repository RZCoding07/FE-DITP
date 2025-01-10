import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_IMMATURE;

export const fetchDistinctYears = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/vegetatif-distinct-year`,
      )
      const data = response.data
        return data
    } catch (error) {
      console.error(error)
    }
  }
export const fetchVegetativeProc = async (params: any) => {
  const url = `${API_BASE_URL}/vegetatif-proc`;
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

