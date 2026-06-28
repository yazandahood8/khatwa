import { apiFetch } from './api';
import type {
  CreateSubjectInput,
  CreateGradeInput,
  CreateLevelInput,
  CreateTopicInput,
  CreateLessonInput,
  UpdateLessonInput,
} from '@khatwa/shared';

export interface Subject {
  id: string;
  nameAr: string;
  nameHe?: string | null;
  icon?: string | null;
  isActive: boolean;
  orderIndex: number;
  _count?: { grades: number };
}
export interface Grade {
  id: string;
  gradeNumber: number;
  subjectId: string;
  _count?: { levels: number };
}
export interface Level {
  id: string;
  name: string;
  gradeId: string;
  _count?: { topics: number };
}
export interface Topic {
  id: string;
  nameAr: string;
  description?: string | null;
  levelId: string;
  orderIndex: number;
  _count?: { lessons: number; problems: number };
}
export interface Lesson {
  id: string;
  title: string;
  description?: string | null;
  topicId: string;
  durationMinutes?: number | null;
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
  orderIndex: number;
  isPublished: boolean;
}

// ---- reads ----
export const getSubjects = () => apiFetch<Subject[]>('/api/subjects');
export const getGrades = (subjectId: string) =>
  apiFetch<Grade[]>(`/api/grades?subjectId=${subjectId}`);
export const getLevels = (gradeId: string) => apiFetch<Level[]>(`/api/levels?gradeId=${gradeId}`);
export const getTopics = (levelId: string) => apiFetch<Topic[]>(`/api/topics?levelId=${levelId}`);
export const getLessons = (topicId: string) =>
  apiFetch<Lesson[]>(`/api/lessons?topicId=${topicId}`);

// ---- subjects ----
export const createSubject = (body: CreateSubjectInput) =>
  apiFetch<Subject>('/api/subjects', { method: 'POST', body: JSON.stringify(body) });
export const deleteSubject = (id: string) =>
  apiFetch(`/api/subjects/${id}`, { method: 'DELETE' });

// ---- grades ----
export const createGrade = (body: CreateGradeInput) =>
  apiFetch<Grade>('/api/grades', { method: 'POST', body: JSON.stringify(body) });
export const deleteGrade = (id: string) => apiFetch(`/api/grades/${id}`, { method: 'DELETE' });

// ---- levels ----
export const createLevel = (body: CreateLevelInput) =>
  apiFetch<Level>('/api/levels', { method: 'POST', body: JSON.stringify(body) });
export const deleteLevel = (id: string) => apiFetch(`/api/levels/${id}`, { method: 'DELETE' });

// ---- topics ----
export const createTopic = (body: CreateTopicInput) =>
  apiFetch<Topic>('/api/topics', { method: 'POST', body: JSON.stringify(body) });
export const deleteTopic = (id: string) => apiFetch(`/api/topics/${id}`, { method: 'DELETE' });

// ---- lessons ----
export const createLesson = (body: CreateLessonInput) =>
  apiFetch<Lesson>('/api/lessons', { method: 'POST', body: JSON.stringify(body) });
export const updateLesson = (id: string, body: UpdateLessonInput) =>
  apiFetch<Lesson>(`/api/lessons/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteLesson = (id: string) => apiFetch(`/api/lessons/${id}`, { method: 'DELETE' });
export const publishLesson = (id: string, isPublished: boolean) =>
  apiFetch<Lesson>(`/api/lessons/${id}/publish`, {
    method: 'POST',
    body: JSON.stringify({ isPublished }),
  });
