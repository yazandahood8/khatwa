import { apiFetch } from './api';

export interface NewMethodStep {
  id: string;
  stepNumber: number;
  description: string;
  expression: string;
  hint: string;
}
export interface NewMethod {
  id: string;
  name: string;
  createdAt: string;
  steps: NewMethodStep[];
  discoverer: { name: string; email: string } | null;
  problem: { id: string; question: string; finalAnswer: string; topicId: string };
}

export const getNewMethods = () => apiFetch<NewMethod[]>('/api/admin/new-methods');
export const approveNewMethod = (id: string, name?: string) =>
  apiFetch(`/api/admin/new-methods/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify(name ? { name } : {}),
  });
export const rejectNewMethod = (id: string) =>
  apiFetch(`/api/admin/new-methods/${id}/reject`, { method: 'POST' });
export const getNotificationCount = () =>
  apiFetch<{ newMethods: number }>('/api/admin/notifications/count');
