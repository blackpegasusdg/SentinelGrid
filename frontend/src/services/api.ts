// ============================================================
// SentinelGrid — Centralised API Service
// ============================================================

import axios, { AxiosError, AxiosInstance } from 'axios';
import type {
  Tenant, TenantCreate,
  User, UserCreate, UserLogin, AuthResponse,
  Asset, AssetCreate, AssetUpdate,
  VerificationTokenResponse, VerificationStatusResponse, VerifyOwnershipResponse,
  Scan, ScanCreate,
} from '@/types';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

const api: AxiosInstance = axios.create({
  baseURL: `${baseURL}/api/v1`,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sg_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Global 401 handler
api.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('sg_token');
      localStorage.removeItem('sg_user');
      window.dispatchEvent(new Event('sg:unauthorized'));
    }
    return Promise.reject(error);
  }
);

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const detail = (error.response?.data as { detail?: string })?.detail;
    if (detail) return detail;
    if (error.message) return error.message;
  }
  return 'An unexpected error occurred';
}

export const health = {
  check: () => axios.get<{ status: string; project: string }>(`${baseURL}/health`),
};

export const tenants = {
  create: (data: TenantCreate) => api.post<Tenant>('/tenants/', data).then(r => r.data),
  list: () => api.get<Tenant[]>('/tenants/').then(r => r.data),
};

export const users = {
  register: (data: UserCreate) => api.post<User>('/users/register', data).then(r => r.data),
  login: (data: UserLogin) => api.post<AuthResponse>('/users/login', data).then(r => r.data),
  me: () => api.get<User>('/users/me').then(r => r.data),
};

export const assets = {
  create: (data: AssetCreate) => api.post<Asset>('/assets/', data).then(r => r.data),
  list: () => api.get<Asset[]>('/assets/').then(r => r.data),
  get: (id: number) => api.get<Asset>(`/assets/${id}`).then(r => r.data),
  update: (id: number, data: AssetUpdate) => api.put<Asset>(`/assets/${id}`, data).then(r => r.data),
  delete: (id: number) => api.delete(`/assets/${id}`).then(r => r.data),
  generateVerificationToken: (id: number) =>
    api.post<VerificationTokenResponse>(`/assets/${id}/verification-token`).then(r => r.data),
  verifyOwnership: (id: number) =>
    api.post<VerifyOwnershipResponse>(`/assets/${id}/verify-ownership`).then(r => r.data),
  getVerificationStatus: (id: number) =>
    api.get<VerificationStatusResponse>(`/assets/${id}/verification-status`).then(r => r.data),
};

export const scans = {
  create: (data: ScanCreate) => api.post<Scan>('/scans/', data).then(r => r.data),
  list: () => api.get<Scan[]>('/scans/').then(r => r.data),
  get: (id: number) => api.get<Scan>(`/scans/${id}`).then(r => r.data),
};

export default api;
