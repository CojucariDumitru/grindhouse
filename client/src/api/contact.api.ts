import { apiClient } from './client';
import type { ContactMessage } from '../lib/types';

export interface ContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export async function sendContactMessage(
  input: ContactInput,
): Promise<{ message: ContactMessage; emailSent: boolean }> {
  const { data } = await apiClient.post('/contact', input);
  return data;
}

/* ---------- admin ---------- */

export async function adminFetchMessages(unreadOnly = false): Promise<ContactMessage[]> {
  const { data } = await apiClient.get<ContactMessage[]>('/admin/messages', {
    params: unreadOnly ? { unread: 'true' } : undefined,
  });
  return data;
}

export async function markMessageRead(id: string, read = true): Promise<ContactMessage> {
  const { data } = await apiClient.patch<ContactMessage>(`/admin/messages/${id}/read`, { read });
  return data;
}

export async function deleteMessage(id: string): Promise<void> {
  await apiClient.delete(`/admin/messages/${id}`);
}
