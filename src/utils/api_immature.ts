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
    const url = `${API_BASE_URL}/vegetatif-proc?${new URLSearchParams(params).toString()}`;
    const response = await axios.get(url, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  };
  

export const fetchKebun = async (params: any) => {
  const url = `${API_BASE_URL}/get-kebun-where-reg-vegetatif`;
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};

export const fetchAfd = async (params: any) => {
  const url = `${API_BASE_URL}/get-afd-where-kebun-vegetatif`;
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
}
