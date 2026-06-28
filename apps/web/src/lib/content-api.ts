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
export const getPublishedLessons = (topicId: string) =>
  apiFetch<Lesson[]>(`/api/lessons?topicId=${topicId}&published=true`);
export const getLessonById = (id: string) => apiFetch<Lesson>(`/api/lessons/${id}`);

// ---- student progress ----
export interface ProgressRow {
  lessonId: string;
  watchTimeSeconds: number;
  completedAt: string | null;
}
export interface StudentDashboard {
  lastLesson: {
    id: string;
    title: string;
    topicId: string;
    topicName: string;
    watchTimeSeconds: number;
    durationMinutes: number | null;
  } | null;
  completedCount: number;
  inProgressCount: number;
}
export const getMyProgress = () => apiFetch<ProgressRow[]>('/api/me/progress');
export const getStudentDashboard = () => apiFetch<StudentDashboard>('/api/me/dashboard');
export const saveProgress = (lessonId: string, watchTimeSeconds: number, completed?: boolean) =>
  apiFetch(`/api/lessons/${lessonId}/progress`, {
    method: 'POST',
    body: JSON.stringify({ watchTimeSeconds, completed }),
  });

export interface SearchResults {
  lessons: { id: string; title: string; topicId: string }[];
  topics: { id: string; nameAr: string; levelId: string }[];
}
export const searchContent = (q: string) =>
  apiFetch<SearchResults>(`/api/search?q=${encodeURIComponent(q)}`);

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

// ---- video upload / playback ----
export const getLessonUploadUrl = (id: string, contentType: string, filename: string) =>
  apiFetch<{ uploadUrl: string; key: string }>(`/api/lessons/${id}/upload-url`, {
    method: 'POST',
    body: JSON.stringify({ contentType, filename }),
  });

export const attachLessonVideo = (id: string, key: string) =>
  apiFetch<Lesson>(`/api/lessons/${id}/attach-video`, {
    method: 'POST',
    body: JSON.stringify({ key }),
  });

export const getLessonPlayback = (id: string) =>
  apiFetch<{ url: string }>(`/api/lessons/${id}/playback`);

/** رفع مباشر للتخزين مع تتبّع التقدّم — direct PUT to storage with progress (XHR). */
export function uploadToUrl(
  url: string,
  file: File,
  onProgress: (percent: number) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', url);
    xhr.setRequestHeader('Content-Type', file.type);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`فشل الرفع (HTTP ${xhr.status})`));
    xhr.onerror = () => reject(new Error('فشل الاتصال أثناء الرفع'));
    xhr.send(file);
  });
}
