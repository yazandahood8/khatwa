import { apiFetch } from './api';

export interface Badge {
  key: string;
  label: string;
  icon: string;
  earned: boolean;
}
export interface StudentStats {
  points: number;
  completedLessons: number;
  inProgressLessons: number;
  problemsAttempted: number;
  problemsSolved: number;
  firstTrySolved: number;
  accuracy: number;
  streak: number;
  bestStreak: number;
  studyMinutes: number;
  badges: Badge[];
  week: { completedLessons: number; problemsSolved: number };
  difficult: { problemId: string; question: string; attempts: number }[];
}

export const getFullProgress = () => apiFetch<StudentStats>('/api/progress/me');

export interface ParentReport {
  student: { name: string; grade: number | null; level: string | null };
  stats: StudentStats;
}
export const getParentReport = (studentId: string) =>
  apiFetch<ParentReport>(`/api/parent/report/${studentId}`);

export interface AdminAnalytics {
  students: number;
  activeToday: number;
  lessons: number;
  problems: number;
  attempts: number;
  aiSessions: number;
  aiTokens: number;
  aiCostUsd: number;
  planCounts: Record<string, number>;
  paid: number;
  trials: number;
  conversion: number;
}
export const getAdminAnalytics = () => apiFetch<AdminAnalytics>('/api/admin/analytics');
