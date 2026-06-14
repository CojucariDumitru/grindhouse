import { apiClient } from './client';
import type { Reservation, ReservationStatus } from '../lib/types';

export interface ReservationInput {
  name: string;
  email: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string;
  guests: number;
  notes?: string;
}

export interface ReservationResult {
  reservation: Reservation;
  dateLabel: string;
  emailSent: boolean;
}

export async function createReservation(input: ReservationInput): Promise<ReservationResult> {
  const { data } = await apiClient.post<ReservationResult>('/reservations', input);
  return data;
}

/* ---------- admin ---------- */

export async function adminFetchReservations(params?: {
  status?: ReservationStatus;
  date?: string;
}): Promise<Reservation[]> {
  const { data } = await apiClient.get<Reservation[]>('/admin/reservations', { params });
  return data;
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus,
): Promise<{ reservation: Reservation; emailSent: boolean }> {
  const { data } = await apiClient.patch(`/admin/reservations/${id}/status`, { status });
  return data;
}

export async function deleteReservation(id: string): Promise<void> {
  await apiClient.delete(`/admin/reservations/${id}`);
}
