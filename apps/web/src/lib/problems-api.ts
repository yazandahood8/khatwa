import { apiFetch } from './api';
import type { CreateProblemInput, UpdateProblemInput } from '@khatwa/shared';

export interface ProblemListItem {
  id: string;
  question: string;
  finalAnswer: string;
  difficulty: string;
  orderIndex: number;
  _count?: { methods: number; commonMistakes: number };
}

export interface SolutionStep {
  id: string;
  stepNumber: number;
  description: string;
  expression: string;
  hint: string;
}
export interface SolutionMethod {
  id: string;
  name: string;
  isRecommended: boolean;
  steps: SolutionStep[];
}
export interface CommonMistake {
  id: string;
  description: string;
  wrongExample: string;
  correction: string;
}
export interface ProblemFull extends ProblemListItem {
  topicId: string;
  code: string | null;
  language: string | null; // "csharp" = مسألة برمجة يقيّمها AI
  starterCode: string | null;
  answerTolerance: number;
  allowFreeMethod: boolean;
  methods: SolutionMethod[];
  commonMistakes: CommonMistake[];
}

export const getProblems = (topicId: string) =>
  apiFetch<ProblemListItem[]>(`/api/problems?topicId=${topicId}`);
export const getProblem = (id: string) => apiFetch<ProblemFull>(`/api/problems/${id}`);
export const createProblem = (body: CreateProblemInput) =>
  apiFetch<ProblemFull>('/api/problems', { method: 'POST', body: JSON.stringify(body) });
export const updateProblem = (id: string, body: UpdateProblemInput) =>
  apiFetch<ProblemFull>(`/api/problems/${id}`, { method: 'PUT', body: JSON.stringify(body) });
export const deleteProblem = (id: string) =>
  apiFetch(`/api/problems/${id}`, { method: 'DELETE' });

// ---- solving (students) ----
export interface CheckResult {
  correct: boolean;
  attemptsCount: number;
  completed: boolean;
}
export const checkAnswer = (
  problemId: string,
  body: { answer: string; steps?: string[]; methodUsed?: string },
) =>
  apiFetch<CheckResult>(`/api/problems/${problemId}/check`, {
    method: 'POST',
    body: JSON.stringify(body),
  });

export interface RunResult {
  ok: boolean; // تجمّع وتشغّل بلا خطأ
  output: string; // ناتج التشغيل أو رسالة الخطأ
  note?: string;
  match: boolean; // طابق الناتج المرجعي
  gradable: boolean; // قابل للتقييم بالناتج (للمسألة ناتج مرجعي)
  attemptsCount?: number;
  completed?: boolean;
}
export const runCode = (problemId: string, code: string) =>
  apiFetch<RunResult>(`/api/problems/${problemId}/run`, {
    method: 'POST',
    body: JSON.stringify({ code }),
  });

export interface AttemptInfo {
  attemptsCount: number;
  isCorrect: boolean;
  completedAt: string | null;
  stepsTaken: string[] | null;
}
export const getAttempt = (problemId: string) =>
  apiFetch<AttemptInfo | null>(`/api/problems/${problemId}/attempt`);

export interface TopicProgressItem {
  problemId: string;
  isCorrect: boolean;
  completedAt: string | null;
  attemptsCount: number;
}
export const getTopicProgress = (topicId: string) =>
  apiFetch<TopicProgressItem[]>(`/api/topics/${topicId}/progress`);
