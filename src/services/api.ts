import { store } from '@/store';
import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.18.41:3000', // ajusta segun tu caso
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});