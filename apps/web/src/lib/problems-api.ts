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
