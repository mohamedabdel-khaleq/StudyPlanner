/*
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://web-production-2f6b.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
*/


const BASE_URL = 'https://web-production-2f6b.up.railway.app';

const API = async (endpoint, options = {}) => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(
      data?.detail || data?.message || 'Something went wrong'
    );
  }

  return data;
};

export default API;
