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
  // Generate a cache key based on the params (can use a JSON string or a custom key generator)
  const cacheKey = JSON.stringify(params);

  // Check if the data is already in the cache
  if (cache.has(cacheKey)) {
    console.log('Returning cached data');
    return cache.get(cacheKey); // Return the cached data
  }

  // If the data is not cached, make the API request
  const url = `${API_BASE_URL}/vegetatif-proc`;
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Store the response data in the cache
  cache.set(cacheKey, response.data);

  // Return the data from the API
  return response.data;
};

export const fetchSerapanBiaya = async (params: any) => {
  // Generate a cache key based on the params (can use a JSON string or a custom key generator)
  const cacheKey = JSON.stringify(params);

  // Check if the data is already in the cache
  if (cache.has(cacheKey)) {
    console.log('Returning cached data');
    return cache.get(cacheKey); // Return the cached data
  }

  // If the data is not cached, make the API request
  const url = `${API_BASE_URL}/serapan-biaya-bulan-tahun`;
  const response = await axios.post(url, params, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Store the response data in the cache
  cache.set(cacheKey, response.data);

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
