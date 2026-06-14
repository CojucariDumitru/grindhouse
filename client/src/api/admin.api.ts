import { apiClient } from './client';
import type { DashboardData } from '../lib/types';

export interface LoginResult {
  token: string;
  admin: { id: string; email: string };
}

export async function adminLogin(email: string, password: string): Promise<LoginResult> {
  const { data } = await apiClient.post<LoginResult>('/admin/login', { email, password });
  return data;
}

export async function fetchDashboard(): Promise<DashboardData> {
  const { data } = await apiClient.get<DashboardData>('/admin/dashboard');
  return data;
}
