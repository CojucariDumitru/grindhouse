import { apiClient } from './client';
import type { MenuItem, MenuResponse } from '../lib/types';

export async function fetchMenu(): Promise<MenuResponse> {
  const { data } = await apiClient.get<MenuResponse>('/menu');
  return data;
}

export async function fetchFeatured(): Promise<MenuItem[]> {
  const { data } = await apiClient.get<MenuItem[]>('/menu/featured');
  return data;
}

/* ---------- admin ---------- */

export async function adminFetchMenu(): Promise<MenuItem[]> {
  const { data } = await apiClient.get<MenuItem[]>('/admin/menu');
  return data;
}

export type MenuItemInput = Partial<
  Pick<
    MenuItem,
    | 'name'
    | 'description'
    | 'price'
    | 'category'
    | 'image'
    | 'isPopular'
    | 'isNew'
    | 'isSpicy'
    | 'isVeg'
    | 'available'
    | 'order'
    | 'calories'
  >
>;

export async function createMenuItem(input: MenuItemInput): Promise<MenuItem> {
  const { data } = await apiClient.post<MenuItem>('/admin/menu', input);
  return data;
}

export async function updateMenuItem(id: string, input: MenuItemInput): Promise<MenuItem> {
  const { data } = await apiClient.patch<MenuItem>(`/admin/menu/${id}`, input);
  return data;
}

export async function toggleAvailability(id: string): Promise<MenuItem> {
  const { data } = await apiClient.patch<MenuItem>(`/admin/menu/${id}/availability`);
  return data;
}

export async function deleteMenuItem(id: string): Promise<void> {
  await apiClient.delete(`/admin/menu/${id}`);
}

export async function uploadMenuImage(dataUri: string): Promise<string> {
  const { data } = await apiClient.post<{ url: string }>('/admin/menu/upload', {
    image: dataUri,
  });
  return data.url;
}
