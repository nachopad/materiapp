import axios from 'axios';
import { VITE_API_BASE_URL } from '../config';

export const api = axios.create({
    baseURL: VITE_API_BASE_URL,
    withCredentials: true,
    timeout: 8000,
});
