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

export const fetchDistinctYearsMonth = async (params: any) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/vegetatif-distinct-month`,
        params,
        {
          headers: { 'Content-Type': 'application/json' },
        },
      )
      const data = response.data
        return data
    } catch (error) {
      console.error(error)
    }
  }
  

export const fetchDistinctYearsSerapanBiaya = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/distinct-year-serapan-biaya`,
      )
      const data = response.data
        return data
    } catch (error) {
      console.error(error)
    }
  }
  
// Simple cache using a Map
const cache = new Map();

export const fetchVegetativeProc = async (params: any) => {


  // If the data is not cached, make the API request
  const url = `${API_BASE_URL}/vegetatif-proc`;
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Return the data from the API
  return response.data;
};
export const fetchVegetativeFinal = async (params: any) => {
  // If the data is not cached, make the API request
  const url = `${API_BASE_URL}/vegetatif-final`;
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Return the data from the API
  return response.data;
};

export const fetchSerapanBiaya = async (params: any) => {
  // Generate a cache key based on the params (can use a JSON string or a custom key generator)

  // If the data is not cached, make the API request
  const url = `${API_BASE_URL}/serapan-biaya-bulan-tahun`;
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  });


  // Return the data from the API
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

