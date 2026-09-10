
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://web-production-2f6b.up.railway.app',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API;
